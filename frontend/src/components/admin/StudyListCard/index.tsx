import { HStack } from "@/components/general/HStack";
import s from './style.module.scss';
import Link from 'next/link';

interface StudyListCardProps {
    studyId: string;
    name: string;
    type: string;
    color: string;
    createdAt: string;
}

export default function StudyListCard({
    studyId,
    name,
    type,
    color,
    createdAt
}: StudyListCardProps) {
    return (
        <Link href={`/admin/study/${studyId}`} className={s.link}>
            <HStack
                align="center"
                justify="between"
                fullWidth
                className={s.container}
                style={{ borderLeft: `4px solid ${color}` }}
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
                        style={{ backgroundColor: color, opacity: 0.8 }}
                    >
                        <p style={{ color: '#fff' }}>{type}</p>
                    </HStack>
                </HStack>
                <h6>{createdAt}</h6>
            </HStack>
        </Link>
    );
}