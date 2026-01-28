import { HStack } from "@/components/general/HStack";
import s from './style.module.scss';
import Link from 'next/link';

interface StudyListCardProps {
    studyId: string;
    name: string;
    type: string;
    createdAt: string;
}

export default function StudyListCard({
    studyId,
    name,
    type,
    createdAt
}: StudyListCardProps) {
    return (
        <Link href={`/admin/study/${studyId}`} className={s.link}>
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
        </Link>
    );
}