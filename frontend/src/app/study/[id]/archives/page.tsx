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
import { convertArchivesToChartData } from "@/lib/converter";
import { Archive as ArchiveType } from "@/types/archive";
import { useState, useMemo, useEffect } from "react";
import PagenationBar from "@/components/general/PagenationBar";
import { useParams } from "next/navigation";
import { useItemsPerPage } from "@/hooks/useItemsPerPage";
import { studiesApi, archiveApi } from "@/api";
import { Loader2 } from "lucide-react";

export default function Archive() {
    const params = useParams();
    const studyId = params.id as string;
    const categoryList = ["ALL", "DOC", "SLIDE", "CODE", "LINK", "ETC"];
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = useItemsPerPage({
        itemHeight: 60,
        headerOffset: 250,
        footerOffset: 80,
        minItems: 5,
        maxItems: 15,
    }) - 3;

    const [archives, setArchives] = useState<ArchiveType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploaderMap, setUploaderMap] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [archivesRes, membersRes] = await Promise.all([
                    archiveApi.getArchives(studyId),
                    studiesApi.getMembers(studyId)
                ]);

                setArchives(archivesRes.data || []);

                // Create uploader map
                const map: Record<string, string> = {};
                // @ts-ignore
                const members = (membersRes.data || membersRes) as any[]; 
                members.forEach(m => {
                    map[m.user.id] = m.user.name || m.user.handle;
                });
                setUploaderMap(map);

            } catch (error) {
                console.error("Failed to fetch archives:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [studyId]);

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
    const chartData = convertArchivesToChartData(currentArchives, columns, uploaderMap);

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

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center">
                <Loader2 className={s.spinner} size={32} />
            </VStack>
        )
    }

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
               <VStack fullWidth fullHeight align="start" justify="start" style={{ overflowY: 'auto' }}> 
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
                </VStack>
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