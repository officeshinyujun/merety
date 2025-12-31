import { HStack } from '@/components/general/HStack';
import s from './style.module.scss';
import dummyStudyData from "@/data/dummyStudyData.json";
import Sidebar from '@/components/general/Sidebar';
import { VStack } from '@/components/general/VStack';
import Title from '@/components/study/Title';
import { StudyStatus, StudyType } from '@/types/study';
import Section from '@/components/general/Section';

export default async function StudyDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const study = dummyStudyData.find(s => s.id === id);
    if (!study) {
        return <div>Study not found</div>;
    }
    return (
        <HStack className={s.container}>
            <Sidebar/>
            <VStack align='start' justify='start' fullWidth fullHeight gap={16} style={{padding : "48px 128px"}}>
                <Title text={study.name} isArchived={study.status as StudyStatus} type={study.type as StudyType} />
                <Section title="Overview" className={s.overviewSection} viewMoreHref={`/study/${id}/overview`}>
                    <p>{study.slug}</p>
                </Section>
            </VStack>
        </HStack>
    );
}