import { HStack } from '@/components/general/HStack';
import s from './style.module.scss';
import { Pencil } from 'lucide-react';

interface TILCardProps {
  title: string;
}

export default function TILCard({ title }: TILCardProps) {
    return (
        <HStack className={s.container} align='start' justify='start' gap={10}>
            <Pencil size={20} strokeWidth={1.5} color="#fdfdfe" />
            <span>{title}</span>
        </HStack>
    );
}