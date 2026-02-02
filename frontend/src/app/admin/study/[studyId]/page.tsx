'use client';

import { VStack } from "@/components/general/VStack";
import { HStack } from "@/components/general/HStack";
import Button from "@/components/general/Button";
import Input from "@/components/general/Input";
import Section from "@/components/general/Section";
import Title from "@/components/study/Title";
import s from './style.module.scss';
import { use, useState, useEffect, useCallback } from 'react';
import { Save, X, Edit2, Loader2, UserPlus, Trash2, Calendar } from 'lucide-react';
import { studiesApi, StudyMember } from '@/api';
import { Study, StudyType, StudyStatus } from '@/types/study';
import { Session } from '@/types/session';
import { sessionsApi } from '@/api';
import AddMemberModal from '@/components/admin/AddMemberModal';
import CreateSessionModal from '@/components/admin/CreateSessionModal';
import MdEditor from '@/components/general/MdEditor';
import UserEditCard from "@/components/admin/UserEditCard";
import ModalContainer from "@/components/general/ModalContainer";

interface StudyDetailData {
    id: string;
    name: string;
    type: string;
    slug?: string;
    status: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
    overview?: {
        description: string;
    };
    members?: StudyMember[];
    sessions?: Session[];
}

export default function StudyDetail({ params }: { params: Promise<{ studyId: string }> }) {
    const { studyId } = use(params);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [study, setStudy] = useState<StudyDetailData | null>(null);
    const [editedStudy, setEditedStudy] = useState<StudyDetailData | null>(null);
    const [members, setMembers] = useState<StudyMember[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isCreateSessionModalOpen, setIsCreateSessionModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<StudyMember | null>(null);

    const fetchStudyData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError('');

            // 병렬로 데이터 조회
            const [studyData, overviewData, membersData, sessionsData] = await Promise.all([
                studiesApi.getStudy(studyId),
                studiesApi.getOverview(studyId).catch(() => ({ description: '' })),
                studiesApi.getMembers(studyId).catch(() => ({ data: [] })),
                sessionsApi.getSessions(studyId).catch(() => ({ data: [] })),
            ]);

            const fullStudyData: StudyDetailData = {
                ...studyData,
                overview: overviewData,
            };

            setStudy(fullStudyData);
            setEditedStudy(fullStudyData);
            setMembers(membersData.data);
            setSessions(sessionsData.data);
        } catch (err) {
            console.error('Failed to fetch study:', err);
            setError('스터디 정보를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, [studyId]);

    useEffect(() => {
        fetchStudyData();
    }, [fetchStudyData]);

    const handleSave = async () => {
        if (!editedStudy) return;

        try {
            setIsSaving(true);

            // 기본 정보 업데이트
            await studiesApi.updateStudy(studyId, {
                name: editedStudy.name,
                type: editedStudy.type as StudyType,
                slug: editedStudy.slug,
                status: editedStudy.status as StudyStatus,
            });

            // Overview 업데이트
            if (editedStudy.overview?.description) {
                await studiesApi.updateOverview(studyId, {
                    description: editedStudy.overview.description,
                });
            }

            setStudy(editedStudy);
            setIsEditing(false);
            alert('저장되었습니다.');
        } catch (err) {
            console.error('Failed to save:', err);
            alert('저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedStudy(study);
        setIsEditing(false);
    };

    const handleInputChange = (field: keyof StudyDetailData, value: string) => {
        setEditedStudy(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleDescriptionChange = (value: string) => {
        setEditedStudy(prev => prev ? {
            ...prev,
            overview: { description: value }
        } : null);
    };

    const handleRemoveMember = async (userId: string) => {
        if (!confirm('정말 이 멤버를 제거하시겠습니까?')) return;

        try {
            await studiesApi.removeMember(studyId, userId);
            // 멤버 목록 새로고침
            fetchStudyData();
        } catch (err) {
            console.error('Failed to remove member:', err);
            alert('멤버 제거에 실패했습니다.');
        }
    };

    const handleRemoveSession = async (sessionId: string) => {
        if (!confirm('정말 이 세션을 제거하시겠습니까?')) return;

        try {
            await sessionsApi.deleteSession(sessionId);
            // 목록 새로고침
            fetchStudyData();
        } catch (err) {
            console.error('Failed to delete session:', err);
            alert('세션 제거에 실패했습니다.');
        }
    };

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <Loader2 className={s.spinner} size={32} />
                <p>로딩 중...</p>
            </VStack>
        );
    }

    if (error || !study || !editedStudy) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <h2>{error || '스터디를 찾을 수 없습니다.'}</h2>
            </VStack>
        );
    }

    return (
        <>
        <VStack
            fullWidth
            fullHeight
            align='start'
            justify='start'
            gap={24}
            className={s.container}
        >
            {/* Header */}
            <HStack fullWidth align="center" justify="between">
                <Title text={`${study.name} 상세`} />
                <HStack gap={12} align="center" justify="end">
                    {isEditing ? (
                        <>
                            <Button className={s.cancelButton} onClick={handleCancel} disabled={isSaving}>
                                <X size={18} />
                                취소
                            </Button>
                            <Button className={s.saveButton} onClick={handleSave} disabled={isSaving}>
                                {isSaving ? <Loader2 className={s.spinner} size={18} /> : <Save size={18} />}
                                {isSaving ? '저장 중...' : '저장'}
                            </Button>
                        </>
                    ) : (
                        <Button className={s.editButton} onClick={() => setIsEditing(true)}>
                            <Edit2 size={18} />
                            수정
                        </Button>
                    )}
                </HStack>
            </HStack>

            {/* 기본 정보 섹션 */}
            <Section title="기본 정보" className={s.section}>
                <VStack fullWidth gap={16} align="start" justify="start">
                    <HStack fullWidth gap={24} align="start" justify="start">
                        <VStack gap={8} align="start" justify="start" className={s.fieldGroup}>
                            <label className={s.label}>스터디 이름</label>
                            {isEditing ? (
                                <Input 
                                    value={editedStudy.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    width="300px"
                                />
                            ) : (
                                <p className={s.value}>{study.name}</p>
                            )}
                        </VStack>
                        <VStack gap={8} align="start" justify="start" className={s.fieldGroup}>
                            <label className={s.label}>타입</label>
                            {isEditing ? (
                                <select 
                                    value={editedStudy.type}
                                    onChange={(e) => handleInputChange('type', e.target.value)}
                                    className={s.select}
                                >
                                    <option value="RED">RED</option>
                                    <option value="WEB">WEB</option>
                                </select>
                            ) : (
                                <span className={`${s.typeBadge} ${s[study.type.toLowerCase()]}`}>
                                    {study.type}
                                </span>
                            )}
                        </VStack>
                        <VStack gap={8} align="start" justify="start" className={s.fieldGroup}>
                            <label className={s.label}>상태</label>
                            {isEditing ? (
                                <select 
                                    value={editedStudy.status}
                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                    className={s.select}
                                >
                                    <option value="active">Active</option>
                                    <option value="archived">Archived</option>
                                    <option value="pending">Pending</option>
                                </select>
                            ) : (
                                <span className={`${s.statusBadge} ${s[study.status]}`}>
                                    {study.status}
                                </span>
                            )}
                        </VStack>
                    </HStack>
                    <VStack gap={8} align="start" justify="start" fullWidth>
                        <label className={s.label}>Slug</label>
                        {isEditing ? (
                            <Input 
                                value={editedStudy.slug || ''}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                width="100%"
                            />
                        ) : (
                            <p className={s.value}>{study.slug || '-'}</p>
                        )}
                    </VStack>
                    <VStack gap={8} align="start" justify="start" fullWidth>
                        <label className={s.label}>개요</label>
                        {isEditing ? (
                            <div className={s.editorWrapper}>
                                <MdEditor 
                                    isEdit={true}
                                    contents={editedStudy.overview?.description || ''}
                                    onChange={handleDescriptionChange}
                                    className={s.editor}
                                />
                            </div>
                        ) : (
                            <div className={s.descriptionWrapper}>
                                <MdEditor 
                                    isEdit={false}
                                    contents={study.overview?.description || ''}
                                    className={s.viewer}
                                />
                            </div>
                        )}
                    </VStack>
                </VStack>
            </Section>

            {/* 날짜 정보 */}
            <Section title="날짜 정보" className={s.section}>
                <HStack fullWidth gap={24} align="start" justify="start">
                    <VStack gap={8} align="start" justify="start" className={s.fieldGroup}>
                        <label className={s.label}>생성일</label>
                        <p className={s.value}>{new Date(study.created_at).toLocaleDateString('ko-KR')}</p>
                    </VStack>
                    <VStack gap={8} align="start" justify="start" className={s.fieldGroup}>
                        <label className={s.label}>수정일</label>
                        <p className={s.value}>{new Date(study.updated_at).toLocaleDateString('ko-KR')}</p>
                    </VStack>
                </HStack>
            </Section>

            {/* 멤버 목록 */}
            <Section 
                title={`멤버 (${members.length}명)`} 
                className={s.section}
                action={
                    <Button className={s.addMemberButton} onClick={() => setIsAddMemberModalOpen(true)}>
                        <UserPlus size={16} />
                        멤버 추가
                    </Button>
                }
            >
                <VStack fullWidth gap={8} align="start" justify="start" className={s.memberList}>
                    {members.length === 0 ? (
                        <p className={s.emptyMessage}>등록된 멤버가 없습니다.</p>
                    ) : (
                        members.map((member) => (
                            <HStack 
                                key={member.id} 
                                fullWidth 
                                gap={16} 
                                align="center" 
                                justify="between" 
                                className={s.memberRow}
                            >
                                    <HStack gap={12} align="center" justify="start" onClick={() => setSelectedMember(member)} className={s.memberInfo}>
                                        <img 
                                            src={member.user.user_image || '/default-avatar.png'} 
                                            alt={member.user.name || ''}
                                            className={s.memberImage}
                                        />
                                        <VStack gap={2} align="start" justify="center">
                                            <p className={s.memberName}>{member.user.name || member.user.handle}</p>
                                            <span className={s.memberEmail}>{member.user.email}</span>
                                        </VStack>
                                    </HStack>
                                <HStack gap={12} align="center" justify="end">
                                    <span className={s.memberRole}>{member.member_role}</span>
                                    <button 
                                        className={s.removeMemberButton}
                                        onClick={() => handleRemoveMember(member.user.id)}
                                        title="멤버 제거"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </HStack>
                            </HStack>
                        ))
                    )}
                </VStack>
            </Section>

            {/* 세션 목록 */}
            <Section 
                title={`세션 (${sessions.length}개)`} 
                className={s.section}
                action={
                    <Button className={s.addSessionButton} onClick={() => setIsCreateSessionModalOpen(true)}>
                        <Calendar size={16} />
                        세션 추가
                    </Button>
                }
            >
                <VStack fullWidth gap={8} align="start" justify="start" className={s.sessionList}>
                    {sessions.length === 0 ? (
                        <p className={s.emptyMessage}>등록된 세션이 없습니다.</p>
                    ) : (
                        sessions.map((session) => (
                            <HStack 
                                key={session.id} 
                                fullWidth 
                                gap={16} 
                                align="center" 
                                justify="between" 
                                className={s.sessionRow}
                            >
                                <HStack gap={12} align="center" justify="start">
                                    <span className={s.sessionRound}>Round {session.session_no}</span>
                                    <p className={s.sessionTitle}>{session.title}</p>
                                </HStack>
                                <HStack gap={12} align="center" justify="end">
                                    <span className={s.sessionDate}>
                                        {new Date(session.scheduled_at).toLocaleDateString('ko-KR')}
                                    </span>
                                    <span className={`${s.sessionStatus} ${s.active}`}>
                                        active
                                    </span>
                                    <button 
                                        className={s.removeSessionButton}
                                        onClick={() => handleRemoveSession(session.id)}
                                        title="세션 제거"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </HStack>
                            </HStack>
                            ))
                    )}
                </VStack>
            </Section>
        </VStack>

        {/* 멤버 추가 모달 */}
        <AddMemberModal
            isOpen={isAddMemberModalOpen}
            studyId={studyId}
            existingMemberIds={members.map(m => m.user.id)}
            onClose={() => setIsAddMemberModalOpen(false)}
            onSuccess={() => {
                // 멤버 목록 새로고침
                fetchStudyData();
            }}
        />

        {/* 세션 생성 모달 */}
        <CreateSessionModal
            isOpen={isCreateSessionModalOpen}
            studyId={studyId}
            onClose={() => setIsCreateSessionModalOpen(false)}
            onSuccess={() => {
                fetchStudyData();
            }}
        />

        {selectedMember && (
            <ModalContainer>
                <UserEditCard
                    userId={selectedMember.user.id}
                    password={""} 
                    userImage={selectedMember.user.user_image || "/default-profile.png"}
                    name={selectedMember.user.name || selectedMember.user.handle}
                    email={selectedMember.user.email}
                    role={selectedMember.user.role} 
                    status={selectedMember.user.status}
                    onClose={() => {
                        setSelectedMember(null);
                        fetchStudyData();
                    }}
                />
            </ModalContainer>
        )}
    </>
    );
}