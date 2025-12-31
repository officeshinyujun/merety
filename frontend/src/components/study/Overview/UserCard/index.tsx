import { HStack } from '@/components/general/HStack';
import s from './style.module.scss';
import { VStack } from '@/components/general/VStack';

interface UserCardProps {
    profileImage : string
    name: string;
    role: string;
}

export default function UserCard({ name, role, profileImage }: UserCardProps) {
    return (
        <HStack className={s.container} align='center' justify='start' gap={12}>
            <div 
                className={s.profileImage} 
                style={{ backgroundImage: `url(${profileImage})` }} 
                aria-label={`${name}'s profile`}
            />
            <VStack align='start' justify='center' gap={4} className={s.userDetails}>
                <h1>{name}</h1>
                <p>{role}</p>
            </VStack>
        </HStack>
    );
}