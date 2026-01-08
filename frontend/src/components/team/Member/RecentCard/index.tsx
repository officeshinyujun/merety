import { VStack } from '@/components/general/VStack'
import s from './style.module.scss'

interface RecentCardProps {
    title: string;
    category : "TIL" | "WIL"
    createdAt: string;
}

export default function RecentCard({
    title,
    category,
    createdAt
}: RecentCardProps) {
    return (
        <VStack fullWidth fullHeight align='start' justify='start' gap={8} className={s.container}>
            <h2>{title}</h2>
            <p>{category}</p>
            <p>{createdAt}</p>
        </VStack>
    )
}