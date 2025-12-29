import { HStack } from '../../HStack';
import { VStack } from '../../VStack';
import s from './style.module.scss';

interface SidebarSectionItem {
    icon: React.ReactNode;
    label: string;
}

interface SidebarSectionProps {
    title: string;
    contents: SidebarSectionItem[];
}

export default function SidebarSection({ title, contents }: SidebarSectionProps) {
    return (
        <VStack gap={8} align='start' justify='start' className={s.container}>
            <h1>{title}</h1>
            {contents.map((item, index) => (
                <HStack align='center' justify='start' key={index} className={s.card} gap={8}>
                    {item.icon}
                    <p>{item.label}</p>
                </HStack>
            ))}
        </VStack>
    )
}