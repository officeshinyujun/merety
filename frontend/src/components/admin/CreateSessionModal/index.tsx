'use client';

import { useState } from 'react';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import Input from '@/components/general/Input';
import ModalContainer from '@/components/general/ModalContainer';
import { X, Loader2, Calendar } from 'lucide-react';
import { sessionsApi, CreateSessionRequest } from '@/api';
import s from './style.module.scss';

interface CreateSessionModalProps {
    isOpen: boolean;
    studyId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateSessionModal({ isOpen, studyId, onClose, onSuccess }: CreateSessionModalProps) {
    const [title, setTitle] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // 유효성 검사
        if (!title.trim()) {
            setError('세션 제목을 입력해주세요.');
            return;
        }
        if (!scheduledAt) {
            setError('진행 날짜를 선택해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const data: CreateSessionRequest = {
                title: title.trim(),
                scheduled_at: scheduledAt,
                content_md: content || undefined,
            };

            await sessionsApi.createSession(studyId, data);
            
            // 초기화 및 닫기
            resetForm();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error('Failed to create session:', err);
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || '세션 생성에 실패했습니다.');
            } else {
                setError('서버에 연결할 수 없습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setScheduledAt('');
        setContent('');
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <ModalContainer>
            <VStack className={s.modal} gap={24} align="start" justify="start">
                {/* Header */}
                <HStack fullWidth align="center" justify="between">
                    <h2 className={s.title}>세션 생성</h2>
                    <button className={s.closeButton} onClick={handleClose}>
                        <X size={24} />
                    </button>
                </HStack>

                {/* Form */}
                <VStack fullWidth gap={16} align="start" justify="start">
                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>세션 제목 *</label>
                        <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="세션 제목을 입력하세요 (예: OT, 1주차 스터디)"
                            width="100%"
                        />
                    </VStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>진행 날짜 *</label>
                        <div className={s.dateInputWrapper}>
                            <input 
                                type="date"
                                value={scheduledAt}
                                onChange={(e) => setScheduledAt(e.target.value)}
                                className={s.dateInput}
                            />
                            <Calendar className={s.calendarIcon} size={18} />
                        </div>
                    </VStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>내용 (Markdown)</label>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="세션에 대한 내용을 입력하세요 (Markdown 지원)"
                            className={s.textarea}
                            rows={6}
                        />
                    </VStack>
                </VStack>

                {/* Error */}
                {error && <p className={s.error}>{error}</p>}

                {/* Buttons */}
                <HStack fullWidth gap={12} align="center" justify="end">
                    <Button className={s.cancelButton} onClick={handleClose} disabled={isLoading}>
                        취소
                    </Button>
                    <Button className={s.submitButton} onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className={s.spinner} size={18} />
                                생성 중...
                            </>
                        ) : (
                            '생성'
                        )}
                    </Button>
                </HStack>
            </VStack>
        </ModalContainer>
    );
}
