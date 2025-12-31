import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import { STUDY_CARD_COLORS } from "@/constants/main/StudyCardColors";
import { HStack } from "@/components/general/HStack";
import Image from "next/image";
import Link from "next/link";

interface StudyCardProps {
  title: string;
  slug: string;
  icon: React.ReactNode;
  isAdmin?: boolean;
  people: {
    count: number;
    profileImage: string[];
  };
  color?: 'red' | 'green';
}

export default function StudyCard({ title, slug, isAdmin = false, people, color = 'red', icon }: StudyCardProps) {
    const colorStyle = STUDY_CARD_COLORS[color];
    return (
        <Link href={`/study/${slug}`} style={{ textDecoration: 'none' }}>
            <VStack 
                style={{ backgroundColor: colorStyle.background, borderColor: isAdmin ? '#fdfdfe' : colorStyle.border }} 
                className={s.container}
                align="start"
                justify="start"
                gap={10}
            >
                <HStack align="center" justify="start" gap={8} className={s.title}>
                    {icon}
                    <p>{title}</p>
                </HStack>
                <span className={s.slug}>{slug}</span>
                <HStack align="center" justify="start" gap={-15}>
                    {people.profileImage.map((image, index) => (
                        <Image key={index} src={image} alt={`Participant ${index + 1}`} width={30} height={30} className={s.profileImage} />
                    ))}
                    <HStack align="center" justify="center" className={s.participantCount}>+{people.count - people.profileImage.length}</HStack>
                </HStack>
            </VStack>
        </Link>
    )
}