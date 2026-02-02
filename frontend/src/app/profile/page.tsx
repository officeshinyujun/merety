'use client';

import { VStack } from "@/components/general/VStack";
import { HStack } from "@/components/general/HStack";
import s from "./style.module.scss";
import { useState, useEffect } from "react";
import { authApi } from "@/api";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { user } = await authApi.getMe();
                setUser(user);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                router.push("/signin");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [router]);

    const handleLogout = async () => {
        if (!confirm("로그아웃 하시겠습니까?")) return;
        
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Forcefully clear and redirect
            localStorage.removeItem("access_token");
            window.location.href = "/signin";
        }
    };

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
                <Loader2 size={32} className="animate-spin" color="#fff" />
            </VStack>
        );
    }

    if (!user) return null;

    return (
        <VStack fullWidth fullHeight align="center" justify="center" className={s.container}>
            <VStack className={s.card} align="center" gap={0}>
                
                <img 
                    src={user.user_image || "/default-profile.png"} 
                    alt="Profile" 
                    className={s.profileImage}
                />
                
                <h1 className={s.name}>{user.name || "No Name"}</h1>
                <p className={s.handle}>@{user.handle}</p>

                <VStack fullWidth align="start" gap={8} style={{ marginTop: '24px' }}>
                    <HStack justify="between" align="center" className={s.infoRow}>
                        <span className={s.label}>Email</span>
                        <span className={s.value}>{user.email}</span>
                    </HStack>
                    
                    <HStack justify="between" align="center" className={s.infoRow}>
                        <span className={s.label}>Role</span>
                        <span className={s.value}>{user.role}</span>
                    </HStack>

                    <HStack justify="between" align="center" className={s.infoRow}>
                        <span className={s.label}>Status</span>
                        <span className={s.value} style={{ textTransform: 'capitalize' }}>
                            {user.status}
                        </span>
                    </HStack>
                </VStack>

                <button className={s.logoutButton} onClick={handleLogout}>
                    Logout
                </button>
            </VStack>
        </VStack>
    );
}
