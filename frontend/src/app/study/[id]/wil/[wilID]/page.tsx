'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import UserCard from "@/components/general/UserCard";
import MdEditor from "@/components/general/MdEditor";
import { useParams } from "next/navigation";
import dummyStudyData from "@/data/dummyStudyData.json";
import SubTitle from "@/components/study/SubTitle";
import { HStack } from "@/components/general/HStack";
import Divider from "@/components/general/Divider";
import { useState, useEffect } from "react";
import { tilApi } from "@/api";
import { TilPost } from "@/types/til";
import { Loader2 } from "lucide-react";

export default function WILDetailPage() {
    const params = useParams();
    const studyId = params.id as string;
    const wilId = params.wilID as string;

    const [wil, setWil] = useState<TilPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await tilApi.getTilPost(wilId);
                setWil(response);
            } catch (error) {
                console.error("Failed to fetch WIL detail:", error);
                setError("WIL 정보를 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [wilId]);

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center">
                <Loader2 className={s.spinner} size={32} />
            </VStack>
        );
    }

    if (error || !wil) {
        return (
            <VStack
                align="center"
                justify="center"
                fullWidth
                fullHeight
                className={s.container}
            >
                <h1>{error || "WIL을 찾을 수 없습니다."}</h1>
            </VStack>
        );
    }

    return (
        <VStack
            align="start"
            justify="start"
            gap={16}
            fullWidth
            fullHeight
            className={s.container}
        >
            <SubTitle text={wil.title} />
            <HStack fullWidth align="start" justify="start" style={{padding:"0px 16px"}}>
                <UserCard user={{
                    name: wil.author_name || "Unknown",
                    user_image: wil.author_image || "/default-avatar.png"
                }} />
            </HStack>
            <Divider/>
            <MdEditor contents={wil.content_md} isEdit={false} className={s.mdSection} />
        </VStack> 
    )
}
            