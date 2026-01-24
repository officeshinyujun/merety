'use client'

import { VStack } from '../VStack';
import s from './style.module.scss';
import { ShieldAlert, CodeXml, Bell, User, ChartPie, Cog, Pencil, UserCog, Book } from 'lucide-react';
import SidebarSection from './Section';
import { HStack } from '../HStack';
import Image from 'next/image';
import LogoImage from '../../../../public/404Bnf_Logo.png'
import {useRouter} from 'next/navigation'
import { useState } from 'react';
import {usePathname} from 'next/navigation'


const userInfo = {
    name : "석주",
    role : "Admin"
}

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname(); 
    const [iconColor, setIconColor] = useState("#959595");  
    
    const sidebarSections = [
    {
        title: 'Study',
        contents: [
            {
                icon: <ShieldAlert size={16} color={pathname === '/study/study-1' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
                label: 'Red team study',
                href : '/study/study-1'
            },
            {
                icon: <CodeXml size={16} color={pathname === '/study/study-2' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
                label: 'Web study',
                href : '/study/study-2'
            }
        ]
    },
    {
        title: 'Team',
        contents: [
            {
                icon: <Bell size={16} color={pathname === '/team/notice' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
                label: 'Notice',
                href : '/team/notice'
            },
            {
                icon: <User size={16} color={pathname === '/team/members' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
                label: 'Members',
                href : '/team/members'
            },
            
            {
                icon: <ChartPie size={16} color={pathname === '/team/roles' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
                label: 'Roles',
                href : '/team/roles'
            },
            
            {
                icon: <Pencil size={16} color={pathname === '/team/til' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
                label: 'TIL',
                href : '/team/til'
            },
        ]
    },
    {
        title: 'Admin',
        contents: [
            {
                icon: <UserCog size={16} color={pathname === '/user-management' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
                label: 'User Management',
                href : '/admin/user'
            },
            
            {
                icon: <Book size={16} color={pathname === '/study-management' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
                label: 'Study Management',
                href : '/admin/study'
            }
        ]
    }
]

    return (
        <VStack className={s.container} align='start' justify='between'>
            <VStack className={s.contents} gap={14} align='start' justify='start' fullWidth>
                <Image src={LogoImage} alt="logo" width={71} onClick={() => router.push('/')} />
                {sidebarSections.map((section, index) => (
                    //@ts-ignore
                    <SidebarSection key={index} title={section.title} contents={section.contents}/>
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