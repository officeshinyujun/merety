'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss"
import Title from "@/components/study/Title";
import { HStack } from "@/components/general/HStack";
import MyTILCard from "@/components/team/TIL/MyTILCard";
import Input from "@/components/general/Input";
import { Search, Plus } from "lucide-react";
import TILCard from "@/components/team/TIL/TILCard";
import { useState, useEffect } from "react";
import PagenationBar from "@/components/general/PagenationBar";
import { tilApi, TilStats } from "@/api/til";
import { TilPost } from "@/types/til";
import Button from "@/components/general/Button";
import { useRouter } from "next/navigation";

export default function TILPage() {
    const router = useRouter();
    const [searchText, setSearchText] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [posts, setPosts] = useState<TilPost[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [stats, setStats] = useState<TilStats | null>(null);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await tilApi.getMyTilStats();
                setStats(res);
            } catch (error) {
                console.error("Failed to fetch TIL stats:", error);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const res = await tilApi.getGlobalTilPosts({
                    page: currentPage,
                    limit: itemsPerPage,
                    search: searchQuery || undefined,
                    category: 'TIL'
                });
                setPosts(res.data);
                setTotalItems(res.pagination.total);
            } catch (error) {
                console.error("Failed to fetch TIL posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [currentPage, searchQuery]);

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
            <HStack fullWidth align="center" justify="between">
                <Title text="TIL"/>
                <Button 
                    icon={<Plus size={18}/>}
                    onClick={() => router.push('/team/til/create')}
                    className={s.writeButton}
                >
                    Write TIL
                </Button>
            </HStack>
            
            <HStack align="start" justify="start" fullWidth className={s.myTILCardContainer} gap={12}>
                <MyTILCard title="이번 달 작성" content={stats?.monthly_count || 0}/>
                <MyTILCard title="전체 작성" content={stats?.total_count || 0}/>
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
                {loading ? (
                    <p>Loading...</p>
                ) : posts.length > 0 ? (
                    posts.map((til) => (
                        <TILCard 
                            key={til.id}
                            title={til.title} 
                            user={{
                                name: til.author_name, 
                                image: til.author_image
                            }} 
                            date={new Date(til.created_at).toLocaleDateString()}
                            onClick={() => router.push(`/team/til/${til.id}`)}
                        />
                    ))
                ) : (
                    <p>No TIL posts found.</p>
                )}
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
