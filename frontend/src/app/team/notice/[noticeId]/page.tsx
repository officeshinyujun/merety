'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import UserCard from "@/components/general/UserCard";
import MdEditor from "@/components/general/MdEditor";
import { useParams } from "next/navigation";
import dummyTeamData from "@/data/dummyTeamData.json";
import SubTitle from "@/components/study/SubTitle";
import { HStack } from "@/components/general/HStack";
import Divider from "@/components/general/Divider";

export default function NoticeDetailPage() {
    const params = useParams();
    const noticeId = params.noticeId as string;

    const notice = dummyTeamData.notices.find(n => n.id === noticeId);
    
    // Resolve author
    const member = notice ? dummyTeamData.members.find(m => m.user.id === notice.created_by) : null;
    const author = member ? member.user : null;

    if (!notice) {
        return (
            <VStack
                align="center"
                justify="center"
                fullWidth
                fullHeight
                className={s.container}
            >
                <h1>공지를 찾을 수 없습니다.</h1>
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
            <SubTitle text={notice.title} />
            <HStack fullWidth align="start" justify="start" style={{padding:"0px 16px"}}>
                <UserCard user={{
                    name: author?.name || "Unknown",
                    userImage: author?.userImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s"
                }} />
            </HStack>
            <Divider/>
            <MdEditor contents={notice.content_md} isEdit={false} className={s.mdSection} />
        </VStack> 
    )
}
            