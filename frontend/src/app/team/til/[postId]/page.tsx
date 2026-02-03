'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import { HStack } from '@/components/general/HStack';
import Title from '@/components/study/Title';
import MdEditor from '@/components/general/MdEditor';
import { tilApi } from '@/api/til';
import { TilPost } from '@/types/til';
import s from './style.module.scss';
import { ChevronLeft, Calendar, User } from 'lucide-react';
import Image from 'next/image';
import Divider from '@/components/general/Divider';

export default function TilDetailPage() {
    const params = useParams();
    const router = useRouter();
    const postId = params.postId as string;
    const [post, setPost] = useState<TilPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const res = await tilApi.getTilPost(postId);
                setPost(res);
            } catch (error) {
                console.error("Failed to fetch TIL post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    const handleBack = () => {
        router.back();
    };

    if (loading) return <div className={s.container}>Loading...</div>;
    if (!post) return <div className={s.container}>Post not found.</div>;

    return (
        <VStack fullWidth fullHeight align="start" justify="start" className={s.container} gap={24}>
            <HStack align="center" gap={12} onClick={handleBack} className={s.backButton}>
                <ChevronLeft size={24} color="#fdfdfe" />
                <Title text="TIL Detail" />
            </HStack>

            <VStack fullWidth gap={16} className={s.contentWrapper}>
                <h1 className={s.title}>{post.title}</h1>
                
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
                        onChange={() => {}} 
                        isEdit={false} 
                    />
                </div>
            </VStack>
        </VStack>
    );
}
