'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { VStack } from '@/components/general/VStack';

const PUBLIC_PATHS = ['/signin', '/signup'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('access_token');
            const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

            if (!token && !isPublicPath) {
                router.replace('/signin');
            } else if (token && pathname === '/signin') {
                router.replace('/');
            } else {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    // 공개 경로는 로딩 없이 바로 렌더링 (깜빡임 방지)
    if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center" style={{ minHeight: '100vh' }}>
                <Loader2 size={32} className="animate-spin" />
            </VStack>
        );
    }

    return <>{children}</>;
}
