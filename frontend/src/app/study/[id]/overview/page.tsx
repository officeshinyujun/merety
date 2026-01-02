
import s from './style.module.scss';
import type { StudyOverview } from '@/types/study';
import dummyStudyData from "@/data/dummyStudyData.json";
import { VStack } from '@/components/general/VStack';
import SubTitle from '@/components/study/SubTitle';
import Section from '@/components/general/Section';
import { HStack } from '@/components/general/HStack';
import UserCard from '@/components/study/Overview/UserCard';
import MdEditor from '@/components/general/MdEditor';

export default async function StudyOverview({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const study = dummyStudyData.find(s => s.id === id);
    if (!study) {
        return <div>Study not found</div>;
    }
    return (
        <VStack className={s.container} gap={12} align='start' justify='start' fullWidth>
            <SubTitle text="Overview" />
            <Section title="manager" className={s.managerSection}>
                <HStack align='center' justify='start' gap={12} className={s.managerContainer}>
                    {study.overView.manager_list.map((manager, index) => (
                        <UserCard 
                            key={index} 
                            profileImage={manager.profileImage} 
                            name={manager.name} 
                            role={manager.role} 
                        />
                    ))}
                </HStack>
            </Section>
            <Section title='rules' className={s.rulesSection}>
                <MdEditor/>
            </Section>
        </VStack>
    );
}