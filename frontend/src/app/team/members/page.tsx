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
import { useItemsPerPage } from "@/hooks/useItemsPerPage";
import { teamApi, TeamMember } from "@/api/team";

export default function MembersPage() {
    const router = useRouter();
    const itemsPerPage = useItemsPerPage({
        itemHeight: 60,
        headerOffset: 200,
        footerOffset: 80,
        minItems: 5,
        maxItems: 15,
    })-3;
    
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                const response = await teamApi.getMembers({
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchQuery || undefined
                });
                setMembers(response.data);
                setTotalItems(response.pagination.total);
            } catch (error) {
                console.error("Failed to fetch members:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMembers();
    }, [currentPage, searchQuery, itemsPerPage]);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchText);
            setCurrentPage(1);
        }
    };

    const handleRowClick = (memberId: string) => {
        router.push(`/team/members/${memberId}`);
    };

    const infoColumnData = members.map(member => ({
        text: member.user.name || member.user.handle,
        image: member.user.user_image || undefined,
        onClick: () => handleRowClick(member.user.id),
    }));

    const statusColumnData = members.map(member => ({
        text: member.user.status,
        onClick: () => handleRowClick(member.user.id),
    }));

    const roleColumnData = members.map(member => ({
        text: member.role,
        onClick: () => handleRowClick(member.user.id),
    }));

    return (
        <VStack fullWidth fullHeight align='start' justify='start' className={s.container} gap={24}>
            <Title text="Members" />
            <HStack fullWidth align="center" justify="center">
                <Input 
                    width="700px"
                    placeholder="유저를 검색하세요..." 
                    icon={<Search size={20} color="#959595" strokeWidth={1.5}/>}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                />
            </HStack>
            <VStack fullWidth fullHeight align='start' justify='start' gap={12}>
                <ChartBase>
                    <ChartSection 
                        title="Info" 
                        width="60%" 
                        children={infoColumnData} 
                    />
                    <ChartSection 
                        title="Status" 
                        width="20%" 
                        children={statusColumnData} 
                    />
                    <ChartSection 
                        title="Role" 
                        width="20%" 
                        children={roleColumnData} 
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
