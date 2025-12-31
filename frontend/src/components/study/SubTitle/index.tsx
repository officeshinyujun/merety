'use client';

import { HStack } from '@/components/general/HStack';
import { ChevronLeft } from 'lucide-react';
import s from './style.module.scss';
import Button from '@/components/general/Button';
import { useRouter } from 'next/navigation';

interface SubTitleProps {
    text: string;
    isHandled?: boolean;
    handleFunction?: () => void;
    handleText?: string;
}

export default function SubTitle({ text, isHandled, handleFunction, handleText }: SubTitleProps) {
    const router = useRouter();
    
    return(
        <HStack fullWidth align='center' justify='between' className={s.container} >
            <HStack align='center' justify='center' gap={10} className={s.leftContent} onClick={() => router.back()}>
                <ChevronLeft size={32} color="#fdfdfe" strokeWidth={2.5} />
                <p>{text}</p>
            </HStack>
            {isHandled && <Button className={s.handleButton} onClick={handleFunction}>{handleText || 'Mark as handled'}</Button>}
        </HStack>
    )
}