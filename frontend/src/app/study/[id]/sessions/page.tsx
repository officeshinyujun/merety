import { VStack } from "@/components/general/VStack";
import s from './style.module.scss';
import SubTitle from "@/components/study/SubTitle";
import Divider from "@/components/general/Divider";
import SessionDetailCard from "@/components/study/Session/SessionDetailCard";
import dummyStudyData from "@/data/dummyStudyData.json";

export default function StudySessionPage() {
    const DummySession = dummyStudyData[0].sessions
    
    console.log('All sessions:', DummySession);

    //@ts-ignore
    const activeSessions = DummySession.filter(session => session.status === "active");
    //@ts-ignore
    const archivedSessions = DummySession.filter(session => session.status === "archived");
    
    console.log('Active sessions:', activeSessions);
    console.log('Archived sessions:', archivedSessions);
    
    return (
        <div className={s.sessionOverlay}>
            <VStack fullWidth fullHeight className={s.container}>
                <SubTitle text="Sessions" />
                    <VStack fullWidth className={s.sessionList} gap={12}>
                        <p>Activate</p>
                        <VStack fullWidth gap={12} style={{padding:"12px"}}>
                            {activeSessions.map((session, index) => (
                                <SessionDetailCard 
                                    key={index}
                                    id={session.id}
                                    title={session.title}
                                    user={session.createUser}
                                    round={session.round}
                                    //@ts-ignore
                                    status={session.status}
                                    date={session.scheduled_at}
                                />
                            ))}
                        </VStack>
                        <Divider/>
                        <p>Archived</p>
                        <VStack fullWidth gap={12} style={{padding:"12px"}}>
                            {archivedSessions.map((session, index) => (
                                <SessionDetailCard 
                                    key={index}
                                    id={session.id}
                                    title={session.title}
                                    user={session.createUser}
                                    round={session.round}
                                    //@ts-ignore
                                    status={session.status}
                                    date={session.scheduled_at}
                                />
                            ))}
                        </VStack>
                </VStack>
            </VStack>
        </div>
    )
}