import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import Title from '@/components/study/Title';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import StudyListCard from '@/components/admin/StudyListCard';
import dummyStudyData from '@/data/dummyStudyData.json';

export default function Study() {
    return (
        <VStack
            align='start'
            justify='start'
            gap={16}
            fullHeight
            fullWidth
            className={s.container}>
            <Title text='Study Management' />
            <HStack fullWidth justify='end' align='center'>
                <Button className={s.addButton}>Add Study</Button>
            </HStack>
            <VStack
                fullWidth
                fullHeight
                align='start'
                justify='start'
                gap={16}
                className={s.studyList}
            >
                {dummyStudyData.map((study) => (
                    <StudyListCard
                        key={study.id}
                        name={study.name}
                        type={study.type === 'RED' ? 'Red' : 'Web'}
                        createdAt={new Date(study.created_at).toLocaleDateString()}
                    />
                ))}
            </VStack>
        </VStack>
    );
}