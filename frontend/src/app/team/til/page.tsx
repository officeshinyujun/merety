'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss"
import Title from "@/components/study/Title";
import { HStack } from "@/components/general/HStack";
import MyTILCard from "@/components/team/TIL/MyTILCard";
import Input from "@/components/general/Input";
import { Search } from "lucide-react";
import TILCard from "@/components/team/TIL/TILCard";
import dummyTeamData from "@/data/dummyTeamData.json";
import { useState } from "react";
import PagenationBar from "@/components/general/PagenationBar";

export default function TILPage() {
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const filteredTils = dummyTeamData.tils.filter(til => 
        til.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredTils.length;
    const currentTils = filteredTils.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setSearchQuery(searchText);
            setCurrentPage(1);
        }
    };

    return (
        <VStack fullHeight fullWidth align="start" justify="start" className={s.container} gap={16}>
            <Title text="TIL"/>
            <HStack align="start" justify="start" fullWidth className={s.myTILCardContainer} gap={12}>
                <MyTILCard title="이번 달 작성" content={24}/>
                <MyTILCard title="전체 작성" content={243}/>
            </HStack>
            <HStack fullWidth align="center" justify="center">
                <Input
                    width="700px"
                    placeholder="찾을 TIL을 입력해주세요."
                    icon={<Search size={20} color="#959595" strokeWidth={1.5}/>}
                    value={searchText}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                />
            </HStack>
            <VStack fullWidth align="start" justify="start" gap={16} className={s.tilList}>
                {currentTils.map((til) => (
                    <TILCard 
                        key={til.id}
                        title={til.title} 
                        user={{
                            name: til.author_name, 
                            image: til.author_image
                        }} 
                        date={new Date(til.created_at).toLocaleDateString()}
                    />
                ))}
            </VStack>
            <PagenationBar 
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </VStack>
    )
}