'use client';

import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import Input from '@/components/general/Input';
import ModalContainer from '@/components/general/ModalContainer';
import MdEditor from '@/components/general/MdEditor';
import { X, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { apiClient } from '@/api';
import toast from 'react-hot-toast';
import s from './style.module.scss';

interface QuestionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function QuestionModal({ isOpen, onClose }: QuestionModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setName('');
        setEmail('');
        setTitle('');
        setContent('');
    };

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim() || !title.trim() || !content.trim()) {
            toast.error('모든 필드를 입력해주세요.');
            return;
        }

        // 이메일 형식 검증
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error('올바른 이메일 형식을 입력해주세요.');
            return;
        }

        try {
            setLoading(true);
            await apiClient.post('/api/inquiry', {
                name: name.trim(),
                email: email.trim(),
                title: title.trim(),
                content: content.trim(),
                pageUrl: typeof window !== 'undefined' ? window.location.href : undefined,
            });
            toast.success('문의가 성공적으로 전송되었습니다.');
            resetForm();
            onClose();
        } catch (error) {
            console.error('Failed to submit inquiry:', error);
            toast.error('문의 전송에 실패했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <ModalContainer>
            <VStack className={s.modal} gap={20} align="start" justify="start" style={{ overflowY: "scroll" }}>
                {/* Header */}
                <HStack fullWidth align="center" justify="between">
                    <h2 className={s.title}>문의하기</h2>
                    <button className={s.closeButton} onClick={onClose} disabled={loading}>
                        <X size={24} />
                    </button>
                </HStack>

                {/* Form */}
                <VStack fullWidth gap={16} align="start" justify="start">
                    <HStack fullWidth gap={12}>
                        <VStack fullWidth gap={8} align="start" justify="start">
                            <label className={s.label}>이름</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="이름을 입력하세요"
                                width="100%"
                                disabled={loading}
                            />
                        </VStack>
                        <VStack fullWidth gap={8} align="start" justify="start">
                            <label className={s.label}>이메일</label>
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="답변 받을 이메일을 입력하세요"
                                width="100%"
                                disabled={loading}
                            />
                        </VStack>
                    </HStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>제목</label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="문의 제목을 입력하세요"
                            width="100%"
                            disabled={loading}
                        />
                    </VStack>

                    <VStack fullWidth fullHeight gap={8} align="start" justify="start">
                        <label className={s.label}>내용</label>
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

                {/* Buttons */}
                <HStack fullWidth gap={12} align="center" justify="end">
                    <Button className={s.cancelButton} onClick={onClose} disabled={loading}>
                        취소
                    </Button>
                    <Button className={s.submitButton} onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <Loader2 size={18} className={s.spinner} />
                        ) : (
                            <Send size={18} style={{ marginRight: '8px' }} />
                        )}
                        {loading ? '전송 중...' : '제출'}
                    </Button>
                </HStack>
            </VStack>
        </ModalContainer>
    );
}
