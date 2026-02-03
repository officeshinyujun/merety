import { HStack } from "@/components/general/HStack";
import s from "./style.module.scss";
import UserCard from "@/components/general/UserCard";
import CheckBox from "@/components/general/CheckBox";

interface SessionUserCardProps {
    user : {
        name : string
        user_image : string;
        role : string;
    }
    checked?: boolean;
    onToggle?: () => void;
    disabled?: boolean;
}

export default function SessionUserCard({ user, checked, onToggle, disabled }: SessionUserCardProps) {
    return (
        <HStack fullWidth align="center" justify="between" className={s.container}>
            <UserCard user={user as any}/> 
            <CheckBox checked={checked} disabled={disabled} onChange={onToggle} />
        </HStack>
    )
}