import { HStack } from "@/components/general/HStack"
import s from "./style.module.scss"
import { File, Link, Code, PanelRight, Ellipsis } from "lucide-react"
interface MainCArchivesCardProps {
    type : 'DOC' | 'LINK' | 'CODE' | 'SLIDE' | 'ETC';
    title : string;
}

export default function MainCArchivesCard({ type, title }: MainCArchivesCardProps) {
    return (
        <HStack className={s.container} align="center" justify="center" gap={12}>
            {type === 'DOC' && <File size={32} strokeWidth={1.5} color="#fdfdfe" />}
            {type === 'LINK' && <Link size={32} strokeWidth={1.5} color="#fdfdfe" />}
            {type === 'CODE' && <Code size={32} strokeWidth={1.5} color="#fdfdfe" />}
            {type === 'SLIDE' && <PanelRight size={32} strokeWidth={1.5} color="#fdfdfe" />}
            {type === 'ETC' && <Ellipsis size={32} strokeWidth={1.5} color="#fdfdfe" />}
            <p>{title}</p>
        </HStack>
    )
}