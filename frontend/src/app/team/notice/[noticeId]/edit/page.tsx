'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Title from '@/components/study/Title';
import Input from '@/components/general/Input';
import Button from '@/components/general/Button';
import MdEditor from '@/components/general/MdEditor';
import { noticesApi } from '@/api/notices';
import { authApi } from '@/api/auth';
import s from './style.module.scss';
import { ChevronLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditNoticePage() {
    const router = useRouter();
    const params = useParams();
    const noticeId = params.noticeId as string;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const [notice, userRes] = await Promise.all([
                    noticesApi.getNotice(noticeId),
                    authApi.getMe()
                ]);

                if (userRes.user.role !== 'SUPER_ADMIN') {
                    toast.error("You are not authorized to edit this notice.");
                    router.push('/team/notice');
                    return;
                }

                setTitle(notice.title);
                setContent(notice.content_md);
            } catch (error) {
                console.error("Failed to load notice:", error);
                toast.error("Failed to load notice data.");
                router.push('/team/notice');
            } finally {
                setLoading(false);
            }
        };

        if (noticeId) {
            init();
        }
    }, [noticeId, router]);

    const handleBack = () => {
        router.back();
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error('Please enter both title and content.');
            return;
        }

        setSaving(true);
        try {
            await noticesApi.updateNotice(noticeId, {
                title,
                content_md: content,
            });
            toast.success("Notice updated successfully!");
            router.push(`/team/notice/${noticeId}`);
        } catch (error) {
            console.error("Failed to save notice:", error);
            toast.error('Failed to update notice. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <div>Loading...</div>
            </VStack>
        );
    }

    return (
        <VStack fullWidth fullHeight align="start" justify="start" className={s.container} gap={24}>
            <HStack fullWidth align="center" justify="between">
                <HStack align="center" gap={12} onClick={handleBack} className={s.backButton}>
                    <ChevronLeft size={24} color="#fdfdfe" />
                    <Title text="Edit Notice" />
                </HStack>
                <Button
                    icon={<Save size={18} />}
                    onClick={handleSave}
                    disabled={saving}
                    className={s.saveButton}
                >
                    {saving ? 'Saving...' : 'Update Notice'}
                </Button>
            </HStack>

            <VStack fullWidth gap={16} className={s.editorWrapper}>
                <Input
                    placeholder="Enter Notice Title"
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
