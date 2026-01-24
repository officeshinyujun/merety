import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import Title from '@/components/study/Title';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import StudyListCard from '@/components/admin/StudyListCard';

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
                <StudyListCard
                    name='Study 1'
                    type='Web'
                    createdAt='2022-01-01'
                />
            </VStack>
        </VStack>
    );
}