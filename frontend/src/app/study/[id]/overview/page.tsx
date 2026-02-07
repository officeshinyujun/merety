'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import Title from '@/components/study/Title';
import Section from '@/components/general/Section';
import { HStack } from '@/components/general/HStack';
import UserCard from '@/components/study/Overview/UserCard';
import MdEditor from '@/components/general/MdEditor';
import { studiesApi, StudyMember, authApi } from '@/api';
import { Study } from '@/types/study';
import { UserRole } from '@/types/user';
import { StudyMemberRole } from '@/types/study';
import s from './style.module.scss';
import { Loader2, Edit2, Save, ChevronLeft, X } from 'lucide-react';
import Button from '@/components/general/Button';

export default function StudyOverview({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [study, setStudy] = useState<Study | null>(null);
    const [managers, setManagers] = useState<StudyMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isManager, setIsManager] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [studyRes, membersRes] = await Promise.all([
                    studiesApi.getStudy(id),
                    studiesApi.getMembers(id)
                ]);

                setStudy(studyRes);
                setDescription(studyRes.overview?.description || '');

                // 매니저 필터링
                // @ts-ignore: API response structure check
                const allMembers = (membersRes.data || membersRes) as StudyMember[];
                const managerMembers = allMembers.filter(m => m.member_role === StudyMemberRole.MANAGER);
                setManagers(managerMembers);

                await checkPermission(allMembers);
                setIsLoading(false);

            } catch (err) {
                console.error('Failed to fetch overview data:', err);
                setError('데이터를 불러오는데 실패했습니다.');
                setIsLoading(false);
            }
        };

        const checkPermission = async (members: StudyMember[]) => {
            try {
                const { user } = await authApi.getMe();
                // SUPER_ADMIN 확인
                if (user.role === UserRole.SUPER_ADMIN) {
                    setIsManager(true);
                    return;
                }

                const myMember = members.find(m => m.user.id === user.id);
                if (myMember && myMember.member_role === StudyMemberRole.MANAGER) {
                    setIsManager(true);
                }
            } catch (err) {
                console.error('Failed to get current user:', err);
            }
        };

        fetchData();
    }, [id]);

    const handleEdit = () => {
        setEditDescription(description);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditDescription('');
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await studiesApi.updateOverview(id, { description: editDescription });
            setDescription(editDescription);
            setIsEditing(false);
        } catch (err) {
            console.error('Failed to update description:', err);
            alert('설명 저장에 실패했습니다.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" style={{ minHeight: '200px' }}>
                <Loader2 className={s.spinner} size={24} />
            </VStack>
        );
    }

    if (error || !study) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" style={{ minHeight: '200px' }}>
                <p>{error || 'Study not found'}</p>
            </VStack>
        );
    }

    return (
        <VStack className={s.container} gap={12} align='start' justify='start' fullWidth>
            <HStack fullWidth align="center" justify="between">
                <HStack align="center" gap={12} onClick={handleBack} className={s.backButton}>
                    <ChevronLeft size={24} color="#fdfdfe" />
                    <Title text="Overview" />
                </HStack>
                {isManager && (
                    <HStack gap={8}>
                        {isEditing ? (
                            <>
                                <Button
                                    className={s.cancelButton}
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    icon={<X size={14} />}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className={s.saveButton}
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    icon={isSaving ? <Loader2 size={14} className={s.spinner} /> : <Save size={14} />}
                                >
                                    Save
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleEdit}
                                className={s.editButton}
                                icon={<Edit2 size={14} />}
                            >
                                Edit
                            </Button>
                        )}
                    </HStack>
                )}
            </HStack>

            <Section title="manager" className={s.managerSection}>
                {managers.length > 0 ? (
                    <HStack align='center' justify='start' gap={12} className={s.managerContainer}>
                        {managers.map((manager) => (
                            <UserCard
                                key={manager.id}
                                profileImage={manager.user.user_image || '/default-avatar.png'}
                                name={manager.user.name || manager.user.handle}
                                role={manager.member_role}
                            />
                        ))}
                    </HStack>
                ) : (
                    <p className={s.emptyMessage}>매니저 정보가 없습니다.</p>
                )}
            </Section>
            {/* Rules / Description */}
            <Section
                title='Description'
                className={s.rulesSection}
            >
                {isEditing ? (
                    <VStack fullWidth gap={12} align="end">
                        <div className={s.editorWrapper}>
                            <MdEditor
                                isEdit={true}
                                contents={editDescription}
                                onChange={setEditDescription}
                                className={s.editor}
                            />
                        </div>
                    </VStack>
                ) : (
                    <div className={s.descriptionContent}>
                        <MdEditor
                            isEdit={false}
                            contents={description || '설명이 없습니다.'}
                            className={s.viewer}
                        />
                    </div>
                )}
            </Section>
        </VStack>
    );
}