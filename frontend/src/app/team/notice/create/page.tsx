'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VStack } from "@/components/general/VStack";
import { HStack } from "@/components/general/HStack";
import Title from "@/components/study/Title";
import Input from "@/components/general/Input";
import Button from "@/components/general/Button";
import MdEditor from "@/components/general/MdEditor";
import { noticesApi } from "@/api/notices";
import s from "./style.module.scss";

export default function NoticeCreatePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            alert("Title and content are required.");
            return;
        }

        setLoading(true);
        try {
            await noticesApi.createNotice({
                title,
                content_md: content,
            });
            router.push('/team/notice');
        } catch (error) {
            console.error("Failed to create notice:", error);
            alert("Failed to create notice. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <VStack fullWidth fullHeight align='start' justify='start' className={s.container} gap={32}>
            <VStack fullWidth gap={8} className={s.header}>
                <Title text="Create Notice" />
            </VStack>

            <VStack fullWidth gap={24}>
                <Input
                    placeholder="Enter notice title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={s.titleInput}
                    width="100%"
                />

                <VStack fullWidth gap={12} className={s.editorContainer}>
                    <MdEditor
                        contents={content}
                        onChange={setContent}
                    />
                </VStack>

                <HStack fullWidth justify="end" gap={12} className={s.actions}>
                    <Button
                        onClick={() => router.back()}
                        disabled={loading}
                        className={s.cancelButton}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading || !title.trim() || !content.trim()}
                        className={s.publishButton}
                    >
                        {loading ? "Publishing..." : "Publish Notice"}
                    </Button>
                </HStack>
            </VStack>
        </VStack>
    );
}
