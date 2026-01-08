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
import RecentCard from "@/components/team/Member/RecentCard";
import Grass from "@/components/team/Member/Grass";

export default function MemberDetailPage() {
    const params = useParams();
    const memberID = params.memberID as string;
    const [currentMonthIndex, setCurrentMonthIndex] = useState(9);

    const member = dummyTeamData.members.find(m => m.user.id === memberID);

    const dummyContributionData = [
    {
        month: 1, tilCount: 5, wilCount: 8, participationRate: 35.2,
        recent: [
            { title: "React Hooks Basics",category : "TIL", time: "2024-01-05" },
            { title: "State Management in React",category : "TIL", time: "2024-01-12" },
            { title: "Understanding Virtual DOM",category : "TIL", time: "2024-01-20" }
        ],
        grass: [{day: "1", measure: 1}, {day: "2", measure: 0}, {day: "3", measure: 2}, {day: "4", measure: 1}, {day: "5", measure: 0}, {day: "6", measure: 1}, {day: "7", measure: 3}]
    },
    {
        month: 2, tilCount: 6, wilCount: 10, participationRate: 38.5,
        recent: [
            { title: "TypeScript Interfaces",category : "TIL", time: "2024-02-04" },
            { title: "Generics in TS",category : "TIL", time: "2024-02-15" },
            { title: "Strict Type Checking",category : "TIL", time: "2024-02-22" }
        ],
        grass: [{day: "1", measure: 2}, {day: "2", measure: 2}, {day: "3", measure: 1}, {day: "4", measure: 3}, {day: "5", measure: 2}, {day: "6", measure: 1}, {day: "7", measure: 4}]
    },
    {
        month: 3, tilCount: 8, wilCount: 15, participationRate: 42.1,
        recent: [
            { title: "Next.js Pages Router",category : "TIL", time: "2024-03-01" },
            { title: "Dynamic Routing in Next.js",category : "TIL", time: "2024-03-14" },
            { title: "SSR vs SSG",category : "TIL", time: "2024-03-25" }
        ],
        grass: [{day: "1", measure: 3}, {day: "2", measure: 4}, {day: "3", measure: 3}, {day: "4", measure: 2}, {day: "5", measure: 5}, {day: "6", measure: 3}, {day: "7", measure: 2}]
    },
    {
        month: 4, tilCount: 9, wilCount: 16, participationRate: 45.8,
        recent: [
            { title: "CSS-in-JS vs CSS Modules",category : "TIL", time: "2024-04-02" },
            { title: "Flexbox Layout Tips",category : "TIL", time: "2024-04-12" },
            { title: "Grid System Overview",category : "TIL", time: "2024-04-28" }
        ],
        grass: [{day: "1", measure: 4}, {day: "2", measure: 2}, {day: "3", measure: 5}, {day: "4", measure: 6}, {day: "5", measure: 3}, {day: "6", measure: 4}, {day: "7", measure: 5}]
    },
    {
        month: 5, tilCount: 11, wilCount: 18, participationRate: 50.2,
        recent: [
            { title: "Performance Profiling",category : "TIL", time: "2024-05-05" },
            { title: "Memoization Techniques",category : "TIL", time: "2024-05-18" },
            { title: "Code Splitting Strategy",category : "TIL", time: "2024-05-30" }
        ],
        grass: [{day: "1", measure: 5}, {day: "2", measure: 6}, {day: "3", measure: 4}, {day: "4", measure: 7}, {day: "5", measure: 5}, {day: "6", measure: 6}, {day: "7", measure: 4}]
    },
    {
        month: 6, tilCount: 7, wilCount: 12, participationRate: 40.5,
        recent: [
            { title: "Unit Testing Basics",category : "TIL", time: "2024-06-03" },
            { title: "Jest vs Mocha",category : "TIL", time: "2024-06-15" },
            { title: "Testing React Components",category : "TIL", time: "2024-06-25" }
        ],
        grass: [{day: "1", measure: 2}, {day: "2", measure: 1}, {day: "3", measure: 3}, {day: "4", measure: 2}, {day: "5", measure: 1}, {day: "6", measure: 2}, {day: "7", measure: 1}]
    },
    {
        month: 7, tilCount: 10, wilCount: 19, participationRate: 48.9,
        recent: [
            { title: "Git Workflow Best Practices",category : "TIL", time: "2024-07-07" },
            { title: "Advanced Git Rebasing",category : "TIL", time: "2024-07-19" },
            { title: "GitHub Actions Automation",category : "TIL", time: "2024-07-28" }
        ],
        grass: [{day: "1", measure: 4}, {day: "2", measure: 5}, {day: "3", measure: 6}, {day: "4", measure: 4}, {day: "5", measure: 7}, {day: "6", measure: 5}, {day: "7", measure: 8}]
    },
    {
        month: 8, tilCount: 11, wilCount: 20, participationRate: 51.3,
        recent: [
            { title: "Web Accessibility (A11y)",category : "TIL", time: "2024-08-01" },
            { title: "Semantic HTML Matters",category : "TIL", time: "2024-08-14" },
            { title: "ARIA Roles and Labels",category : "TIL", time: "2024-08-25" }
        ],
        grass: [{day: "1", measure: 5}, {day: "2", measure: 4}, {day: "3", measure: 6}, {day: "4", measure: 8}, {day: "5", measure: 3}, {day: "6", measure: 5}, {day: "7", measure: 7}]
    },
    {
        month: 9, tilCount: 10, wilCount: 20, participationRate: 52.5,
        recent: [
            { title: "Storybook Component Dev",category : "TIL", time: "2024-09-02" },
            { title: "Atomic Design Principles",category : "TIL", time: "2024-09-12" },
            { title: "Shared Component Library",category : "TIL", time: "2024-09-22" }
        ],
        grass: [{day: "1", measure: 3}, {day: "2", measure: 5}, {day: "3", measure: 2}, {day: "4", measure: 8}, {day: "5", measure: 1}, {day: "6", measure: 4}, {day: "7", measure: 6}]
    },
    {
        month: 10, tilCount: 12, wilCount: 23, participationRate: 58.9,
        recent: [
            { title: "D3.js Data Visualization",category : "TIL", time: "2024-10-05" },
            { title: "SVG Animation Basics",category : "TIL", time: "2024-10-18" },
            { title: "Canvas API Overview",category : "TIL", time: "2024-10-30" }
        ],
        grass: [{day: "1", measure: 7}, {day: "2", measure: 6}, {day: "3", measure: 5}, {day: "4", measure: 4}, {day: "5", measure: 3}, {day: "6", measure: 2}, {day: "7", measure: 1}]
    },
    {
        month: 11, tilCount: 15, wilCount: 28, participationRate: 65.4,
        recent: [
            { title: "Node.js Architecture",category : "TIL", time: "2024-11-04" },
            { title: "Express.js Middleware",category : "TIL", time: "2024-11-15" },
            { title: "RESTful API Design",category : "TIL", time: "2024-11-26" }
        ],
        grass: [{day: "1", measure: 8}, {day: "2", measure: 9}, {day: "3", measure: 7}, {day: "4", measure: 8}, {day: "5", measure: 10}, {day: "6", measure: 8}, {day: "7", measure: 9}]
    },
    {
        month: 12, tilCount: 14, wilCount: 26, participationRate: 62.1,
        recent: [
            { title: "GraphQL vs REST",category : "WIL", time: "2024-12-02" },
            { title: "Apollo Client Setup",category : "WIL", time: "2024-12-14" },
            { title: "Query and Mutation basics",category : "WIL", time: "2024-12-28" }
        ],
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
                                {currentMonthData.recent.map((item, index) => (
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