import s from './style.module.scss';
import { VStack } from "@/components/general/VStack";
import SubTitle from "@/components/study/SubTitle";
import Divider from "@/components/general/Divider";
import dummyStudyData from "@/data/dummyStudyData.json";
import { HStack } from '@/components/general/HStack';
import MdEditor from '@/components/general/MdEditor';
import SessionDataCard from '@/components/study/Session/SessionDataCard';
import SessionUserCard from '@/components/study/Session/SessionUserCard';

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string, sessionId: string }> }) {
    const { id, sessionId } = await params;
    
    const study = dummyStudyData.find(s => s.id === id);
    const DummySession = study ? study.sessions : [];
    const session = DummySession.find(s => s.id === sessionId);

    if (!session) {
        return <div>Session not found</div>;
    }

    const dummyUserData = {
        name : "user-1",
        userImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s",
        role : "manager"
    }

    return (
        <VStack className={s.container} gap={16}>
            <VStack fullWidth align='start' justify='start'>
                <SubTitle text={session.title}/>
                <HStack align='center' gap={8} justify='center' className={s.titleSection}>
                    <p>{session.createUser.name}</p>
                    <p>{session.scheduled_at}</p>
                    <p>{session.round}회차</p>
                </HStack>
            </VStack>
            <HStack fullWidth align='start' justify='start' gap={12} className={s.contentsSection}>
                <HStack fullWidth fullHeight align='start' justify='start' className={s.contentMdSection}>
                    <MdEditor contents={session.content_md} isEdit={false} className={s.contentMdViewer}/>
                </HStack>
                <VStack fullHeight className={s.contentsDataSection} gap={12}>
                    <p>자료</p>
                    {session.data.materials.map((material, index) => (
                        <SessionDataCard key={index} name={material}/>
                    ))}
                </VStack>
            </HStack>
            <VStack align='start' justify='start' fullWidth gap={12} className={s.studentsSection}>
                <h3>출석체크</h3>
                <SessionUserCard user={dummyUserData}/>
                <SessionUserCard user={dummyUserData}/>
                <SessionUserCard user={dummyUserData}/>
            </VStack>
        </VStack>
    );
}