import { HStack } from "@/components/general/HStack"
import s from "./style.module.scss"

interface TitleNTextProps {
    title: string;
    text: string;
}

export default function TitleNText({ title, text }: TitleNTextProps) {
    return (
        <HStack align="center" justify="start" fullWidth className={s.container} gap={12}>
            <h2>{title}</h2>
            <p>{text}</p>
        </HStack>
    )
}