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

export default function PasswordChangePage() {
    const router = useRouter();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChangePassword = async () => {
        // 유효성 검사
        if (!newPassword || !confirmPassword) {
            setError('새 비밀번호를 입력해주세요.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (newPassword.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await authApi.changePassword({
                current_password: currentPassword || undefined,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            
            // 성공 시 대시보드로 이동
            alert('비밀번호가 변경되었습니다.');
            router.push('/');
        } catch (err: unknown) {
            console.error('Password change error:', err);
            
            if (err && typeof err === 'object' && 'response' in err) {
                const axiosError = err as { response?: { status?: number; data?: { message?: string } } };
                if (axiosError.response?.status === 401) {
                    setError('현재 비밀번호가 올바르지 않습니다.');
                } else {
                    setError(axiosError.response?.data?.message || '비밀번호 변경에 실패했습니다.');
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
            handleChangePassword();
        }
    };

    return (
        <VStack className={s.container} align='center' justify='center' gap={32}>
            <Hero title='비밀번호를 재설정해주세요.'/>
            <VStack className={s.contents} align='center' justify='center' gap={20} >
                <VStack gap={16} align='center' justify='center' style={{width : "100%"}}>
                    <InputSection 
                        text="현재 비밀번호" 
                        placeholder="현재 비밀번호를 입력하세요 (첫 로그인 시 생략 가능)" 
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <InputSection 
                        text="새 비밀번호" 
                        placeholder="새 비밀번호를 입력하세요 (8자 이상)" 
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <InputSection 
                        text="새 비밀번호 확인" 
                        placeholder="새 비밀번호를 다시 입력하세요" 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
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
                        onClick={handleChangePassword}
                        disabled={isLoading}
                    >
                        {isLoading ? '변경 중...' : '비밀번호 변경'}
                    </Button>
                </VStack>
            </VStack>
        </VStack>
    )
}