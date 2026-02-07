'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Title from '@/components/study/Title';
import MdEditor from '@/components/general/MdEditor';
import { tilApi } from '@/api/til';
import { authApi } from '@/api/auth'; // Import authApi
import { TilPost } from '@/types/til';
import { User } from '@/types/user'; // Import User type
import s from './style.module.scss';
import { ChevronLeft, Calendar, Edit2, Trash2 } from 'lucide-react'; // Import Edit icon
import Image from 'next/image';
import Divider from '@/components/general/Divider';
import Button from '@/components/general/Button'; // Import Button
import SubTitle from '@/components/study/SubTitle';

export default function TilDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.postId as string;
    const [post, setPost] = useState<TilPost | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null); // State for current user
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [postRes, userRes] = await Promise.all([
                    tilApi.getTilPost(postId),
                    authApi.getMe().catch(() => ({ user: null })) // Handle potential auth error gracefully
                ]);
                setPost(postRes);
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
    }, [postId]);

    const handleBack = () => {
        router.back();
    };

    const handleEdit = () => {
        router.push(`/team/til/${postId}/edit`);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await tilApi.deleteTilPost(postId);
            router.push('/team/til');
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert('Failed to delete post. Please try again.');
        }
    };

    if (loading) return <div className={s.container}>Loading...</div>;
    if (!post) return <div className={s.container}>Post not found.</div>;

    const isAuthor = currentUser && (currentUser.id === post.author_id || currentUser.role === 'SUPER_ADMIN');

    return (
        <VStack fullWidth fullHeight align="start" justify="start" className={s.container} gap={24}>
            <HStack fullWidth align="center" justify="between">
                <SubTitle text={post.title} />
                {isAuthor && (
                    <HStack gap={8}>
                        <Button
                            onClick={handleDelete}
                            className={s.deleteButton}
                            icon={<Trash2 size={16} />}
                            style={{ backgroundColor: '#ff4d4f', color: '#fff' }} // Simple inline style for delete button
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

                <HStack fullWidth align="center" justify="between" className={s.meta}>
                    <HStack align="center" gap={12}>
                        <div className={s.authorImage}>
                            <Image
                                src={post.author_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s"}
                                alt={post.author_name}
                                width={32}
                                height={32}
                            />
                        </div>
                        <p className={s.authorName}>{post.author_name}</p>
                    </HStack>
                    <HStack align="center" gap={8} className={s.date}>
                        <Calendar size={16} />
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </HStack>
                </HStack>

                <Divider />

                <div className={s.editorContainer}>
                    <MdEditor
                        contents={post.content_md}
                        onChange={() => { }}
                        isEdit={false}
                    />
                </div>
            </VStack>
        </VStack>
    );
}
