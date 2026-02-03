'use client';

import { useState, useEffect } from 'react';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Button from '@/components/general/Button';
import Input from '@/components/general/Input';
import ModalContainer from '@/components/general/ModalContainer';
import { X, Loader2, Calendar, Upload, Trash2, FileIcon } from 'lucide-react';
import { sessionsApi, UpdateSessionRequest, archiveApi } from '@/api';
import { Session } from '@/types/session';
import { Archive, ArchiveCategory } from '@/types/archive';
import MdEditor from '@/components/general/MdEditor';
import s from './style.module.scss';

interface EditSessionModalProps {
    isOpen: boolean;
    session: Session | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditSessionModal({ isOpen, session, onClose, onSuccess }: EditSessionModalProps) {
    const [title, setTitle] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [round, setRound] = useState('1'); 
    const [archives, setArchives] = useState<Archive[]>([]);
    const [legacyMaterials, setLegacyMaterials] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (session) {
            // 초기값 설정 (빠른 응답성을 위해 로컬 데이터 사용)
            setTitle(session.title);
            const date = new Date(session.scheduled_at);
            const dateString = date.toISOString().split('T')[0];
            setScheduledAt(dateString);
            setRound(session.round ? session.round.toString() : (session as any).session_no ? (session as any).session_no.toString() : '1');
            setArchives(session.archives || []);
            setLegacyMaterials(session.data?.materials || []);
            setContent(session.content_md || '');

            // 상세 데이터 Fetch (누락된 관계 및 데이터 동기화)
            const fetchFullSession = async () => {
                try {
                    const fullSession = await sessionsApi.getSession(session.id);
                    setTitle(fullSession.title);
                    const d = new Date(fullSession.scheduled_at);
                    setScheduledAt(d.toISOString().split('T')[0]);
                    setRound(fullSession.round ? fullSession.round.toString() : '1');
                    setArchives(fullSession.archives || []);
                    setLegacyMaterials(fullSession.data?.materials || []);
                    setContent(fullSession.content_md || '');
                } catch (err) {
                    console.error('Failed to fetch session detail:', err);
                }
            };
            fetchFullSession();
        }
    }, [session]);

    const handleSubmit = async () => {
        if (!session) return;

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
            const data: UpdateSessionRequest = {
                title: title.trim(),
                scheduled_at: scheduledAt,
                content_md: content || undefined,
                round: parseInt(round) || 1,
                archiveIds: archives.map(a => a.id),
                data: {
                    materials: legacyMaterials,
                },
            };

            await sessionsApi.updateSession(session.id, data);
            
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error('Failed to update session:', err);
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || '세션 수정에 실패했습니다.');
            } else {
                setError('서버에 연결할 수 없습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !session) return;
        
        const files = Array.from(e.target.files);
        setIsUploading(true);
        setError('');

        try {
            const uploadPromises = files.map(file => 
                archiveApi.uploadFile(session.study_id, {
                    file,
                    title: file.name,
                    category: ArchiveCategory.ETC
                })
            );

            const results = await Promise.all(uploadPromises);
            const newArchives = results.map(r => r.archive);
            
            setArchives(prev => [...prev, ...newArchives]);
        } catch (err) {
            console.error('Upload failed:', err);
            setError('파일 업로드에 실패했습니다.');
        } finally {
            setIsUploading(false);
            e.target.value = '';
        }
    };

    const handleRemoveArchive = (archiveId: string) => {
        setArchives(prev => prev.filter(a => a.id !== archiveId));
    };

    const handleRemoveLegacyMaterial = (material: string) => {
        setLegacyMaterials(prev => prev.filter(m => m !== material));
    };

    if (!isOpen || !session) return null;

    return (
        <ModalContainer>
            <VStack className={s.modal} gap={24} align="start" justify="start">
                {/* Header */}
                <HStack fullWidth align="center" justify="between">
                    <h2 className={s.title}>세션 상세 / 수정</h2>
                    <button className={s.closeButton} onClick={onClose}>
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
                            placeholder="세션 제목을 입력하세요"
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
                        
                        {(archives.length > 0 || legacyMaterials.length > 0) && (
                            <div className={s.fileList}>
                                {/* Legacy Materials */}
                                {legacyMaterials.map((material, index) => (
                                    <div key={`legacy-${index}`} className={s.fileItem}>
                                        <HStack align="center" gap={8} style={{ overflow: 'hidden' }}>
                                            <FileIcon size={16} className={s.fileIcon} />
                                            <span className={s.fileName}>{material}</span>
                                        </HStack>
                                        <button 
                                            className={s.removeButton} 
                                            onClick={() => handleRemoveLegacyMaterial(material)}
                                            type="button"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* Archives */}
                                {archives.map(archive => (
                                    <div key={archive.id} className={s.fileItem}>
                                        <HStack align="center" gap={8} style={{ overflow: 'hidden' }}>
                                            <FileIcon size={16} className={s.fileIcon} />
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
                                id="edit-file-upload" 
                                multiple 
                                className={s.fileInput}
                                onChange={handleFileChange}
                                disabled={isUploading}
                            />
                            <label htmlFor="edit-file-upload" className={s.uploadButton}>
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
                    <Button className={s.cancelButton} onClick={onClose} disabled={isLoading}>
                        취소
                    </Button>
                    <Button className={s.submitButton} onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className={s.spinner} size={18} />
                                저장 중...
                            </>
                        ) : (
                            '저장'
                        )}
                    </Button>
                </HStack>
            </VStack>
        </ModalContainer>
    );
}
