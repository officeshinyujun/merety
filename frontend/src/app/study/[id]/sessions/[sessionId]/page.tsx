'use client';

import s from './style.module.scss';
import { VStack } from "@/components/general/VStack";
import SubTitle from "@/components/study/SubTitle";
import { HStack } from '@/components/general/HStack';
import MdEditor from '@/components/general/MdEditor';
import SessionDataCard from '@/components/study/Session/SessionDataCard';
import SessionUserCard from '@/components/study/Session/SessionUserCard';
import { use, useEffect, useState } from 'react';
import { sessionsApi } from '@/api';
import { Session } from '@/types/session';
import { Attendance, AttendanceStatus } from '@/types/attendance';
import { Loader2, CheckCircle } from 'lucide-react';
import { authApi } from '@/api';
import { User } from '@/types/user';
import Button from '@/components/general/Button';

export default function SessionDetailPage({ params }: { params: Promise<{ id: string, sessionId: string }> }) {
    const { sessionId } = use(params);
    const [session, setSession] = useState<(Session & { attendance: Attendance[] }) | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSession = async () => {
            try {
                setIsLoading(true);
                const data = await sessionsApi.getSession(sessionId);
                setSession(data);
            } catch (err) {
                console.error('Failed to fetch session:', err);
                setError('세션 정보를 불러오는데 실패했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        if (sessionId) {
            fetchSession();
        }
    }, [sessionId]);

    useEffect(() => {
        const fetchMe = async () => {
            try {
                const { user } = await authApi.getMe();
                setCurrentUser(user);
            } catch (err) {
                console.error('Failed to fetch user:', err);
            }
        };
        fetchMe();
    }, []);

    const handleAttendanceCheck = async () => {
        if (!sessionId || !currentUser) return;
        
        try {
            setIsChecking(true);
            await sessionsApi.checkAttendance(sessionId);
            
            // Refresh session to update attendance list
            const data = await sessionsApi.getSession(sessionId);
            setSession(data);
        } catch (err) {
            console.error('Attendance check failed:', err);
            alert('출석 체크에 실패했습니다. (스터디 멤버인지 확인해주세요)');
        } finally {
            setIsChecking(false);
        }
    };

    const myAttendance = session?.attendance?.find(a => a.user_id === currentUser?.id);
    const isCheckedIn = myAttendance?.status === AttendanceStatus.PRESENT;

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <Loader2 className={s.spinner} size={32} />
                <p>로딩 중...</p>
            </VStack>
        );
    }

    if (error || !session) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <h2>{error || '세션을 찾을 수 없습니다.'}</h2>
            </VStack>
        );
    }

    return (
        <VStack className={s.container} gap={16}>
            <VStack fullWidth align='start' justify='start'>
                <SubTitle text={session.title}/>
                <HStack align='center' gap={8} justify='center' className={s.titleSection}>
                    <p>{session.createUser?.name || 'Unknown'}</p>
                    <p>{new Date(session.scheduled_at).toLocaleDateString('ko-KR')}</p>
                    <p>{session.round}회차</p>
                </HStack>
            </VStack>
            <HStack fullWidth align='start' justify='start' gap={12} className={s.contentsSection}>
                <HStack fullWidth fullHeight align='start' justify='start' className={s.contentMdSection}>
                    <MdEditor contents={session.content_md || ''} isEdit={false} className={s.contentMdViewer}/>
                </HStack>
                <VStack fullHeight className={s.contentsDataSection} gap={12}>
                    <p>자료</p>
                    {/* Archives */}
                    {session.archives?.map((archive) => (
                        <SessionDataCard 
                            key={archive.id} 
                            name={archive.title} 
                            onClick={() => {
                                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                                window.open(`${baseUrl}${archive.url}`, '_blank');
                            }}
                        />
                    ))}

                    {/* Legacy Materials */}
                    {session.data?.materials?.map((material, index) => (
                        <SessionDataCard key={`mat-${index}`} name={material}/>
                    ))}

                    {(!session.archives?.length && !session.data?.materials?.length) && (
                        <p className={s.emptyMessage}>등록된 자료가 없습니다.</p>
                    )}
                </VStack>
            </HStack>
            <VStack align='start' justify='start' fullWidth gap={12} className={s.studentsSection}>
                <HStack fullWidth align="center" justify="between">
                    <h3>출석체크 ({session.attendance?.length || 0}명)</h3>
                </HStack>
                <VStack fullWidth gap={8} align="start" justify="start">
                    {session.attendance?.map((attendance) => {
                        const isMe = currentUser?.id === attendance.user_id;
                        return (
                            <SessionUserCard 
                                key={attendance.id} 
                                user={{
                                    name: attendance.user?.name || 'Unknown',
                                    user_image: attendance.user?.user_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s", // Fallback URL
                                    role: attendance.status || 'pending'
                                }}
                                checked={attendance.status === AttendanceStatus.PRESENT}
                                onToggle={isMe ? handleAttendanceCheck : undefined}
                                disabled={!isMe || isChecking}
                            />
                        );
                    })}
                </VStack>
            </VStack>
        </VStack>
    );
}