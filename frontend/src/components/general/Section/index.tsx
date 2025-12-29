import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import { HStack } from "../HStack";

interface SectionProps {
    title : string;
    children: React.ReactNode;
    viewMoreHref?: string;
}

export default function Section({ title, children, viewMoreHref }: SectionProps) {
  return (
    <VStack className={s.container} gap={12} align="start" justify="start">
        <HStack align="center" justify="start" gap={12} className={s.header}>
            <h2>{title}</h2>  
            {viewMoreHref && <a href={viewMoreHref}>더 보러가기</a>}  
        </HStack>
        {children}
    </VStack>
  );
}