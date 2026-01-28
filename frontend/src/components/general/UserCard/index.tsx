import { User } from "@/types/general/user";
import { HStack } from "../HStack";
import Image from "next/image";
import { VStack } from "../VStack";
import s from "./style.module.scss";

interface UserCardProps {
    user : User;
}

export default function UserCard({ user }: UserCardProps) {
    return (
        <HStack align="center" justify="start" gap={12}> 
            <Image src={user.user_image || '/default-avatar.png'} alt={user.name} width={40} height={40} className={s.image}/>
            <VStack align="start" justify="start" className={s.contents} gap={4}>
                <p>{user.name}</p>
                <span>{user.role}</span>
            </VStack>
        </HStack>
    )
}