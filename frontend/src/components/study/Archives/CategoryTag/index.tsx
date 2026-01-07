import { HStack } from "@/components/general/HStack"
import s from "./style.module.scss"
import cn from 'classnames'

interface CategoryTagProps {
    text : string;
    isClick : boolean;
    onClick?: () => void;
}

export default function CategoryTag({text, isClick, onClick}: CategoryTagProps) {
    return (
        <HStack className={cn(s.container, isClick && s.active)} onClick={onClick} style={{ cursor: 'pointer' }}>
            <p>{text}</p>
        </HStack>
    )
}