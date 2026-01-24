'use client';

import { VStack } from "@/components/general/VStack";
import { HStack } from "@/components/general/HStack";
import Button from "@/components/general/Button";
import Input from "@/components/general/Input";
import Section from "@/components/general/Section";
import Title from "@/components/study/Title";
import s from './style.module.scss';
import dummyStudyData from '@/data/dummyStudyData.json';
import { use, useState, useEffect } from 'react';
import { Save, X, Edit2 } from 'lucide-react';

interface StudyData {
    id: string;
    name: string;
    type: string;
    slug: string;
    status: string;
    created_by: string;
    created_at: string;
    updated_at: string;
    overView: {
        description: string;
        manager_list: Array<{
            name: string;
            role: string;
            profileImage: string;
        }>;
    };
    sessions: Array<{
        id: string;
        title: string;
        status: string;
        scheduled_at: string;
        round: number;
    }>;
    Members: Array<{
        id: string;
        name: string;
        email: string;
        role: string;
        status: string;
        userImage: string;
    }>;
}

export default function StudyDetail({ params }: { params: Promise<{ studyId: string }> }) {
    const { studyId } = use(params);
    const [isEditing, setIsEditing] = useState(false);
    const [study, setStudy] = useState<StudyData | null>(null);
    const [editedStudy, setEditedStudy] = useState<StudyData | null>(null);

    useEffect(() => {
        const foundStudy = dummyStudyData.find(s => s.id === studyId) as StudyData | undefined;
        if (foundStudy) {
            setStudy(foundStudy);
            setEditedStudy(foundStudy);
        }
    }, [studyId]);

    if (!study || !editedStudy) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <h2>스터디를 찾을 수 없습니다.</h2>
            </VStack>
        );
    }

    const handleSave = () => {
        setStudy(editedStudy);
        setIsEditing(false);
        // TODO: API 호출로 실제 저장
    };

    const handleCancel = () => {
        setEditedStudy(study);
        setIsEditing(false);
    };

    const handleInputChange = (field: keyof StudyData, value: string) => {
        setEditedStudy(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleDescriptionChange = (value: string) => {
        setEditedStudy(prev => prev ? {
            ...prev,
            overView: { ...prev.overView, description: value }
        } : null);
    };

    return (
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
                            <Button className={s.cancelButton} onClick={handleCancel}>
                                <X size={18} />
                                취소
                            </Button>
                            <Button className={s.saveButton} onClick={handleSave}>
                                <Save size={18} />
                                저장
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
                        <label className={s.label}>설명 (Slug)</label>
                        {isEditing ? (
                            <Input 
                                value={editedStudy.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                width="100%"
                            />
                        ) : (
                            <p className={s.value}>{study.slug}</p>
                        )}
                    </VStack>
                    <VStack gap={8} align="start" justify="start" fullWidth>
                        <label className={s.label}>개요</label>
                        {isEditing ? (
                            <textarea 
                                value={editedStudy.overView.description}
                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                className={s.textarea}
                                rows={4}
                            />
                        ) : (
                            <p className={s.value}>{study.overView.description}</p>
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

            {/* 매니저 정보 */}
            <Section title="매니저" className={s.section}>
                <HStack fullWidth gap={16} align="start" justify="start" className={s.managerList}>
                    {study.overView.manager_list.map((manager, index) => (
                        <HStack key={index} gap={12} align="center" justify="start" className={s.managerCard}>
                            <img 
                                src={manager.profileImage} 
                                alt={manager.name}
                                className={s.managerImage}
                            />
                            <VStack gap={4} align="start" justify="center">
                                <p className={s.managerName}>{manager.name}</p>
                                <span className={s.managerRole}>{manager.role}</span>
                            </VStack>
                        </HStack>
                    ))}
                </HStack>
            </Section>

            {/* 멤버 목록 */}
            <Section title={`멤버 (${study.Members.length}명)`} className={s.section}>
                <VStack fullWidth gap={8} align="start" justify="start" className={s.memberList}>
                    {study.Members.map((member) => (
                        <HStack 
                            key={member.id} 
                            fullWidth 
                            gap={16} 
                            align="center" 
                            justify="between" 
                            className={s.memberRow}
                        >
                            <HStack gap={12} align="center" justify="start">
                                <img 
                                    src={member.userImage} 
                                    alt={member.name}
                                    className={s.memberImage}
                                />
                                <VStack gap={2} align="start" justify="center">
                                    <p className={s.memberName}>{member.name}</p>
                                    <span className={s.memberEmail}>{member.email}</span>
                                </VStack>
                            </HStack>
                            <HStack gap={12} align="center" justify="end">
                                <span className={`${s.memberRole}`}>{member.role}</span>
                                <span className={`${s.memberStatus} ${s[member.status]}`}>{member.status}</span>
                            </HStack>
                        </HStack>
                    ))}
                </VStack>
            </Section>

            {/* 세션 목록 */}
            <Section title={`세션 (${study.sessions.length}개)`} className={s.section}>
                <VStack fullWidth gap={8} align="start" justify="start" className={s.sessionList}>
                    {study.sessions.map((session) => (
                        <HStack 
                            key={session.id} 
                            fullWidth 
                            gap={16} 
                            align="center" 
                            justify="between" 
                            className={s.sessionRow}
                        >
                            <HStack gap={12} align="center" justify="start">
                                <span className={s.sessionRound}>Round {session.round}</span>
                                <p className={s.sessionTitle}>{session.title}</p>
                            </HStack>
                            <HStack gap={12} align="center" justify="end">
                                <span className={s.sessionDate}>{session.scheduled_at}</span>
                                <span className={`${s.sessionStatus} ${s[session.status]}`}>{session.status}</span>
                            </HStack>
                        </HStack>
                    ))}
                </VStack>
            </Section>
        </VStack>
    );
}