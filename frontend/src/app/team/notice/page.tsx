'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import Title from "@/components/study/Title";
import { HStack } from "@/components/general/HStack";
import Input from "@/components/general/Input";
import { Search } from "lucide-react";
import ChartBase from "@/components/general/Chart/ChartBase";
import ChartSection from "@/components/general/Chart/ChartSection";
import dummyTeamData from "@/data/dummyTeamData.json";
import { useState, useMemo } from "react";
import PagenationBar from "@/components/general/PagenationBar";
import { useRouter } from "next/navigation";

export default function NoticePage() {
    const router = useRouter();
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const notices = dummyTeamData.notices || [];
    const members = dummyTeamData.members || [];

    const getAuthor = (userId: string) => {
        const member = members.find(m => m.user.id === userId);
        return member ? member.user : null;
    };

    const filteredNotices = useMemo(() => {
        return notices.filter(notice => {
            return notice.title.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [notices, searchQuery]);

    const totalItems = filteredNotices.length;
    const currentNotices = filteredNotices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchText);
            setCurrentPage(1);
        }
    };

    const handleRowClick = (noticeId: string) => {
        router.push(`/team/notice/${noticeId}`);
    };

    const titleColumnData = currentNotices.map(notice => ({
        text: notice.title,
        onClick: () => handleRowClick(notice.id),
    }));

    const authorColumnData = currentNotices.map(notice => {
        const author = getAuthor(notice.created_by);
        return {
            text: author ? author.name : "Unknown",
            image: author ? author.userImage : undefined,
            onClick: () => handleRowClick(notice.id),
        };
    });

    const dateColumnData = currentNotices.map(notice => ({
        text: new Date(notice.created_at).toLocaleDateString(),
        onClick: () => handleRowClick(notice.id),
    }));

    return (
        <VStack fullWidth fullHeight align='start' justify='start' className={s.container} gap={24}>
            <Title text="Notice" />
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