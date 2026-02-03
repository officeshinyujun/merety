'use client';

import { useState } from 'react';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import Input from '@/components/general/Input';
import ModalContainer from '@/components/general/ModalContainer';
import { X, Loader2, Calendar, Upload, Trash2, FileIcon } from 'lucide-react';
import { sessionsApi, CreateSessionRequest, archiveApi } from '@/api';
import { Archive, ArchiveCategory } from '@/types/archive';
import CategoryTag from '@/components/study/Archives/CategoryTag';
import MdEditor from '@/components/general/MdEditor';
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
    const [round, setRound] = useState('1'); 
    const [uploadedArchives, setUploadedArchives] = useState<Archive[]>([]);
    const [isUploading, setIsUploading] = useState(false);
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
                round: parseInt(round) || 1,
                archiveIds: uploadedArchives.map(a => a.id),
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
        setRound('1');
        setUploadedArchives([]);
        setContent('');
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const files = Array.from(e.target.files);
        setIsUploading(true);
        setError('');

        try {
            const uploadPromises = files.map(file => 
                archiveApi.uploadFile(studyId, {
                    file,
                    title: file.name,
                    category: ArchiveCategory.ETC
                })
            );

            const results = await Promise.all(uploadPromises);
            const newArchives = results.map(r => r.archive);
            
            setUploadedArchives(prev => [...prev, ...newArchives]);
        } catch (err) {
            console.error('Upload failed:', err);
            setError('파일 업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
            // Input reset to allow selecting same file again
            e.target.value = '';
        }
    };

    const handleRemoveArchive = (archiveId: string) => {
        setUploadedArchives(prev => prev.filter(a => a.id !== archiveId));
    };

    const handleToggleCategory = async (archiveId: string, currentCategory: ArchiveCategory) => {
        const categories = [ArchiveCategory.DOC, ArchiveCategory.SLIDE, ArchiveCategory.CODE, ArchiveCategory.ETC];
        const currentIndex = categories.indexOf(currentCategory);
        const nextCategory = categories[(currentIndex + 1) % categories.length];

        try {
            const updated = await archiveApi.updateArchive(archiveId, { category: nextCategory });
            setUploadedArchives(prev => prev.map(a => a.id === archiveId ? updated : a));
        } catch (err) {
            console.error('Failed to update category:', err);
            setError('파일 타입 변경에 실패했습니다.');
        }
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
                        <label className={s.label}>회차</label>
                        <Input 
                            type="number"
                            value={round}
                            onChange={(e) => setRound(e.target.value)}
                            placeholder="회차를 입력하세요 (예: 1)"
                            width="100%"
                        />
                    </VStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>자료 (파일 업로드)</label>
                        
                        {uploadedArchives.length > 0 && (
                            <div className={s.fileList}>
                                {uploadedArchives.map(archive => (
                                    <div key={archive.id} className={s.fileItem}>
                                        <HStack align="center" gap={8} style={{ overflow: 'hidden' }}>
                                            <CategoryTag 
                                                text={archive.category} 
                                                isClick={true} 
                                                onClick={() => handleToggleCategory(archive.id, archive.category)}
                                            />
                                            <span className={s.fileName}>{archive.title}</span>
                                        </HStack>
                                        <button 
                                            className={s.removeButton} 
                                            onClick={() => handleRemoveArchive(archive.id)}
                                            type="button"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ position: 'relative' }}>
                            <input 
                                type="file" 
                                id="file-upload" 
                                multiple 
                                className={s.fileInput}
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            <label htmlFor="file-upload" className={s.uploadButton}>
                                {isUploading ? <Loader2 className={s.spinner} size={16} /> : <Upload size={16} />}
                                {isUploading ? '업로드 중...' : '파일 업로드'}
                            </label>
                        </div>
                    </VStack>

                    <VStack fullWidth gap={8} align="start" justify="start">
                        <label className={s.label}>내용 (Markdown)</label>
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
