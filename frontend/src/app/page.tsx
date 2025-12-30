import { HStack } from "@/components/general/HStack";
import s from "./page.module.scss";
import Sidebar from "@/components/general/Sidebar";
import { VStack } from "@/components/general/VStack";
import Section from "@/components/general/Section";
import GlobeImage from "../../public/globe.svg"
import StudyCard from "@/components/main/StudyCard";
import { ShieldAlert, CodeXml } from "lucide-react";
import TILCard from "@/components/main/TILCard";

const StudyDummyData = {
  studies: [
    {
      id: 1, 
      title: "Sample Study", 
      slug: "sample-study", 
      people: { count: 5, profileImage: [GlobeImage, GlobeImage] },
      color :"red",
      icon : <ShieldAlert size={20} color="#fdfdfe" strokeWidth={1.5} />
    },
    { 
      id: 2, 
      title: "Another Study", 
      slug: "another-study", 
      people: { count: 3, profileImage: [GlobeImage, GlobeImage, GlobeImage, GlobeImage] } ,
      color :"green",
      icon :<CodeXml size={20} color="#fdfdfe" strokeWidth={1.5} />
    },
  ]
};

const TILDummyData = {
  tilAll : 243,
  tilMonth : 12,
  tils:[
    {
      id: 1,
      title: "Sample TIL",
      content: "This is a sample TIL entry.",
      date: "2023-10-01"
    },
    {
      id: 2,
      title: "Another TIL",
      content: "This is another sample TIL entry.",
      date: "2023-10-02"
    },
    {
      id: 3,
      title: "Third TIL",
      content: "This is a third sample TIL entry.",
      date: "2023-10-03"
    }
  ]
};

const RecentDummyData = {
  activities: [
    {
      id: 1,
      title: "Completed TIL entry",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Joined study group",
      time: "1 day ago"
    }
  ]
};

export default function Home() {
  return (
    <HStack className={s.container}>
      <Sidebar />
      <VStack className={s.contents} align="start" justify="start" gap={16}>
        <h1>Welcome to 404Bnf Team Page</h1>
        <Section title="Study">
          <HStack align="start" justify="start" gap={12}>
            {StudyDummyData.studies.map((study) => (
              <StudyCard 
                key={study.id} 
                title={study.title} 
                slug={study.slug} 
                icon={study.icon} 
                people={study.people} 
                color={study.color as 'red' | 'green'}
              />
            ))}
          </HStack>
        </Section>
        <HStack className={s.middleSection} align="start" justify="start" gap={16}>
          <Section title="TIL" className={s.tilSection}>
            <HStack align="center" justify="center" fullWidth gap={12} className={s.tilStats}>
              <p>전체 작성</p>
              <h3>{TILDummyData.tilAll}개</h3>
              <p>이번 달 작성</p>
              <h3>{TILDummyData.tilMonth}개</h3>
            </HStack>
            <HStack align="center" justify="start" gap={12} fullWidth className={s.recentTils}>
              <p>최근 작성</p>
              <span>바로가기 →</span>
            </HStack>      
              {TILDummyData.tils.map((til) => (
                <TILCard key={til.id} title={til.title} />
              ))}
          </Section>
          <Section title="최근 활동" className={s.recentSection}>
            <p>Activity content will go here</p>
          </Section>
        </HStack>
      </VStack>
    </HStack>
  );
}
