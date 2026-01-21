import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import Title from '@/components/study/Title';

export default function Study(){
    return (
        <VStack 
        align='start'
        justify='start'
        gap={16}
        fullHeight
        fullWidth
        className={s.container}>
            <Title text='Study Management'/>
        </VStack>
    );
}