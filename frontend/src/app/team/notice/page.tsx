'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import Title from "@/components/study/Title";
import { HStack } from "@/components/general/HStack";
import Input from "@/components/general/Input";
import { Search } from "lucide-react";
import ChartBase from "@/components/general/Chart/ChartBase";
import ChartSection from "@/components/general/Chart/ChartSection";
import { useState, useMemo, useEffect } from "react";
import PagenationBar from "@/components/general/PagenationBar";
import { useRouter } from "next/navigation";
import { noticesApi } from "@/api/notices";
import { authApi } from "@/api/auth";
import { Notice } from "@/types/notice";
import { User, UserRole } from "@/types/user";
import Button from "@/components/general/Button";
import { Plus } from "lucide-react";

export default function NoticePage() {
    const router = useRouter();
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    
    const [notices, setNotices] = useState<Notice[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const { user } = await authApi.getMe();
                setUserInfo(user);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            try {
                const response = await noticesApi.getNotices({
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchQuery || undefined
                });
                setNotices(response.data);
                setTotalItems(response.pagination.total);
            } catch (error) {
                console.error("Failed to fetch notices:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotices();
    }, [currentPage, searchQuery]);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchText);
            setCurrentPage(1);
        }
    };

    const handleRowClick = (noticeId: string) => {
        router.push(`/team/notice/${noticeId}`);
    };

    const titleColumnData = notices.map(notice => ({
        text: notice.title,
        onClick: () => handleRowClick(notice.id),
    }));

    const authorColumnData = notices.map(notice => {
        const author = notice.creator;
        return {
            text: author ? author.name || author.handle : "Unknown",
            image: author ? author.user_image || undefined : undefined,
            onClick: () => handleRowClick(notice.id),
        };
    });

    const dateColumnData = notices.map(notice => ({
        text: new Date(notice.created_at).toLocaleDateString(),
        onClick: () => handleRowClick(notice.id),
    }));

    return (
        <VStack fullWidth fullHeight align='start' justify='start' className={s.container} gap={24}>
            <HStack fullWidth align="center" justify="between">
                <Title text="Notice" />
                {userInfo?.role === UserRole.SUPER_ADMIN && (
                    <Button 
                        onClick={() => router.push('/team/notice/create')}
                        className={s.createButton}
                    >
                        <HStack gap={8} align="center">
                            <Plus size={18} />
                            <span>Create Notice</span>
                        </HStack>
                    </Button>
                )}
            </HStack>
            <HStack fullWidth align="center" justify="center">
                <Input 
                    width="700px"
                    placeholder="공지를 검색하세요..." 
                    icon={<Search size={20} color="#959595" strokeWidth={1.5}/>}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                />
            </HStack>
            <VStack fullWidth fullHeight align='start' justify='start' gap={12}>
                <ChartBase>
                    <ChartSection 
                        title="Title" 
                        width="60%" 
                        children={titleColumnData} 
                    />
                    <ChartSection 
                        title="Author" 
                        width="20%" 
                        children={authorColumnData} 
                    />
                    <ChartSection 
                        title="Date" 
                        width="20%" 
                        children={dateColumnData} 
                    />
                </ChartBase>
                <PagenationBar 
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </VStack>
        </VStack>
    )
}
