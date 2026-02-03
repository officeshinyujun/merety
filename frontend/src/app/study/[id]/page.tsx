'use client';

import { use, useState, useEffect } from 'react';
import { VStack } from '@/components/general/VStack';
import Title from '@/components/study/Title';
import Section from '@/components/general/Section';
import { HStack } from '@/components/general/HStack';
import SessionCard from '@/components/study/Session/SessionCard';
import UserCard from '@/components/general/UserCard';
import MainCArchivesCard from '@/components/study/Archives/MainCard';
import WILCard from '@/components/study/WIL/WILCard';
import { studiesApi, StudyMember, tilApi, archiveApi } from '@/api';
import { sessionsApi } from '@/api';
import { Study, StudyType, StudyStatus } from '@/types/study';
import { Session } from '@/types/session';
import s from './style.module.scss';
import { Loader2 } from 'lucide-react';

export default function StudyDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [study, setStudy] = useState<Study | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [members, setMembers] = useState<StudyMember[]>([]);
    const [archives, setArchives] = useState<any[]>([]);
    const [wil, setWil] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [studyRes, sessionsRes, membersRes, archivesRes, tilRes] = await Promise.all([
                    studiesApi.getStudy(id),
                    sessionsApi.getSessions(id),
                    studiesApi.getMembers(id),
                    archiveApi.getArchives(id),
                    tilApi.getTilPosts(id)
                ]);

                setStudy(studyRes);
                // @ts-ignore: API response structure might differ
                setSessions(sessionsRes.data || sessionsRes);
                // @ts-ignore: API response structure might differ
                setMembers(membersRes.data || membersRes);
                setArchives(archivesRes.data || []);
                setWil(tilRes.data || []);
            } catch (err) {
                console.error('Failed to fetch study detail:', err);
                setError('스터디 정보를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" style={{ minHeight: '400px' }}>
                <Loader2 className={s.spinner} size={32} />
            </VStack>
        );
    }

    if (error || !study) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" style={{ minHeight: '400px' }}>
                <p>{error || 'Study not found'}</p>
            </VStack>
        );
    }

    // 데이터 렌더링 시작

    return (
        <VStack align='start' justify='start' fullWidth fullHeight gap={16} style={{padding : "48px 128px"}} className={s.container}>
            <Title text={study.name} isArchived={study.status} type={study.type} />
            
            <Section title="Overview" className={s.overviewSection} viewMoreHref={`/study/${id}/overview`}>
                <p>{study.overview?.description || '스터디 설명이 없습니다.'}</p>
            </Section>

            <Section title="Sessions" className={s.sessionsSection} viewMoreHref={`/study/${id}/sessions`}>
                {sessions.length > 0 ? (
                    <HStack fullWidth gap={12} className={s.sessionList}>
                        {sessions.slice(0, 3).map((session) => (
                            <SessionCard 
                                key={session.id}
                                title={session.title}
                                user={{ 
                                    name: session.createUser?.name || "관리자",
                                    profileImage: session.createUser?.userImage || "/default-avatar.png" 
                                }}
                                createdAt={session.created_at}
                            />
                        ))}
                    </HStack>
                ) : (
                    <p className={s.emptyMessage}>등록된 세션이 없습니다.</p>
                )}
            </Section>

            <Section title="WIL" className={s.wilSection} viewMoreHref={`/study/${id}/wil`} >
                {wil.length > 0 ? (
                    <VStack fullWidth align='start' justify='start' gap={12} className={s.wilList}>
                        {wil.slice(0, 3).map((item, idx) => (
                            <WILCard 
                                key={idx} 
                                title={item.title} 
                                user={{
                                    name: item.author_name || '익명',
                                    userImage: item.author_image || '/default-avatar.png'
                                }} 
                            />
                        ))}
                        {wil.length > 3 && <p className={s.moreCount}>+{wil.length - 3}개</p>}
                    </VStack>
                ) : (
                    <p className={s.emptyMessage}>등록된 WIL이 없습니다.</p>
                )}
            </Section>

            <Section title='Members' viewMoreHref={`/study/${id}/members`}>
                {members.length > 0 ? (
                    <HStack fullWidth align='center' justify='start' gap={12} className={s.membersList}>
                        {
                            members.slice(0, 5).map((member) => (
                                <HStack align='center' justify='center' key={member.id} className={s.memberCard} >
                                    <UserCard 
                                        user={{
                                            name : member.user.name || member.user.handle,
                                            user_image : member.user.user_image || '/default-avatar.png',
                                            role : member.member_role
                                        }}
                                    />
                                </HStack>
                            ))
                        }
                        {members.length > 5 && <p className={s.moreCount}>+{members.length - 5}명</p>}
                    </HStack>
                ) : (
                     <p className={s.emptyMessage}>등록된 멤버가 없습니다.</p>
                )}
            </Section>

            <Section title='Archives' viewMoreHref={`/study/${id}/archives`}>
                {archives.length > 0 ? (
                    <HStack align='center' justify='start' gap={12} fullWidth style={{padding:16}} >
                        {archives.slice(0, 3).map((item, idx) => (
                            <MainCArchivesCard key={idx} type={item.category as 'DOC' | 'SLIDE' | 'CODE' | 'LINK' | 'ETC'} title={item.title} />
                        ))}
                        {archives.length > 3 && <p className={s.moreCount}>+{archives.length - 3}개</p>}
                    </HStack>
                ) : (
                    <p className={s.emptyMessage}>등록된 자료가 없습니다.</p>
                )}
            </Section>
        </VStack>
    );
}