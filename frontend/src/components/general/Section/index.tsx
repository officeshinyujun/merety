import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import { HStack } from "../HStack";

interface SectionProps {
    title : string;
    children: React.ReactNode;
    viewMoreHref?: string;
    className?: string;
    action?: React.ReactNode;
}

export default function Section({ title, children, viewMoreHref, className, action }: SectionProps) {
  return (
    <VStack className={`${s.container} ${className || ''}`} gap={12} align="start" justify="start">
        <HStack align="center" justify="between" fullWidth className={s.header}>
            <HStack align="center" justify="start" gap={12}>
                <h2>{title}</h2>  
                {viewMoreHref && <a href={viewMoreHref}>자세히 보러가기</a>}  
            </HStack>
            {action}
        </HStack>
        {children}
    </VStack>
  );
}