import { HStack } from '@/components/general/HStack';
import s from './style.module.scss';
import { StudyStatus, StudyType } from '@/types/study';
import { ShieldAlert, CodeXml } from 'lucide-react';

interface TitleProps {
    text: string;
    isArchived?: StudyStatus;
    type?: StudyType;
}

export default function Title({ text, isArchived, type }: TitleProps) {
    return (
        <HStack align='center' justify='start' fullWidth className={s.container} gap={12}>
            {type==="RED" ? (type ? (<ShieldAlert size={36} color="#fdfdfe" strokeWidth={1.5} />) : (type ? <CodeXml size={36} color="#fdfdfe" strokeWidth={1.5} /> : null)) : null}
            <h1 className={s.title}>{text}</h1>
            {
                isArchived === "archived" ? (
                    <HStack className={s.statusContainer}>
                        <p>{isArchived === "archived" ? "Archived" : "Active"}</p>
                    </HStack>
                ) : null
            }
        </HStack>
    );
}