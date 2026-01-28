'use client';

import { useState, useEffect } from 'react';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import ModalContainer from '@/components/general/ModalContainer';
import { X, Loader2, Search, UserPlus, Check } from 'lucide-react';
import { studiesApi, adminUsersApi } from '@/api';
import { User } from '@/types/user';
import { StudyMemberRole } from '@/types/study';
import s from './style.module.scss';

interface SelectedUser {
    userId: string;
    role: StudyMemberRole;
}

interface AddMemberModalProps {
    isOpen: boolean;
    studyId: string;
    existingMemberIds: string[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddMemberModal({ 
    isOpen, 
    studyId, 
    existingMemberIds,
    onClose, 
    onSuccess 
}: AddMemberModalProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<SelectedUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // 유저 목록 조회
    useEffect(() => {
        if (!isOpen) return;

        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const response = await adminUsersApi.getUsers({ limit: 100 });
                // 이미 멤버인 유저 제외
                const availableUsers = response.data.filter(
                    user => !existingMemberIds.includes(user.id)
                );
                setUsers(availableUsers);
                setFilteredUsers(availableUsers);
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setError('유저 목록을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [isOpen, existingMemberIds]);

    // 검색 필터
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsers(users);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = users.filter(user => 
            user.name?.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.handle.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const toggleUserSelection = (userId: string) => {
        setSelectedUsers(prev => {
            const existing = prev.find(u => u.userId === userId);
            if (existing) {
                // 이미 선택됨 -> 해제
                return prev.filter(u => u.userId !== userId);
            } else {
                // 선택 추가
                return [...prev, { userId, role: StudyMemberRole.MEMBER }];
            }
        });
    };

    const updateUserRole = (userId: string, role: StudyMemberRole) => {
        setSelectedUsers(prev => 
            prev.map(u => u.userId === userId ? { ...u, role } : u)
        );
    };

    const isUserSelected = (userId: string) => {
        return selectedUsers.some(u => u.userId === userId);
    };

    const getSelectedUserRole = (userId: string): StudyMemberRole => {
        return selectedUsers.find(u => u.userId === userId)?.role || StudyMemberRole.MEMBER;
    };

    const handleSubmit = async () => {
        if (selectedUsers.length === 0) {
            setError('멤버를 선택해주세요.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // 병렬로 모든 멤버 추가
            await Promise.all(
                selectedUsers.map(({ userId, role }) =>
                    studiesApi.addMember(studyId, {
                        user_id: userId,
                        member_role: role,
                    })
                )
            );

            resetForm();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error('Failed to add members:', err);
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || '멤버 추가에 실패했습니다.');
            } else {
                setError('서버에 연결할 수 없습니다.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSearchQuery('');
        setSelectedUsers([]);
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalContainer>
            <VStack className={s.modal} gap={20} align="start" justify="start">
                {/* Header */}
                <HStack fullWidth align="center" justify="between">
                    <h2 className={s.title}>멤버 추가</h2>
                    <button className={s.closeButton} onClick={handleClose}>
                        <X size={24} />
                    </button>
                </HStack>

                {/* Selected Count */}
                {selectedUsers.length > 0 && (
                    <HStack fullWidth className={s.selectedInfo}>
                        <span>{selectedUsers.length}명 선택됨</span>
                        <button 
                            className={s.clearButton} 
                            onClick={() => setSelectedUsers([])}
                        >
                            전체 해제
                        </button>
                    </HStack>
                )}

                {/* Search */}
                <HStack fullWidth className={s.searchContainer}>
                    <Search size={18} className={s.searchIcon} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="이름, 이메일, 핸들로 검색..."
                        className={s.searchInput}
                    />
                </HStack>

                {/* User List */}
                <VStack fullWidth className={s.userList} gap={8}>
                    {isLoading ? (
                        <HStack fullWidth align="center" justify="center" className={s.loadingContainer}>
                            <Loader2 className={s.spinner} size={24} />
                            <span>로딩 중...</span>
                        </HStack>
                    ) : filteredUsers.length === 0 ? (
                        <p className={s.emptyMessage}>
                            {searchQuery ? '검색 결과가 없습니다.' : '추가할 수 있는 유저가 없습니다.'}
                        </p>
                    ) : (
                        filteredUsers.map(user => {
                            const selected = isUserSelected(user.id);
                            return (
                                <HStack
                                    key={user.id}
                                    fullWidth
                                    align="center"
                                    justify="between"
                                    className={`${s.userItem} ${selected ? s.selected : ''}`}
                                >
                                    <HStack 
                                        gap={12} 
                                        align="center" 
                                        className={s.userInfo}
                                        onClick={() => toggleUserSelection(user.id)}
                                    >
                                        <div className={`${s.checkbox} ${selected ? s.checked : ''}`}>
                                            {selected && <Check size={14} />}
                                        </div>
                                        <div className={s.avatar}>
                                            {user.name?.[0] || user.handle[0]}
                                        </div>
                                        <VStack gap={2} align="start">
                                            <span className={s.userName}>{user.name || user.handle}</span>
                                            <span className={s.userEmail}>{user.email}</span>
                                        </VStack>
                                    </HStack>
                                    {selected && (
                                        <select
                                            value={getSelectedUserRole(user.id)}
                                            onChange={(e) => updateUserRole(user.id, e.target.value as StudyMemberRole)}
                                            className={s.roleSelect}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <option value="MEMBER">멤버</option>
                                            <option value="MANAGER">매니저</option>
                                        </select>
                                    )}
                                </HStack>
                            );
                        })
                    )}
                </VStack>

                {/* Error */}
                {error && <p className={s.error}>{error}</p>}

                {/* Buttons */}
                <HStack fullWidth gap={12} align="center" justify="end">
                    <Button className={s.cancelButton} onClick={handleClose} disabled={isSubmitting}>
                        취소
                    </Button>
                    <Button 
                        className={s.submitButton} 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || selectedUsers.length === 0}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className={s.spinner} size={18} />
                                추가 중...
                            </>
                        ) : (
                            <>
                                <UserPlus size={18} />
                                {selectedUsers.length > 0 ? `${selectedUsers.length}명 추가` : '멤버 추가'}
                            </>
                        )}
                    </Button>
                </HStack>
            </VStack>
        </ModalContainer>
    );
}
