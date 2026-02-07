'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Title from '@/components/study/Title';
import Input from '@/components/general/Input';
import Button from '@/components/general/Button';
import MdEditor from '@/components/general/MdEditor';
import { noticesApi } from '@/api/notices';
import s from './style.module.scss';
import { ChevronLeft, Save } from 'lucide-react';

export default function NoticeCreatePage() {
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
            await noticesApi.createNotice({
                title,
                content_md: content,
            });
            router.push('/team/notice');
        } catch (error) {
            console.error('Failed to create notice:', error);
            alert('Failed to create notice. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack fullWidth fullHeight align="start" justify="start" className={s.container} gap={24}>
            <HStack fullWidth align="center" justify="between">
                <HStack align="center" gap={12} onClick={handleBack} className={s.backButton}>
                    <ChevronLeft size={24} color="#fdfdfe" />
                    <Title text="Write Notice" />
                </HStack>
                <Button
                    icon={<Save size={18} />}
                    onClick={handleSave}
                    disabled={loading || !title.trim() || !content.trim()}
                    className={s.saveButton}
                >
                    {loading ? 'Saving...' : 'Save Notice'}
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
