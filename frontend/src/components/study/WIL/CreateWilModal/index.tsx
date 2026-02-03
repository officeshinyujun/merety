'use client';

import { useState } from 'react';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import Input from '@/components/general/Input';
import ModalContainer from '@/components/general/ModalContainer';
import { X, Loader2, Send } from 'lucide-react';
import { tilApi } from '@/api';
import MdEditor from '@/components/general/MdEditor';
import s from './style.module.scss';

interface CreateWilModalProps {
    isOpen: boolean;
    studyId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateWilModal({ isOpen, studyId, onClose, onSuccess }: CreateWilModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            setError('내용을 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await tilApi.createTilPost(studyId, {
                title: title.trim(),
                content_md: content,
                tags: [], // 추후 태그 기능 추가 가능
            });
            
            setTitle('');
            setContent('');
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Failed to create WIL:', err);
            setError(err.response?.data?.message || 'WIL 작성에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalContainer>
            <VStack className={s.modal} gap={24} align="start" justify="start">
                {/* Header */}
                <HStack fullWidth align="center" justify="between">
                    <h2 className={s.title}>WIL 작성하기</h2>
                    <button className={s.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                </HStack>

                {/* Form */}
                <VStack fullWidth gap={16} align="start" justify="start">
                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>제목 *</label>
                        <Input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            width="100%"
                        />
                    </VStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>내용 (Markdown) *</label>
                        <div className={s.editorWrapper}>
                            <MdEditor 
                                isEdit={true}
                                contents={content}
                                onChange={setContent}
                                className={s.editor}
                            />
                        </div>
                    </VStack>
                </VStack>

                {/* Error */}
                {error && <p className={s.error}>{error}</p>}

                {/* Buttons */}
                <HStack fullWidth gap={12} align="center" justify="end">
                    <Button className={s.cancelButton} onClick={onClose} disabled={isLoading}>
                        취소
                    </Button>
                    <Button className={s.submitButton} onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className={s.spinner} size={18} />
                                작성 중...
                            </>
                        ) : (
                            <>
                                <Send size={18} style={{ marginRight: '8px' }} />
                                작성 완료
                            </>
                        )}
                    </Button>
                </HStack>
            </VStack>
        </ModalContainer>
    );
}
