'use client';

import { useState } from 'react';
import { HStack } from '@/components/general/HStack';
import { HelpCircle } from 'lucide-react';
import QuestionModal from '@/components/general/QuestionModal';
import s from './style.module.scss';

export default function QuestionButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <HStack
                className={s.questionButton}
                align="center"
                justify="center"
                onClick={() => setIsModalOpen(true)}
            >
                <HelpCircle size={24} color="#fdfdfe" />
            </HStack>
            <QuestionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
