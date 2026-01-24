import { HStack } from "@/components/general/HStack";
import s from './style.module.scss';

interface StudyListCardProps {
    name: string;
    type: 'Web' | 'Red';
    createdAt: string;
}

export default function StudyListCard({
    name,
    type,
    createdAt
}: StudyListCardProps) {
    return (
        <HStack
            align="center"
            justify="between"
            fullWidth
            className={s.container}
        >
            <HStack
                align="center"
                justify="start"
                gap={8}
                className={s.leftContainer}
            >
                <span>{name}</span>
                <HStack
                    align="center"
                    justify="center"
                    gap={4}
                    className={s.typeCard}
                >
                    <p>{type}</p>
                </HStack>
            </HStack>
            <h6>{createdAt}</h6>
        </HStack>
    );
}