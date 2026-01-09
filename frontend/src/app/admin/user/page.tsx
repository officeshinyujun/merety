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
import UserEditCard from "@/components/admin/UserEditCard";
import ModalContainer from "@/components/general/ModalContainer";

export default function UserPage() {
    const router = useRouter();
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMember, setSelectedMember] = useState<any>(null);

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

    const handleRowClick = (member: any) => {
        setSelectedMember(member);
    };

    const infoColumnData = currentMembers.map(member => ({
        text: member.user.name,
        image: member.user.userImage,
        onClick: () => handleRowClick(member),
    }));

    const statusColumnData = currentMembers.map(member => ({
        text: member.user.status,
        onClick: () => handleRowClick(member),
    }));

    const roleColumnData = currentMembers.map(member => ({
        text: member.role,
        onClick: () => handleRowClick(member),
    }));

    return (
        <>
            <VStack fullWidth fullHeight align='start' justify='start' className={s.container} gap={24}>
                <Title text="User Management" />
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
            {selectedMember && (
                <ModalContainer>
                    <UserEditCard 
                        password={selectedMember.user.password}
                        userImage={selectedMember.user.userImage}
                        name={selectedMember.user.name || ""}
                        email={selectedMember.user.email}
                        role={selectedMember.role}
                        status={selectedMember.user.status}
                        onClose={() => setSelectedMember(null)}
                    />
                </ModalContainer>
            )}
        </>
    )
}