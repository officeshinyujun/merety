'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss"
import SubTitle from "@/components/study/SubTitle";
import { HStack } from "@/components/general/HStack";
import Input from "@/components/general/Input";
import { Search } from "lucide-react";
import CategoryTag from "@/components/study/Archives/CategoryTag";
import ChartBase from "@/components/general/Chart/ChartBase";
import ChartSection from "@/components/general/Chart/ChartSection";
import dummyStudyData from "@/data/dummyStudyData.json";
import { convertArchivesToChartData } from "@/lib/converter";
import { Archive as ArchiveType } from "@/types/archive";
import { useState, useMemo } from "react";
import PagenationBar from "@/components/general/PagenationBar";
import { useParams } from "next/navigation";

export default function Archive() {
    const params = useParams();
    const studyId = params.id as string;
    const categoryList = ["ALL", "DOC", "SLIDE", "CODE", "LINK", "ETC"];
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 9;

    // Find the study and its archives
    const study = dummyStudyData.find(s => s.id === studyId) || dummyStudyData[0];
    const archives = (study?.Archive || []) as ArchiveType[];

    // Filter by category and search query
    const filteredArchives = useMemo(() => {
        let result = archives;
        if (selectedCategory !== "ALL") {
            result = result.filter(a => a.category === selectedCategory);
        }
        if (searchQuery) {
            result = result.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return result;
    }, [archives, selectedCategory, searchQuery]);

    // Define columns for the chart
    const columns = [
        { key: 'title', label: 'Title', width: '500px' },
        { key: 'category', label: 'Category', width: '100%' },
        { key: 'uploader_id', label: 'Uploader', width: '100%' },
        { key: 'created_at', label: 'Date', width: '100%' },
        { key: 'actions', label: 'Actions', width: '100px' },
    ];

    // Convert data
    // Note: We need to slice the data *before* converting to ensure row alignment across columns if we paginate the source list.
    // Actually, convertArchivesToChartData returns a list of "Columns" (ChartSectionData), and each column has "children" (rows).
    // So we should paginate the `filteredArchives` first, then convert the current page's items.
    
    const totalItems = filteredArchives.length;
    const currentArchives = filteredArchives.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // @ts-ignore - 'main' key special handling in converter matches our columns definition
    const chartData = convertArchivesToChartData(currentArchives, columns);

    const handleCategoryClick = (cat: string) => {
        setSelectedCategory(cat);
        setCurrentPage(1); // Reset to first page on filter change
    };
    
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setSearchQuery(searchText);
            setCurrentPage(1);
        }
    };

    return (
        <VStack 
        align="start" 
        justify="start"
        className={s.container}
        fullWidth
        fullHeight>
            <SubTitle text="Archives" />
            <VStack 
            fullWidth
            fullHeight
            align="start"
            justify="start"
            gap={16}
            className={s.contents}
            >
                <HStack fullWidth align="center" justify="center">
                    <Input 
                    width="700px"
                    height="40px"
                    placeholder="파일을 검색하세요" 
                    icon={<Search size={18} color="#959595" />}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    />
                </HStack>
                <HStack fullWidth align="center" justify="start" gap={12}>
                    {categoryList.map((item, index) => (
                        <CategoryTag 
                            key={index} 
                            text={item} 
                            isClick={selectedCategory === item} 
                            onClick={() => handleCategoryClick(item)}
                        />
                    ))}
                </HStack>
                <ChartBase>
                    {chartData.map((data, index) => (
                         <ChartSection 
                             key={index} 
                             title={data.title} 
                             children={data.children} 
                             width={data.width} 
                             height={data.height} 
                         />
                    ))}
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