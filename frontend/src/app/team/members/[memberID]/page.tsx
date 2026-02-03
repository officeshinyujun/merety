'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import SubTitle from "@/components/study/SubTitle";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { HStack } from "@/components/general/HStack";
import Image from "next/image";
import TitleNText from "@/components/team/Member/TitleNText";
import Divider from "@/components/general/Divider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContributeCard from "@/components/team/Member/ContributeCard";
import { calculateIncreaseRate } from "@/lib/calculator";
import RecentCard from "@/components/team/Member/RecentCard";
import Grass from "@/components/team/Member/Grass";
import { teamApi, TeamMember } from "@/api/team";

interface Contribution {
    month: number;
    year: number;
    tilCount: number;
    wilCount: number;
    participationRate: number;
    recent: Array<{ title: string; category: string; time: string }>;
    grass: Array<{ day: string; measure: number }>;
}

export default function MemberDetailPage() {
    const params = useParams();
    const memberID = params.memberID as string;
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
    const [member, setMember] = useState<TeamMember | null>(null);
    const [contributions, setContributions] = useState<Contribution[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [memberRes, contributionRes] = await Promise.all([
                    teamApi.getMember(memberID),
                    teamApi.getMemberContributions(memberID)
                ]);
                setMember(memberRes);
                setContributions(contributionRes);
                if (contributionRes.length > 0) {
                    setCurrentMonthIndex(contributionRes.length - 1);
                }
            } catch (error) {
                console.error("Failed to fetch member details:", error);
                setMember(null);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [memberID]);

    const monthToStringConverter = (month : number) => {
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return months[month - 1] || "Unknown";
    }

    const handlePrevMonth = () => {
        if (currentMonthIndex > 0) {
            setCurrentMonthIndex(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonthIndex < contributions.length - 1) {
            setCurrentMonthIndex(prev => prev + 1);
        }
    };

    if (loading) {
        return (
            <VStack align="center" justify="center" fullWidth fullHeight className={s.container}>
                <p>Loading...</p>
            </VStack>
        );
    }

    if (!member || contributions.length === 0) {
        return (
            <VStack align="center" justify="center" fullWidth fullHeight className={s.container}>
                <h1>멤버를 찾을 수 없거나 데이터가 없습니다.</h1>
            </VStack>
        );
    }

    const currentMonthData = contributions[currentMonthIndex];
    const prevMonthData = currentMonthIndex > 0 ? contributions[currentMonthIndex - 1] : currentMonthData;

    const tilRate = calculateIncreaseRate(currentMonthData.tilCount, prevMonthData.tilCount);
    const wilRate = calculateIncreaseRate(currentMonthData.wilCount, prevMonthData.wilCount);
    const participationRateDiff = calculateIncreaseRate(currentMonthData.participationRate, prevMonthData.participationRate);

    return (
        <VStack
            align="start"
            justify="start" 
            fullWidth
            fullHeight
            gap={16}
            className={s.container}
        >
            <SubTitle text={member.user.name || member.user.handle} />
            <VStack align="start" justify="start" fullWidth fullHeight className={s.contents} gap={12}>
                <HStack className={s.memberInfo} fullWidth align="start" justify="start" gap={16}>
                    <Image src={member.user.user_image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s"} alt={member.user.name || member.user.handle} width={70} height={70} />
                    <VStack align="start" justify="start" className={s.memberDescription} gap={12}>
                        <TitleNText title="name" text={member.user.name || member.user.handle} />
                        <TitleNText title="email" text={member.user.email} />
                        <TitleNText title="role" text={member.role} />
                        <TitleNText title="status" text={member.user.status} />
                    </VStack>
                </HStack>
                <Divider/>
                <VStack align="start" justify="start" fullWidth className={s.contributions} gap={12}>
                    <HStack align="center" justify="center" fullWidth gap={12} className={s.monthSelect}>
                        <ChevronLeft 
                            size={20} 
                            color="#fdfdfe" 
                            strokeWidth={2} 
                            onClick={handlePrevMonth} 
                            style={{ cursor: currentMonthIndex > 0 ? 'pointer' : 'default', opacity: currentMonthIndex > 0 ? 1 : 0.3 }}
                        />
                        <h2>{monthToStringConverter(currentMonthData.month)} contribution</h2>
                        <ChevronRight 
                            size={20} 
                            color="#fdfdfe" 
                            strokeWidth={2} 
                            onClick={handleNextMonth}
                            style={{ cursor: currentMonthIndex < contributions.length - 1 ? 'pointer' : 'default', opacity: currentMonthIndex < contributions.length - 1 ? 1 : 0.3 }}
                        />
                    </HStack>
                    <HStack align="start" justify="start" fullWidth gap={12} className={s.contributionContainer1}>
                        <ContributeCard 
                            title="TIL" 
                            count={currentMonthData.tilCount} 
                            increaseRate={tilRate.value}
                            isIncreased={tilRate.isIncreased}
                        />
                        <ContributeCard 
                            title="WIL" 
                            count={currentMonthData.wilCount} 
                            increaseRate={wilRate.value}
                            isIncreased={wilRate.isIncreased}
                        />
                        <ContributeCard 
                            title="Participation Rate" 
                            count={currentMonthData.participationRate} 
                            increaseRate={participationRateDiff.value}
                            isIncreased={participationRateDiff.isIncreased}
                        />
                    </HStack>
                    <HStack align="start" justify="start" fullWidth gap={12} className={s.contributionContainer2}>
                        <VStack align="start" justify="start" fullWidth className={s.categoryContainer} gap={12}>
                            <p>최근 작성</p>
                            <HStack fullWidth fullHeight align="start" justify="start" style={{padding:"4px"}} gap={12}>
                                {currentMonthData.recent.map((item: any, index: number) => (
                                    <RecentCard key={index} title={item.title} category={item.category as "TIL" | "WIL"} createdAt={item.time} />
                                ))}
                            </HStack>
                        </VStack>
                        <VStack align="start" justify="start" className={s.grassContainer} gap={12}>
                            <p>잔디</p>
                            <Grass data={currentMonthData.grass} />
                        </VStack>
                    </HStack>
                </VStack>
            </VStack>
            
        </VStack>
    )
}
