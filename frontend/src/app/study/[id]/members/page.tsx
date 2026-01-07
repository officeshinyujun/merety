'use client';

import ChartBase from "@/components/general/Chart/ChartBase";
import s from "./style.module.scss";
import { VStack } from "@/components/general/VStack";
import SubTitle from '@/components/study/SubTitle';
import ChartSection from '@/components/general/Chart/ChartSection';
import PagenationBar from '@/components/general/PagenationBar';
import { useState } from "react";

const dummyMemeberData = [
    {
        width : "500px",
        height : "100%",
        title : "name",
        children : Array.from({ length: 20 }, (_, i) => ({
            title: `user-${i + 1}`,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s"
        }))
    },
    {
        width : "100%",
        height : "100%",
        title : "system-role",
        children : Array.from({ length: 20 }, (_, i) => ({
            text: i === 0 ? "manager" : "member"
        }))
    },
    {
        width : "100%",
        height : "100%",
        title : "study-role",
        children : Array.from({ length: 20 }, (_, i) => ({
            text: i === 0 ? "manager" : "member"
        }))
    },
    {
        width : "100%",
        height : "100%",
        title : "participate-date",
        children : Array.from({ length: 20 }, (_, i) => ({
            text: `2024-01-${String(i + 1).padStart(2, '0')}`
        }))
    },
]

export default function Members() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 11;
    const totalItems = dummyMemeberData[0].children.length;

    const paginatedData = dummyMemeberData.map(section => ({
        ...section,
        children: section.children.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    }));

    return (
        <VStack align='start' justify='start' fullWidth fullHeight gap={16} className={s.container} >
            <SubTitle text="Members" />
            <ChartBase>
                {
                    paginatedData.map((data, index) => (
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
