'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import UserCard from "@/components/general/UserCard";
import MdEditor from "@/components/general/MdEditor";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { noticesApi } from "@/api/notices";
import { Notice } from "@/types/notice";
import SubTitle from "@/components/study/SubTitle";
import Divider from "@/components/general/Divider";
import { HStack } from "@/components/general/HStack";

export default function NoticeDetailPage() {
    const params = useParams();
    const noticeId = params.noticeId as string;
    const [notice, setNotice] = useState<Notice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const response = await noticesApi.getNotice(noticeId);
                setNotice(response);
            } catch (error) {
                console.error("Failed to fetch notice:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotice();
    }, [noticeId]);

    if (loading) {
        return (
            <VStack align="center" justify="center" fullWidth fullHeight className={s.container}>
                <p>Loading...</p>
            </VStack>
        );
    }

    if (!notice) {
        return (
            <VStack align="center" justify="center" fullWidth fullHeight className={s.container}>
                <h1>공지를 찾을 수 없습니다.</h1>
            </VStack>
        );
    }

    const author = notice.creator;

    return (
        <VStack align="start" justify="start" gap={16} fullWidth fullHeight className={s.container}>
            <SubTitle text={notice.title} />
            <HStack fullWidth align="start" justify="start" className={s.authorSection}>
                <UserCard user={{
                    name: author?.name || author?.handle || "Unknown",
                    user_image: author?.user_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s"
                }} />
            </HStack>
            <Divider/>
            <MdEditor contents={notice.content_md} isEdit={false} className={s.mdSection} />
        </VStack> 
    )
}
            