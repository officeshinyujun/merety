import { HStack } from '@/components/general/HStack';
import s from './style.module.scss';
import dummyStudyData from "@/data/dummyStudyData.json";
import Sidebar from '@/components/general/Sidebar';
import { VStack } from '@/components/general/VStack';

export default function StudyDetail({ params }: { params: { id: string } }) {
    return (
        <HStack className={s.container}>
            <Sidebar/>
            <VStack align='start' justify='start' fullWidth fullHeight>
                <div>{dummyStudyData.name}</div>
                <p>{params.id}</p>
            </VStack>
        </HStack>
    );
}