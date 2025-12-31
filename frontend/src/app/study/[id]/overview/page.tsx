import s from './style.module.scss';
import type { StudyOverview } from '@/types/study';

export default async function StudyOverview({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className={s.container}>
            <h1>Study Overview for study {id}</h1>
        </div>
    );
}