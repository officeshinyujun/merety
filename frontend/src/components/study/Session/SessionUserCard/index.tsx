import { HStack } from "@/components/general/HStack";
import s from "./style.module.scss";
import UserCard from "@/components/general/UserCard";
import CheckBox from "@/components/general/CheckBox";

interface SessionUserCardProps {
    user : {
        name : string
        userImage : string;
        role : string;
    }
}

export default function SessionUserCard({ user }: SessionUserCardProps) {
    return (
        <HStack fullWidth align="center" justify="between" className={s.container}>
            <UserCard user={user}/>
            <CheckBox/>
        </HStack>
    )
}