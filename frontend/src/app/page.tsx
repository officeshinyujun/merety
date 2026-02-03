'use client';

import { HStack } from "@/components/general/HStack";
import s from "./page.module.scss";
import Sidebar from "@/components/general/Sidebar";
import { VStack } from "@/components/general/VStack";
import Section from "@/components/general/Section";
import StudyCard from "@/components/main/StudyCard";
import { ShieldAlert, BookOpen, Clock, Activity, Loader2 } from "lucide-react";
import TILCard from "@/components/main/TILCard";
import RecentCard from "@/components/main/RecentCard";
import Calendar from "@/components/main/Calendar";
import { useEffect, useState } from "react";
import { dashboardApi, DashboardData } from "@/api/dashboard";
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dashboardApi.getDashboard();
        setData(res);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const getActionLabel = (action: string, entity: string) => {
    const entityMap: Record<string, string> = {
      'TIL_POST': 'TIL',
      'STUDY': 'study',
      'SESSION': 'session',
      'USER': 'profile',
      'NOTICE': 'notice',
    };
    const actionMap: Record<string, string> = {
      'CREATE': 'Created',
      'UPDATE': 'Updated',
      'DELETE': 'Deleted',
      'LOGIN': 'Logged in',
    };
    return `${actionMap[action] || action} ${entityMap[entity] || entity}`;
  };

  if (loading) {
    return (
      <HStack className={s.container} align="center" justify="center">
        <Loader2 className="animate-spin" size={48} color="#fdfdfe" />
      </HStack>
    );
  }

  if (!data) {
    return (
        <HStack className={s.container}>
            <Sidebar />
            <VStack className={s.contents} align="center" justify="center" fullWidth gap={16}>
                <h1>Error loading dashboard data.</h1>
            </VStack>
        </HStack>
    );
  }

  return (
    <HStack className={s.container}>
      <Sidebar />
      <VStack className={s.contents} align="start" justify="start" gap={16}>
        <h1>Welcome to 404Bnf Team Page</h1>
        
        <Section title="Study">
          <HStack align="start" justify="start" gap={12} fullWidth wrap="wrap">
            {data.my_studies.length > 0 ? data.my_studies.map((study) => (
              <StudyCard 
                key={study.id} 
                id={study.id}
                title={study.name} 
                slug={study.type} 
                icon={<ShieldAlert size={20} color="#fdfdfe" strokeWidth={1.5} />}
                people={{
                    count: study.member_count,
                    profileImage: study.member_images || []
                }} 
                color={study.is_manager ? 'green' : 'red'}
              />
            )) : (
                <p>No studies joined yet.</p>
            )}
          </HStack>
        </Section>

        <HStack className={s.middleSection} align="start" justify="start" gap={16} fullWidth>
          <Section title="TIL" className={s.tilSection}>
            <HStack align="center" justify="center" fullWidth gap={12} className={s.tilStats}>
              <p>전체 작성</p>
              <h3>{data.til_stats.total_count}개</h3>
              <p>이번 달 작성</p>
              <h3>{data.til_stats.monthly_count}개</h3>
            </HStack>
            <HStack align="center" justify="between" gap={12} fullWidth className={s.recentTilsHeader}>
              <p>최근 작성</p>
              <Link href="/team/til" className={s.link}>바로가기 →</Link>
            </HStack>      
            <VStack gap={8} fullWidth>
                {data.recent_tils.map((til) => (
                    <Link key={til.id} href={`/team/til/${til.id}`} style={{textDecoration: 'none', width: '100%'}}>
                        <TILCard title={til.title} />
                    </Link>
                ))}
                {data.recent_tils.length === 0 && <p>No recent TILs.</p>}
            </VStack>
          </Section>

          <Section title="최근 활동" className={s.recentSection}>
            <VStack gap={8} fullWidth>
                {data.recent_activities.map((activity) => (
                    <RecentCard 
                    key={activity.id} 
                    title={getActionLabel(activity.action_type, activity.entity_type)} 
                    time={formatTime(activity.created_at)} 
                    />
                ))}
                {data.recent_activities.length === 0 && <p>No recent activities.</p>}
            </VStack>
          </Section>  
        </HStack>

        <Section title="일정" className={s.calendar}>
          <Calendar events={data.calendar_events.map(e => ({
              title: e.title,
              date: e.date,
          }))} />
        </Section>
      </VStack>
    </HStack>
  );
}
