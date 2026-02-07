'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Title from '@/components/study/Title';
import Input from '@/components/general/Input';
import Button from '@/components/general/Button';
import MdEditor from '@/components/general/MdEditor';
import { tilApi } from '@/api/til';
import s from './style.module.scss';
import { ChevronLeft, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreateWilPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error('Please enter both title and content.');
            return;
        }

        setLoading(true);
        try {
            await tilApi.createTilPost(id, {
                title,
                content_md: content,
                tags: [],
                category: 'WIL',
            });
            toast.success('WIL created successfully!');
            router.push(`/study/${id}/wil`);
        } catch (error) {
            console.error("Failed to save WIL:", error);
            toast.error('Failed to create WIL. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack fullWidth fullHeight align="start" justify="start" className={s.container} gap={24}>
            <HStack fullWidth align="center" justify="between">
                <HStack align="center" gap={12} onClick={handleBack} className={s.backButton}>
                    <ChevronLeft size={24} color="#fdfdfe" />
                    <Title text="Write WIL" />
                </HStack>
                <Button
                    icon={<Save size={18} />}
                    onClick={handleSave}
                    disabled={loading}
                    className={s.saveButton}
                >
                    {loading ? 'Saving...' : 'Save WIL'}
                </Button>
            </HStack>

            <VStack fullWidth gap={16} className={s.editorWrapper}>
                <Input
                    placeholder="Enter WIL Title"
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
