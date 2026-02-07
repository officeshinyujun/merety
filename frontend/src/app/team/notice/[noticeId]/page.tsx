'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Title from '@/components/study/Title';
import MdEditor from '@/components/general/MdEditor';
import { noticesApi } from '@/api/notices';
import { authApi } from '@/api/auth';
import { Notice } from '@/types/notice';
import { User } from '@/types/user';
import s from './style.module.scss';
import { ChevronLeft, Calendar, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Divider from '@/components/general/Divider';
import Button from '@/components/general/Button';

export default function NoticeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const noticeId = params.noticeId as string;
    const [notice, setNotice] = useState<Notice | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [noticeRes, userRes] = await Promise.all([
                    noticesApi.getNotice(noticeId),
                    authApi.getMe().catch(() => ({ user: null }))
                ]);
                setNotice(noticeRes);
                if (userRes && userRes.user) {
                    setCurrentUser(userRes.user);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [noticeId]);

    const handleBack = () => {
        router.back();
    };

    const handleEdit = () => {
        router.push(`/team/notice/${noticeId}/edit`);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this notice?')) {
            return;
        }

        try {
            await noticesApi.deleteNotice(noticeId);
            router.push('/team/notice');
        } catch (error) {
            console.error("Failed to delete notice:", error);
            alert('Failed to delete notice. Please try again.');
        }
    };

    if (loading) return <div className={s.container}>Loading...</div>;
    if (!notice) return <div className={s.container}>Notice not found.</div>;

    const isSuperAdmin = currentUser && currentUser.role === 'SUPER_ADMIN';
    const author = notice.creator;

    return (
        <VStack fullWidth fullHeight align="start" justify="start" className={s.container} gap={24}>
            <HStack fullWidth align="center" justify="between">
                <HStack align="center" gap={12} onClick={handleBack} className={s.backButton}>
                    <ChevronLeft size={24} color="#fdfdfe" />
                    <Title text="Notice Detail" />
                </HStack>
                {isSuperAdmin && (
                    <HStack gap={8}>
                        <Button
                            onClick={handleDelete}
                            className={s.deleteButton}
                            icon={<Trash2 size={16} />}
                            style={{ backgroundColor: '#ff4d4f', color: '#fff' }}
                        >
                            Delete
                        </Button>
                        <Button
                            onClick={handleEdit}
                            className={s.editButton}
                            icon={<Edit2 size={16} />}
                        >
                            Edit
                        </Button>
                    </HStack>
                )}
            </HStack>

            <VStack fullWidth gap={16} className={s.contentWrapper}>
                <h1 className={s.title}>{notice.title}</h1>

                <HStack fullWidth align="center" justify="between" className={s.meta}>
                    <HStack align="center" gap={12}>
                        <div className={s.authorImage}>
                            <Image
                                src={author?.user_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s"}
                                alt={author?.name || "Author"}
                                width={32}
                                height={32}
                            />
                        </div>
                        <p className={s.authorName}>{author?.name || author?.handle || "Unknown"}</p>
                    </HStack>
                    <HStack align="center" gap={8} className={s.date}>
                        <Calendar size={16} />
                        <span>{new Date(notice.created_at).toLocaleDateString()}</span>
                    </HStack>
                </HStack>

                <Divider />

                <div className={s.editorContainer}>
                    <MdEditor
                        contents={notice.content_md}
                        onChange={() => { }}
                        isEdit={false}
                    />
                </div>
            </VStack>
        </VStack>
    );
}

