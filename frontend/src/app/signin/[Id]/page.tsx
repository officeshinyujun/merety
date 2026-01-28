import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import Hero from '@/components/login-signup/Hero';
import InputSection from '@/components/login-signup/InputSection';
import Divider from '@/components/general/Divider';
import Button from '@/components/general/Button';

export default function PasswordChangePage() {
    return (
        <VStack className={s.container} align='center' justify='center' gap={32}>
            <Hero title='비밀번호를 재생성해주세요.'/>
            <VStack className={s.contents} align='center' justify='center' gap={20} >
                <VStack gap={16} align='center' justify='center' style={{width : "100%"}}>
                    <InputSection text="현재 비밀번호" placeholder="현재 비밀번호를 입력하세요" type="password" />
                    <InputSection text="새 비밀번호" placeholder="새 비밀번호를 입력하세요" type="password" />
                    <InputSection text="새 비밀번호 확인" placeholder="새 비밀번호를 다시 입력하세요" type="password" />
                </VStack>
                <Divider />
                <VStack className={s.submit} align='center' justify='center' gap={12}>
                    <Button className={s.signupButton}>
                        비밀번호 재생성
                    </Button>
                </VStack>
            </VStack>
        </VStack>
    )
}