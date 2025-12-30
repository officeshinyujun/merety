import { HStack } from "@/components/general/HStack";
import s from './style.module.scss';
import { Clock } from "lucide-react";

interface RecentCardProps {
  title: string;
  time: string;
}

export default function RecentCard({ title, time }: RecentCardProps) {
    return (
        <HStack className={s.container} align='center' justify="between" >
            <HStack align="center" justify="start" gap={10} className={s.recentItem}>
                <Clock size={16} strokeWidth={1.5} color="#fdfdfe"/>
                <p>{title}</p>
            </HStack>
            <span>{time}</span>
        </HStack>
    );
}