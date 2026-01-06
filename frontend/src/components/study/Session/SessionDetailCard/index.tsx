'use client';

import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import { HStack } from '@/components/general/HStack';
import Image from 'next/image';
import { RefreshCw, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SessionDetailCardProps {
    id: string;
  title: string;
  user : {
    name: string;
    userImage: string;
  };
  round: number;
  status: 'active' | 'archived' ;
  date: string;
}

export default function SessionDetailCard({ id, title, user, round, status, date }: SessionDetailCardProps) {
    const router = useRouter();
    
    const handleClick = () => {
        console.log('Clicked session', id);
        router.push(`/study/study-1/sessions/${id}`);
    };
    
    return (
        <VStack align='start' justify='start' className={s.container} gap={12} onClick={handleClick}>
            <HStack align='center' justify='start' gap={12} className={s.headerContainer}>
                <h3 className={status === 'archived' ? s.archivedTitle : ''}>{title}</h3>
                <div className={s.stateBadge}>
                    {status}
                </div>
            </HStack>
            <HStack className={s.contents} align='center' justify='start' gap={8}>
                <Image src={user.userImage} alt={user.name} width={24} height={24}/>
                <p>{user.name}</p>
            </HStack>
            <HStack className={s.contents} align='center' justify='start' gap={8}>
                <RefreshCw />
                <p>{round}회차</p>
            </HStack>
            <HStack className={s.contents} align='center' justify='start' gap={8}>
                <Calendar />
                <p>{date}</p>
            </HStack>
        </VStack>
    );
}