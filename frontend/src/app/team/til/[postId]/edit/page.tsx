'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Title from '@/components/study/Title';
import Input from '@/components/general/Input';
import Button from '@/components/general/Button';
import MdEditor from '@/components/general/MdEditor';
import { tilApi } from '@/api/til';
import { authApi } from '@/api/auth';
import s from './style.module.scss';
import { ChevronLeft, Save } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function EditTilPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.postId as string;
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                const [post, userRes] = await Promise.all([
                    tilApi.getTilPost(postId),
                    authApi.getMe()
                ]);

                if (post.author_id !== userRes.user.id && userRes.user.role !== 'SUPER_ADMIN') {
                    toast.error("You are not authorized to edit this post.");
                    router.push('/team/til');
                    return;
                }

                setTitle(post.title);
                setContent(post.content_md);
            } catch (error) {
                console.error("Failed to load TIL:", error);
                toast.error("Failed to load TIL data.");
                router.push('/team/til');
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            init();
        }
    }, [postId, router]);

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
            await tilApi.updateTilPost(postId, {
                title,
                content_md: content,
            });
            toast.success("TIL updated successfully!");
            router.push(`/team/til/${postId}`);
        } catch (error) {
            console.error("Failed to save TIL:", error);
            toast.error('Failed to update TIL. Please try again.');
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
            <Toaster />
            <HStack fullWidth align="center" justify="between">
                <HStack align="center" gap={12} onClick={handleBack} className={s.backButton}>
                    <ChevronLeft size={24} color="#fdfdfe" />
                    <Title text="Edit TIL" />
                </HStack>
                <Button 
                    icon={<Save size={18} />}
                    onClick={handleSave}
                    disabled={saving}
                    className={s.saveButton}
                >
                    {saving ? 'Saving...' : 'Update TIL'}
                </Button>
            </HStack>

            <VStack fullWidth gap={16} className={s.editorWrapper}>
                <Input
                    placeholder="Enter TIL Title"
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
