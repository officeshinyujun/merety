'use client';

import { use, useState, useEffect } from 'react';
import { VStack } from "@/components/general/VStack";
import s from './style.module.scss';
import SubTitle from "@/components/study/SubTitle";
import Divider from "@/components/general/Divider";
import SessionDetailCard from "@/components/study/Session/SessionDetailCard";
import { sessionsApi } from '@/api';
import { Session } from '@/types/session';
import { Loader2 } from 'lucide-react';

export default function StudySessionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setIsLoading(true);
                const response = await sessionsApi.getSessions(id);
                // @ts-ignore
                setSessions(response.data || response);
            } catch (err) {
                console.error('Failed to fetch sessions:', err);
                setError('세션 목록을 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessions();
    }, [id]);

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" style={{ minHeight: '400px' }}>
                <Loader2 className={s.spinner} size={32} />
            </VStack>
        );
    }

    if (error) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" style={{ minHeight: '400px' }}>
                <p>{error}</p>
            </VStack>
        );
    }

    // 날짜 기준 분류
    const now = new Date();
    const activeSessions = sessions.filter(s => new Date(s.scheduled_at) >= now);
    const archivedSessions = sessions.filter(s => new Date(s.scheduled_at) < now);

    return (
        <div className={s.sessionOverlay}>
            <VStack fullWidth fullHeight className={s.container}>
                <SubTitle text="Sessions" />
                    <VStack fullWidth className={s.sessionList} gap={12}>
                        <p>Active</p>
                        <VStack fullWidth gap={12} style={{padding:"12px"}}>
                            {activeSessions.length > 0 ? activeSessions.map((session) => (
                                <SessionDetailCard 
                                    key={session.id}
                                    id={session.id}
                                    title={session.title}
                                    user={{
                                        name: 'Admin', // TODO: user info fetch
                                        userImage: undefined
                                    }}
                                    round={session.session_no}
                                    status="active"
                                    date={session.scheduled_at}
                                />
                            )) : <p className={s.emptyMessage}>예정된 세션이 없습니다.</p>}
                        </VStack>
                        <Divider/>
                        <p>Archived</p>
                        <VStack fullWidth gap={12} style={{padding:"12px"}}>
                            {archivedSessions.length > 0 ? archivedSessions.map((session) => (
                                <SessionDetailCard 
                                    key={session.id}
                                    id={session.id}
                                    title={session.title}
                                    user={{
                                        name: 'Admin', // TODO: user info fetch
                                        userImage: undefined
                                    }}
                                    round={session.session_no}
                                    status="archived"
                                    date={session.scheduled_at}
                                />
                            )) : <p className={s.emptyMessage}>지난 세션이 없습니다.</p>}
                        </VStack>
                </VStack>
            </VStack>
        </div>
    )
}