import { VStack } from "@/components/general/VStack"
import s from "./style.module.scss"

interface MyTILCardProps {
    title: string;
    content: number;
}

export default function MyTILCard({title, content}: MyTILCardProps){
    return (
        <VStack align="start" justify="start" gap={12} className={s.container}>
            <h2>{title}</h2>
            <p>{content}회</p>
        </VStack>
    )
}