'use client';

import { VStack } from "@/components/general/VStack"
import s from "./style.module.scss"
import SubTitle from "@/components/study/SubTitle"
import { useParams } from "next/navigation";
import dummyTeamData from "@/data/dummyTeamData.json";
import { HStack } from "@/components/general/HStack";
import Image from "next/image";
import TitleNText from "@/components/team/Member/TitleNText";
import Divider from "@/components/general/Divider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContributeCard from "@/components/team/Member/ContributeCard";
import { calculateIncreaseRate } from "@/lib/calculator";
import { useState } from "react";

export default function MemberDetailPage() {
    const params = useParams();
    const memberID = params.memberID as string;
    const [currentMonthIndex, setCurrentMonthIndex] = useState(9);

    const member = dummyTeamData.members.find(m => m.user.id === memberID);

    const dummyContributionData = [
    {
        month: 1, tilCount: 5, wilCount: 8, participationRate: 35.2,
        tilCategory: [{name: "AI", count: 2}, {name: "LLM", count: 1}, {name: "Hack", count: 5}, {name: "porensic", count: 20}, {name: "dd", count: 50}],
        grass: [{day: "1", measure: 1}, {day: "2", measure: 0}, {day: "3", measure: 2}, {day: "4", measure: 1}, {day: "5", measure: 0}, {day: "6", measure: 1}, {day: "7", measure: 3}]
    },
    {
        month: 2, tilCount: 6, wilCount: 10, participationRate: 38.5,
        tilCategory: [{name: "AI", count: 4}, {name: "LLM", count: 3}, {name: "Hack", count: 8}, {name: "porensic", count: 45}, {name: "dd", count: 85}],
        grass: [{day: "1", measure: 2}, {day: "2", measure: 2}, {day: "3", measure: 1}, {day: "4", measure: 3}, {day: "5", measure: 2}, {day: "6", measure: 1}, {day: "7", measure: 4}]
    },
    {
        month: 3, tilCount: 8, wilCount: 15, participationRate: 42.1,
        tilCategory: [{name: "AI", count: 7}, {name: "LLM", count: 6}, {name: "Hack", count: 12}, {name: "porensic", count: 80}, {name: "dd", count: 120}],
        grass: [{day: "1", measure: 3}, {day: "2", measure: 4}, {day: "3", measure: 3}, {day: "4", measure: 2}, {day: "5", measure: 5}, {day: "6", measure: 3}, {day: "7", measure: 2}]
    },
    {
        month: 4, tilCount: 9, wilCount: 16, participationRate: 45.8,
        tilCategory: [{name: "AI", count: 9}, {name: "LLM", count: 10}, {name: "Hack", count: 18}, {name: "porensic", count: 110}, {name: "dd", count: 190}],
        grass: [{day: "1", measure: 4}, {day: "2", measure: 2}, {day: "3", measure: 5}, {day: "4", measure: 6}, {day: "5", measure: 3}, {day: "6", measure: 4}, {day: "7", measure: 5}]
    },
    {
        month: 5, tilCount: 11, wilCount: 18, participationRate: 50.2,
        tilCategory: [{name: "AI", count: 12}, {name: "LLM", count: 15}, {name: "Hack", count: 22}, {name: "porensic", count: 140}, {name: "dd", count: 260}],
        grass: [{day: "1", measure: 5}, {day: "2", measure: 6}, {day: "3", measure: 4}, {day: "4", measure: 7}, {day: "5", measure: 5}, {day: "6", measure: 6}, {day: "7", measure: 4}]
    },
    {
        month: 6, tilCount: 7, wilCount: 12, participationRate: 40.5, // 방학/휴식기 컨셉
        tilCategory: [{name: "AI", count: 5}, {name: "LLM", count: 8}, {name: "Hack", count: 15}, {name: "porensic", count: 90}, {name: "dd", count: 150}],
        grass: [{day: "1", measure: 2}, {day: "2", measure: 1}, {day: "3", measure: 3}, {day: "4", measure: 2}, {day: "5", measure: 1}, {day: "6", measure: 2}, {day: "7", measure: 1}]
    },
    {
        month: 7, tilCount: 10, wilCount: 19, participationRate: 48.9,
        tilCategory: [{name: "AI", count: 10}, {name: "LLM", count: 18}, {name: "Hack", count: 25}, {name: "porensic", count: 160}, {name: "dd", count: 280}],
        grass: [{day: "1", measure: 4}, {day: "2", measure: 5}, {day: "3", measure: 6}, {day: "4", measure: 4}, {day: "5", measure: 7}, {day: "6", measure: 5}, {day: "7", measure: 8}]
    },
    {
        month: 8, tilCount: 11, wilCount: 20, participationRate: 51.3,
        tilCategory: [{name: "AI", count: 14}, {name: "LLM", count: 22}, {name: "Hack", count: 28}, {name: "porensic", count: 175}, {name: "dd", count: 310}],
        grass: [{day: "1", measure: 5}, {day: "2", measure: 4}, {day: "3", measure: 6}, {day: "4", measure: 8}, {day: "5", measure: 3}, {day: "6", measure: 5}, {day: "7", measure: 7}]
    },
    {
        month: 9, tilCount: 10, wilCount: 20, participationRate: 52.5,
        tilCategory: [{name: "AI", count: 15}, {name: "LLM", count: 25}, {name: "Hack", count: 30}, {name: "porensic", count: 180}, {name: "dd", count: 350}],
        grass: [{day: "1", measure: 3}, {day: "2", measure: 5}, {day: "3", measure: 2}, {day: "4", measure: 8}, {day: "5", measure: 1}, {day: "6", measure: 4}, {day: "7", measure: 6}]
    },
    {
        month: 10, tilCount: 12, wilCount: 23, participationRate: 58.9,
        tilCategory: [{name: "AI", count: 20}, {name: "LLM", count: 32}, {name: "Hack", count: 44}, {name: "porensic", count: 235}, {name: "dd", count: 435}],
        grass: [{day: "1", measure: 7}, {day: "2", measure: 6}, {day: "3", measure: 5}, {day: "4", measure: 4}, {day: "5", measure: 3}, {day: "6", measure: 2}, {day: "7", measure: 1}]
    },
    {
        month: 11, tilCount: 15, wilCount: 28, participationRate: 65.4,
        tilCategory: [{name: "AI", count: 25}, {name: "LLM", count: 40}, {name: "Hack", count: 50}, {name: "porensic", count: 280}, {name: "dd", count: 510}],
        grass: [{day: "1", measure: 8}, {day: "2", measure: 9}, {day: "3", measure: 7}, {day: "4", measure: 8}, {day: "5", measure: 10}, {day: "6", measure: 8}, {day: "7", measure: 9}]
    },
    {
        month: 12, tilCount: 14, wilCount: 26, participationRate: 62.1,
        tilCategory: [{name: "AI", count: 22}, {name: "LLM", count: 38}, {name: "Hack", count: 48}, {name: "porensic", count: 300}, {name: "dd", count: 550}],
        grass: [{day: "1", measure: 6}, {day: "2", measure: 5}, {day: "3", measure: 8}, {day: "4", measure: 7}, {day: "5", measure: 6}, {day: "6", measure: 5}, {day: "7", measure: 4}]
    }
];

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
        if (currentMonthIndex < dummyContributionData.length - 1) {
            setCurrentMonthIndex(prev => prev + 1);
        }
    };

    if (!member) {
        return (
            <VStack
                align="center"
                justify="center"
                fullWidth
                fullHeight
                className={s.container}
            >
                <h1>멤버를 찾을 수 없습니다.</h1>
            </VStack>
        );
    }

    const currentMonthData = dummyContributionData[currentMonthIndex];
    const prevMonthData = currentMonthIndex > 0 ? dummyContributionData[currentMonthIndex - 1] : currentMonthData;

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
            <SubTitle text={member.user.name} />
            <VStack align="start" justify="start" fullWidth fullHeight className={s.contents} gap={12}>
                <HStack className={s.memberInfo} fullWidth align="start" justify="start" gap={16}>
                    <Image src={member.user.userImage} alt={member.user.name} width={70} height={70} />
                    <VStack align="start" justify="start" className={s.memberDescription} gap={12}>
                        <TitleNText title="name" text={member.user.name} />
                        <TitleNText title="email" text={member.user.email} />
                        <TitleNText title="role" text={member.user.role} />
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
                            style={{ cursor: currentMonthIndex < dummyContributionData.length - 1 ? 'pointer' : 'default', opacity: currentMonthIndex < dummyContributionData.length - 1 ? 1 : 0.3 }}
                        />
                    </HStack>
                    <HStack align="start" justify="start" fullWidth gap={12}>
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
                </VStack>
            </VStack>
            
        </VStack>
    )
}