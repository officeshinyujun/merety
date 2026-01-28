'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import SubTitle from "@/components/study/SubTitle";
import { HStack } from "@/components/general/HStack";
import Input from "@/components/general/Input";
import { Search } from "lucide-react";
import DateCard from "@/components/study/WIL/DateCard";
import ChartBase from "@/components/general/Chart/ChartBase";
import ChartSection from "@/components/general/Chart/ChartSection";

import { useState, useMemo, useEffect } from "react";
import PagenationBar from "@/components/general/PagenationBar";
import { useParams, useRouter } from "next/navigation";
import { tilApi } from "@/api";
import { TilPost } from "@/types/til";
import { Loader2 } from "lucide-react";

export default function WilPage() {
    const params = useParams();
    const router = useRouter();
    const studyId = params.id as string;
    const itemsPerPage = 9;

    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("2024-01-01");
    const [endDate, setEndDate] = useState("2024-12-31");


    
    const [wils, setWils] = useState<TilPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                // Fetch up to 1000 posts to apply client-side filtering on specific date ranges
                // Ideally this should be server-side filtered
                const response = await tilApi.getTilPosts(studyId, { limit: 1000 });
                setWils(response.data);
            } catch (error) {
                console.error("Failed to fetch WILs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [studyId]);

    const filteredWils = useMemo(() => {
        return wils.filter(wil => {
            const matchesSearch = wil.title.toLowerCase().includes(searchQuery.toLowerCase());
            const wilDate = new Date(wil.created_at);
            const start = new Date(startDate);
            const end = new Date(endDate);
            // Include end date in comparison
            end.setHours(23, 59, 59, 999);
            
            const matchesDate = wilDate >= start && wilDate <= end;
            
            return matchesSearch && matchesDate;
        });
    }, [wils, searchQuery, startDate, endDate]);

    const totalItems = filteredWils.length;
    const currentWils = filteredWils.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchText);
            setCurrentPage(1);
        }
    };

    const handleRowClick = (wilId: string) => {
        router.push(`/study/${studyId}/wil/${wilId}`);
    };

    // Transform data for ChartSection
    const titleColumnData = currentWils.map(wil => ({
        text: wil.title,
        onClick: () => handleRowClick(wil.id)
    }));

    const writerColumnData = currentWils.map(wil => ({
        text: wil.author_name || 'Unknown',
        image: wil.author_image,
        onClick: () => handleRowClick(wil.id)
    }));

    const dateColumnData = currentWils.map(wil => ({
        text: new Date(wil.created_at).toLocaleDateString(),
        onClick: () => handleRowClick(wil.id)
    }));

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center">
                <Loader2 className={s.spinner} size={32} />
            </VStack>
        )
    }

    return (
        <VStack 
            align='start'
            justify='start' 
            fullWidth
            fullHeight 
            gap={16} 
            style={{padding : "48px 128px"}} 
            className={s.container}
        >
            <SubTitle text="WIL" />
                        <VStack 
                            fullWidth
                            fullHeight
                            align='start' 
                            justify='start' 
                            gap={12}
                            className={s.contents}
                        >
                            <HStack fullWidth align="center" justify="center">
                                <Input 
                                    width="700px"
                                    height="40px"
                                    placeholder="WIL을 검색하세요" 
                                    icon={<Search size={18} color="#959595" />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </HStack>
                            <HStack fullWidth align='center' justify='start' gap={12} className={s.dateSelect}>
                                <DateCard date={startDate} onDateChange={(date) => {
                                    setStartDate(date);
                                    setCurrentPage(1);
                                }}/>
                                <p>to</p>
                                <DateCard date={endDate} onDateChange={(date) => {
                                    setEndDate(date);
                                    setCurrentPage(1);
                                }}/>
                            </HStack>
                            
                            <ChartBase>
                    <ChartSection 
                        title="Title" 
                        width="60%" 
                        children={titleColumnData} 
                    />
                    <ChartSection 
                        title="Writer" 
                        width="20%" 
                        children={writerColumnData} 
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