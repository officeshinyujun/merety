
import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import { HStack } from '@/components/general/HStack';
import Image from 'next/image';

interface SessionCardProps {
    title: string;
    user : {
        profileImage : string;
        name : string;
    }
    createdAt : string;
}

export default function SessionCard({ title, user, createdAt }: SessionCardProps) {
    return (
        <VStack className={s.container} align='start' justify='start' gap={12}>
            <h2>{title}</h2>
            <HStack align='center' justify='start' gap={8}>
                <Image src={user.profileImage} alt={user.name} width={20} height={20} />
                <p>{user.name}</p>
            </HStack>
            <HStack align='center' justify='start' gap={8} >
                <p>{createdAt}</p>
            </HStack>
        </VStack>
    )
}