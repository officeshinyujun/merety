'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Title from '@/components/study/Title';
import Input from '@/components/general/Input';
import Button from '@/components/general/Button';
import MdEditor from '@/components/general/MdEditor';
import { tilApi } from '@/api/til';
import s from './style.module.scss';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditWilPage({ params }: { params: Promise<{ id: string; wilID: string }> }) {
    const { id, wilID } = use(params);
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const fetchWil = async () => {
            try {
                const wil = await tilApi.getTilPost(wilID);
                setTitle(wil.title);
                setContent(wil.content_md);
            } catch (error) {
                console.error("Failed to fetch WIL:", error);
                toast.error('WIL 정보를 불러오는데 실패했습니다.');
                router.back();
            } finally {
                setInitialLoading(false);
            }
        };
        fetchWil();
    }, [wilID, router]);

    const handleBack = () => {
        router.back();
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error('제목과 내용을 모두 입력해주세요.');
            return;
        }

        setLoading(true);
        try {
            await tilApi.updateTilPost(wilID, {
                title,
                content_md: content,
            });
            toast.success('WIL이 수정되었습니다!');
            router.push(`/study/${id}/wil/${wilID}`);
        } catch (error) {
            console.error("Failed to update WIL:", error);
            toast.error('WIL 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <Loader2 className={s.spinner} size={32} />
            </VStack>
        );
    }

    return (
        <VStack fullWidth fullHeight align="start" justify="start" className={s.container} gap={24}>
            <HStack fullWidth align="center" justify="between">
                <HStack align="center" gap={12} onClick={handleBack} className={s.backButton}>
                    <ChevronLeft size={24} color="#fdfdfe" />
                    <Title text="WIL 수정" />
                </HStack>
                <Button
                    icon={<Save size={18} />}
                    onClick={handleSave}
                    disabled={loading}
                    className={s.saveButton}
                >
                    {loading ? '저장 중...' : '저장'}
                </Button>
            </HStack>

            <VStack fullWidth gap={16} className={s.editorWrapper}>
                <Input
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={s.titleInput}
                />
                <div className={s.editorContainer}>
                    <MdEditor
                        contents={content}
                        onChange={setContent}
                        isEdit={true}
                    />
                </div>
            </VStack>
        </VStack>
    );
}
