'use client';

import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import Title from '@/components/study/Title';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import StudyListCard from '@/components/admin/StudyListCard';
import CreateStudyModal from '@/components/admin/CreateStudyModal';
import { studiesApi } from '@/api';
import { Study } from '@/types/study';
import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';

export default function StudyPage() {
    const [studies, setStudies] = useState<Study[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchStudies = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await studiesApi.getStudies();
            setStudies(response.data);
        } catch (err) {
            console.error('Failed to fetch studies:', err);
            setError('스터디 목록을 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudies();
    }, [fetchStudies]);

    const handleAddStudy = () => {
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleStudyCreated = () => {
        // 목록 새로고침
        fetchStudies();
    };

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <p>로딩 중...</p>
            </VStack>
        );
    }

    if (error) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <p className={s.error}>{error}</p>
            </VStack>
        );
    }

    return (
        <>
            <VStack
                align='start'
                justify='start'
                gap={16}
                fullHeight
                fullWidth
                className={s.container}>
                <Title text='Study Management' />
                <HStack fullWidth justify='end' align='center'>
                    <Button className={s.addButton} onClick={handleAddStudy}>
                        <Plus size={18} />
                        Add Study
                    </Button>
                </HStack>
                <VStack
                    fullWidth
                    fullHeight
                    align='start'
                    justify='start'
                    gap={16}
                    className={s.studyList}
                >
                    {studies.length === 0 ? (
                        <p className={s.emptyMessage}>등록된 스터디가 없습니다.</p>
                    ) : (
                        studies.map((study) => (
                            <StudyListCard
                                key={study.id}
                                studyId={study.id}
                                name={study.name}
                                type={study.type === 'RED' ? 'Red' : 'Web'}
                                createdAt={new Date(study.created_at).toLocaleDateString()}
                            />
                        ))
                    )}
                </VStack>
            </VStack>

            {/* 스터디 생성 모달 */}
            <CreateStudyModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSuccess={handleStudyCreated}
            />
        </>
    );
}