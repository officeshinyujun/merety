'use client'

import { VStack } from '../VStack';
import s from './style.module.scss';
import { ShieldAlert, CodeXml, Bell, User as UserIcon, ChartPie, Cog, Pencil, UserCog, Book } from 'lucide-react';
import SidebarSection from './Section';
import { HStack } from '../HStack';
import Image from 'next/image';
import LogoImage from '../../../../public/404Bnf_Logo.png'
import {useRouter} from 'next/navigation'
import { useState, useEffect } from 'react';
import {usePathname} from 'next/navigation'
import { studiesApi } from '@/api/studies';
import { Study, StudyType } from '@/types/study';


import { authApi } from '@/api/auth';
import { User } from '@/types/user';

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname(); 
    const [iconColor, setIconColor] = useState("#959595");  
    const [studies, setStudies] = useState<Study[]>([]);
    const [userInfo, setUserInfo] = useState<User | null>(null);
    
    useEffect(() => {
        const fetchStudies = async () => {
             try {
                const response = await studiesApi.getStudies();
                setStudies(response.data);
            } catch (error) {
                console.error("Failed to fetch studies:", error);
            }
        };

        const fetchUser = async () => {
            try {
                const { user } = await authApi.getMe();
                setUserInfo(user);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };

        fetchStudies();
        fetchUser();
    }, []);

    const sidebarSections = [
    {
        title: 'Study',
        contents: studies.map(study => ({
            icon: study.type === StudyType.RED 
                ? <ShieldAlert size={16} color={pathname === `/study/${study.id}` ? '#fdfdfe' : iconColor} strokeWidth={2} />
                : <CodeXml size={16} color={pathname === `/study/${study.id}` ? '#fdfdfe' : iconColor} strokeWidth={2} />,
            label: study.name,
            href: `/study/${study.id}`
        }))
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
                icon: <UserIcon size={16} color={pathname === '/team/members' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
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
                icon: <UserCog size={16} color={pathname === '/admin/user' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
                label: 'User Management',
                href : '/admin/user'
            },
            {
                icon: <Book size={16} color={pathname === '/admin/study' ? '#fdfdfe' : iconColor} strokeWidth={2} />,
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
                    <Image 
                        src={userInfo?.user_image || '/default-avatar.png'} 
                        alt="profile" 
                        width={40} 
                        height={40} 
                        className={s.profileAvatar}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <VStack gap={4} align='start' justify='center' className={s.profileInfo}>
                        <p>{userInfo?.name || userInfo?.handle || 'User'}</p>
                        <span>{userInfo?.role || 'Member'}</span>
                    </VStack>
                </HStack>
                <Cog size={24} color="#959595" strokeWidth={1.5} />
            </HStack>
        </VStack>
    )
}