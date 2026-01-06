'use client'

import { HStack } from '../../HStack';
import { VStack } from '../../VStack';
import s from './style.module.scss';
import { useRouter } from 'next/navigation';

interface SidebarSectionItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

interface SidebarSectionProps {
    title: string;
    contents: SidebarSectionItem[];
}

export default function SidebarSection({ title, contents }: SidebarSectionProps) {
    const router = useRouter();
    return (
        <VStack gap={8} align='start' justify='start' className={s.container} >
            <h1>{title}</h1>
            {contents.map((item, index) => (
                <HStack fullWidth align='center' justify='start' key={index} className={s.card} gap={8} onClick={() => router.push(item.href)}>
                    {item.icon}
                    <p>{item.label}</p>
                </HStack>
            ))}
        </VStack>
    )
}