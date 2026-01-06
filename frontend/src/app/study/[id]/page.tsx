import s from './style.module.scss';
import dummyStudyData from "@/data/dummyStudyData.json";
import { VStack } from '@/components/general/VStack';
import Title from '@/components/study/Title';
import { StudyStatus, StudyType } from '@/types/study';
import Section from '@/components/general/Section';
import { HStack } from '@/components/general/HStack';
import SessionCard from '@/components/study/Session/SessionCard';

export default async function StudyDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    //test
    const study = dummyStudyData.find(s => s.id === id);
    if (!study) {
        return <div>Study not found</div>;
    }

    const sessions = study.sessions || [];
    return (
        <VStack align='start' justify='start' fullWidth fullHeight gap={16} style={{padding : "48px 128px"}}>
            <Title text={study.name} isArchived={study.status as StudyStatus} type={study.type as StudyType} />
            <Section title="Overview" className={s.overviewSection} viewMoreHref={`/study/${id}/overview`}>
                <p>{study.slug}</p>
            </Section>
            <Section title="Sessions" className={s.sessionsSection} viewMoreHref={`/study/${id}/sessions`}>
                <HStack fullWidth gap={12} className={s.sessionList}>
                    {sessions.map((session: any) => (
                        <SessionCard 
                            key={session.id}
                            title={session.title}
                            user={{ name: session.createUser.name, profileImage: session.createUser.userImage }}
                            createdAt={session.created_at}
                        />
                    ))}
                </HStack>
            </Section>
        </VStack>
    );
}