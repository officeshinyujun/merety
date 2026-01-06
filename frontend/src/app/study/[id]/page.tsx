import s from './style.module.scss';
import dummyStudyData from "@/data/dummyStudyData.json";
import { VStack } from '@/components/general/VStack';
import Title from '@/components/study/Title';
import { StudyStatus, StudyType } from '@/types/study';
import Section from '@/components/general/Section';
import { HStack } from '@/components/general/HStack';
import SessionCard from '@/components/study/Session/SessionCard';
import UserCard from '@/components/general/UserCard';

export default async function StudyDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    //test
    const study = dummyStudyData.find(s => s.id === id);
    if (!study) {
        return <div>Study not found</div>;
    }

    const sessions = study.sessions || [];
    const members = study.Members || [];
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
            <Section title='Members' viewMoreHref={`/study/${id}/members`}>
                <HStack fullWidth align='center' justify='start' gap={12} className={s.membersList}>
                    {
                        members.slice(0, 2).map((member: any) => (
                            <HStack align='center' justify='center' key={member.id} className={s.memberCard} >
                                <UserCard 
                                    user={{
                                        name : member.name,
                                        userImage : member.userImage,
                                        role : member.role
                                    }}
                                />
                            </HStack>
                        ))
                    }
                    <p>+{members.length > 2 ? `${members.length - 2}` : ''}명</p>
                </HStack>
            </Section>
        </VStack>
    );
}