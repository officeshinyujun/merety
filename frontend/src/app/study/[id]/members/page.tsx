'use client';

import { use, useState, useEffect } from 'react';
import ChartBase from "@/components/general/Chart/ChartBase";
import s from "./style.module.scss";
import { VStack } from "@/components/general/VStack";
import SubTitle from '@/components/study/SubTitle';
import ChartSection from '@/components/general/Chart/ChartSection';
import PagenationBar from '@/components/general/PagenationBar';
import { useItemsPerPage } from "@/hooks/useItemsPerPage";
import { studiesApi } from '@/api';
import { StudyMember } from '@/api';
import { Loader2 } from 'lucide-react';

export default function Members({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [members, setMembers] = useState<StudyMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = useItemsPerPage({
        itemHeight: 60,
        headerOffset: 200,
        footerOffset: 80,
        minItems: 5,
        maxItems: 15,
    }) - 3;

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setIsLoading(true);
                const response = await studiesApi.getMembers(id);
                // @ts-ignore
                setMembers(response.data || response);
            } catch (err) {
                console.error('Failed to fetch members:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();
    }, [id]);

    const totalItems = members.length;
    const paginatedMembers = members.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // 데이터 변환
    const chartData = [
        {
            width : "500px",
            height : "100%",
            title : "name",
            children : paginatedMembers.map(member => ({
                title: member.user.name || member.user.handle,
                image: member.user.user_image || '/default-avatar.png'
            }))
        },
        {
            width : "100%",
            height : "100%",
            title : "system-role",
            children : paginatedMembers.map(member => ({
                text: member.user.role || 'USER'
            }))
        },
        {
            width : "100%",
            height : "100%",
            title : "study-role",
            children : paginatedMembers.map(member => ({
                text: member.member_role
            }))
        },
        {
            width : "100%",
            height : "100%",
            title : "participate",
            children : paginatedMembers.map(member => ({
                text: new Date(member.joined_at).toLocaleDateString('ko-KR')
            }))
        },
    ];

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" style={{ minHeight: '400px' }}>
                <Loader2 className={s.spinner} size={32} />
            </VStack>
        );
    }

    return (
        <VStack align='start' justify='start' fullWidth fullHeight gap={16} className={s.container} >
            <SubTitle text="Members" />
            <ChartBase>
                {
                    chartData.map((data, index) => (
                        <ChartSection key={index} title={data.title} children={data.children} width={data.width} height={data.height} />
                    ))
                } 
            </ChartBase>
            <PagenationBar 
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </VStack>
    )
}
