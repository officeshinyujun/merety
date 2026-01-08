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

export default function MembersPage() {
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const members = dummyTeamData.members || [];

    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            return member.user.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [members, searchQuery]);

    const totalItems = filteredMembers.length;
    const currentMembers = filteredMembers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchText);
            setCurrentPage(1);
        }
    };

    const infoColumnData = currentMembers.map(member => ({
        text: member.user.name,
        image: member.user.userImage,
    }));

    const statusColumnData = currentMembers.map(member => ({
        text: member.user.status,
    }));

    const roleColumnData = currentMembers.map(member => ({
        text: member.role,
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