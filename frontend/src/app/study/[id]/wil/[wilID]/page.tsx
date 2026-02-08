'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import UserCard from "@/components/general/UserCard";
import MdEditor from "@/components/general/MdEditor";
import { useParams, useRouter } from "next/navigation";
import SubTitle from "@/components/study/SubTitle";
import { HStack } from "@/components/general/HStack";
import Divider from "@/components/general/Divider";
import { useState, useEffect } from "react";
import { tilApi, authApi } from "@/api";
import { TilPost } from "@/types/til";
import { User } from "@/types/user";
import { Loader2, Edit2, Trash2 } from "lucide-react";
import Button from "@/components/general/Button";

export default function WILDetailPage() {
    const params = useParams();
    const router = useRouter();
    const studyId = params.id as string;
    const wilId = params.wilID as string;

    const [wil, setWil] = useState<TilPost | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [wilRes, userRes] = await Promise.all([
                tilApi.getTilPost(wilId),
                authApi.getMe().catch(() => ({ user: null }))
            ]);
            setWil(wilRes);
            if (userRes?.user) {
                setCurrentUser(userRes.user);
            }
        } catch (error) {
            console.error("Failed to fetch WIL detail:", error);
            setError("WIL 정보를 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [wilId]);

    const handleDelete = async () => {
        if (!confirm('정말로 이 WIL을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await tilApi.deleteTilPost(wilId);
            router.push(`/study/${studyId}/wil`);
        } catch (error) {
            console.error("Failed to delete WIL:", error);
            alert('WIL 삭제에 실패했습니다.');
        }
    };

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

    const isAuthor = currentUser && (currentUser.id === wil.author_id || currentUser.role === 'SUPER_ADMIN');

    return (
        <VStack
            align="start"
            justify="start"
            gap={16}
            fullWidth
            fullHeight
            className={s.container}
        >
            <HStack fullWidth align="center" justify="between">
                <SubTitle text={wil.title} />
                {isAuthor && (
                    <HStack gap={8}>
                        <Button
                            onClick={handleDelete}
                            className={s.deleteButton}
                            icon={<Trash2 size={16} />}
                        >
                            삭제
                        </Button>
                        <Button
                            onClick={() => router.push(`/study/${studyId}/wil/${wilId}/edit`)}
                            className={s.editButton}
                            icon={<Edit2 size={16} />}
                        >
                            수정
                        </Button>
                    </HStack>
                )}
            </HStack>

            <HStack fullWidth align="start" justify="start" style={{ padding: "0px 16px" }}>
                <UserCard user={{
                    name: wil.author_name || "Unknown",
                    user_image: wil.author_image || "/default-avatar.png"
                }} />
            </HStack>
            <Divider />
            <MdEditor contents={wil.content_md} isEdit={false} className={s.mdSection} />
        </VStack>
    )
}

