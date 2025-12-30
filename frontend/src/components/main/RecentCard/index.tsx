import { HStack } from "@/components/general/HStack";
import s from './style.module.scss';
import { Clock } from "lucide-react";

export default function RecentCard() {
    return (
        <HStack className={s.container} align='center' justify='start' gap={10}>
            <HStack>
                <Clock size={16} stroke={1.5}/>
                <p></p>
            </HStack>
        </HStack>
    );
}