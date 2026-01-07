'use client'
import { HStack } from '@/components/general/HStack';
import s from './style.module.scss';
import { VStack } from '@/components/general/VStack';
import Image from 'next/image';

interface WILCardProps {
    title : string;
    user : {
        name : string;
        userImage : string;
    }
}

export default function WILCard({title, user} : WILCardProps) {
    return (
        <VStack align='start' justify='start' gap={12} fullWidth className={s.container}>
            <h3>{title}</h3>
            <HStack align='center' justify='center' gap={8} className={s.contents}>
                <Image 
                src={user.userImage}
                alt={user.name}
                width={20}
                height={20}
                style={{borderRadius:"100%"}}
                />
                <p>{user.name}</p>
            </HStack>
        </VStack>
    )
}