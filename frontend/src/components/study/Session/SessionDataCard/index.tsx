import { HStack } from '@/components/general/HStack';
import s from './style.module.scss';
import { File } from 'lucide-react';

interface SessionDataCardProps {
    name : string;
}

export default function SessionDataCard({ name }: SessionDataCardProps) {
    return (
        <HStack 
        className={s.container} 
        fullWidth 
        align='center' 
        justify='start'
        gap={12}
        > 
            <File size={24} strokeWidth={2} color='#fdfdfe' />
            <span>{name}</span  >
        </HStack>
    )
}