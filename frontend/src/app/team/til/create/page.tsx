'use client';

import { useState } from 'react';
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

export default function CreateTilPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Please enter both title and content.');
            return;
        }

        setLoading(true);
        try {
            await tilApi.createPersonalTilPost({
                title,
                content_md: content,
                category: 'TIL',
            });
            router.push('/team/til');
        } catch (error) {
            console.error("Failed to save TIL:", error);
            alert('Failed to save TIL. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack fullWidth fullHeight align="start" justify="start" className={s.container} gap={24}>
            <HStack fullWidth align="center" justify="between">
                <HStack align="center" gap={12} onClick={handleBack} className={s.backButton}>
                    <ChevronLeft size={24} color="#fdfdfe" />
                    <Title text="Write TIL" />
                </HStack>
                <Button 
                    icon={<Save size={18} />}
                    onClick={handleSave}
                    disabled={loading}
                    className={s.saveButton}
                >
                    {loading ? 'Saving...' : 'Save TIL'}
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
