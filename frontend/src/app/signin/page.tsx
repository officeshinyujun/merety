'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import Hero from '@/components/login-signup/Hero';
import InputSection from '@/components/login-signup/InputSection';
import Divider from '@/components/general/Divider';
import Button from '@/components/general/Button';
import { authApi } from '@/api';

export default function SignInPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        // 유효성 검사
        if (!email || !password) {
            setError('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authApi.login({ email, password });
            
            // 첫 로그인이면 비밀번호 변경 페이지로 이동
            if (response.must_change_password) {
                router.push(`/signin/${response.user.id}`);
            } else {
                // 대시보드로 이동
                router.push('/');
            }
        } catch (err: unknown) {
            console.error('Login error:', err);
            
            // 에러 메시지 처리
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
                if (axiosError.response?.status === 401) {
                    setError('이메일 또는 비밀번호가 올바르지 않습니다.');
                } else if (axiosError.response?.status === 403) {
                    setError('비활성화된 계정입니다. 관리자에게 문의하세요.');
                } else {
                    setError(axiosError.response?.data?.message || '로그인에 실패했습니다.');
                }
            } else {
                setError('서버에 연결할 수 없습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <VStack className={s.container} align='center' justify='center' gap={32}>
            <Hero title='로그인'/>
            <VStack className={s.contents} align='center' justify='center' gap={20} >
                <VStack gap={16} align='center' justify='center' style={{width : "100%"}}>
                    <InputSection 
                        text="이메일" 
                        placeholder="이메일을 입력하세요" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <InputSection 
                        text="비밀번호" 
                        placeholder="비밀번호를 입력하세요" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </VStack>
                
                {error && (
                    <p className={s.error}>{error}</p>
                )}
                
                <Divider />
                <VStack className={s.submit} align='center' justify='center' gap={12}>
                    <Button 
                        className={s.signupButton} 
                        onClick={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? '로그인 중...' : '로그인'}
                    </Button>
                </VStack>
            </VStack>
        </VStack>
    )
}