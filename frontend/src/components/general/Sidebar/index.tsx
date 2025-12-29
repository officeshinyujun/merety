import { VStack } from '../VStack';
import s from './style.module.scss';
import { ShieldAlert, CodeXml, Bell, User, ChartPie, Cog, Pencil, UserCog, Book } from 'lucide-react';
import SidebarSection from './Section';
import { HStack } from '../HStack';

const sidebarSections = [
    {
        title: 'Study',
        contents: [
            {
                icon: <ShieldAlert size={16} color="#959595" strokeWidth={1.5} />,
                label: 'Red team study',
            },
            {
                icon: <CodeXml size={16} color="#959595" strokeWidth={1.5} />,
                label: 'Web study',
            }
        ]
    },
    {
        title: 'Team',
        contents: [
            {
                icon: <Bell size={16} color="#959595" strokeWidth={1.5} />,
                label: 'Notice',
            },
            {
                icon: <User size={16} color="#959595" strokeWidth={1.5} />,
                label: 'Members',
            },
            
            {
                icon: <ChartPie size={16} color="#959595" strokeWidth={1.5} />,
                label: 'Roles',
            },
            
            {
                icon: <Cog size={16} color="#959595" strokeWidth={1.5} />,
                label: 'Contribution',
            },
            
            {
                icon: <Pencil size={16} color="#959595" strokeWidth={1.5} />,
                label: 'TIL',
            },
        ]
    },
    {
        title: 'Admin',
        contents: [
            {
                icon: <UserCog size={16} color="#959595" strokeWidth={1.5} />,
                label: 'User Management',
            },
            
            {
                icon: <Book size={16} color="#959595" strokeWidth={1.5} />,
                label: 'Study Management',
            },
            {
                icon: <Cog size={16} color="#959595" strokeWidth={1.5} />,
                label: 'Metrics',
            }
        ]
    }
]

const userInfo = {
    name : "석주",
    role : "Admin"
}

export default function Sidebar() {
    return (
        <VStack className={s.container} align='start' justify='between'>
            <VStack className={s.contents} gap={14} align='start' justify='start'>
                {sidebarSections.map((section, index) => (
                    <SidebarSection key={index} title={section.title} contents={section.contents} />
                ))}
            </VStack>
            <HStack align='center' justify='between' className={s.profileCard}>
                <HStack gap={8} align='center' justify='center'>
                    <div className={s.profileAvatar} />
                    <VStack gap={4} align='start' justify='center' className={s.profileInfo}>
                        <p>{userInfo.name}</p>
                        <span>{userInfo.role}</span>
                    </VStack>
                </HStack>
                <Cog size={24} color="#959595" strokeWidth={1.5} />
            </HStack>
        </VStack>
    )
}