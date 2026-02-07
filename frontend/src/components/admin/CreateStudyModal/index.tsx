'use client';

import { useState } from 'react';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import Input from '@/components/general/Input';
import ModalContainer from '@/components/general/ModalContainer';
import { X, Loader2 } from 'lucide-react';
import { studiesApi, CreateStudyRequest } from '@/api';

import s from './style.module.scss';

interface CreateStudyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateStudyModal({ isOpen, onClose, onSuccess }: CreateStudyModalProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState('WEB');
    const [color, setColor] = useState('#ffffff');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        // 유효성 검사
        if (!name.trim()) {
            setError('스터디 이름을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const data: CreateStudyRequest = {
                name: name.trim(),
                type,
                color,
                slug: slug.trim() || undefined,
                overview: description ? { description } : undefined,
            };

            await studiesApi.createStudy(data);

            // 초기화 및 닫기
            resetForm();
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error('Failed to create study:', err);
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || '스터디 생성에 실패했습니다.');
            } else {
                setError('서버에 연결할 수 없습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setType('WEB');
        setColor('#ffffff');
        setSlug('');
        setDescription('');
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
                    <h2 className={s.title}>스터디 생성</h2>
                    <button className={s.closeButton} onClick={handleClose}>
                        <X size={24} />
                    </button>
                </HStack>

                {/* Form */}
                <VStack fullWidth gap={16} align="start" justify="start">
                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>스터디 이름 *</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="스터디 이름을 입력하세요"
                            width="100%"
                        />
                    </VStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>타입 *</label>
                        <Input
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="예: WEB, SERVER, AI"
                            width="100%"
                        />
                    </VStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>색상</label>
                        <HStack align="center" gap={12}>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    padding: '0',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    backgroundColor: 'transparent'
                                }}
                            />
                            <span>{color}</span>
                        </HStack>
                    </VStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>Slug (선택)</label>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="URL에 사용될 고유 식별자"
                            width="100%"
                        />
                    </VStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>설명 (선택)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="스터디에 대한 설명을 입력하세요"
                            className={s.textarea}
                            rows={4}
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
