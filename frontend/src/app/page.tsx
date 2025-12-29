import { HStack } from "@/components/general/HStack";
import s from "./page.module.scss";
import Sidebar from "@/components/general/Sidebar";
import { VStack } from "@/components/general/VStack";
import Section from "@/components/general/Section";
import GlobeImage from "../../public/globe.svg"
import StudyCard from "@/components/main/StudyCard";
import { ShieldAlert, CodeXml } from "lucide-react";

const dummyData = {
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

export default function Home() {
  return (
    <HStack className={s.container}>
      <Sidebar />
      <VStack className={s.contents} align="start" justify="start" gap={16}>
        <h1>Welcome to 404Bnf Team Page</h1>
        <Section title="Study">
          <HStack align="start" justify="start" gap={12}>
            {dummyData.studies.map((study) => (
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
      </VStack>
    </HStack>
  );
}
