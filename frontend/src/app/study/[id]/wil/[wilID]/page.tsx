'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import UserCard from "@/components/general/UserCard";
import MdEditor from "@/components/general/MdEditor";
import { useParams } from "next/navigation";
import dummyStudyData from "@/data/dummyStudyData.json";
import SubTitle from "@/components/study/SubTitle";
import { HStack } from "@/components/general/HStack";

export default function WILDeatilPage() {
    const params = useParams();
    const studyId = params.id as string;
    const wilId = params.wilID as string;

    const study = dummyStudyData.find(s => s.id === studyId);
    const wil = study?.WIL.find(w => w.id === wilId);

    if (!wil) {
        return (
            <VStack
                align="center"
                justify="center"
                fullWidth
                fullHeight
                className={s.container}
            >
                <h1>WIL을 찾을 수 없습니다.</h1>
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
                    name: wil.createUser?.name || "Unknown",
                    userImage: wil.createUser?.userImage || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s"
                }} />
            </HStack>
            <MdEditor contents={wil.content_md} isEdit={false} />
        </VStack> 
    )
}
            