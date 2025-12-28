import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import Hero from '@/components/login-signup/Hero';
import InputSection from '@/components/login-signup/InputSection';
import Divider from '@/components/general/Divider';
import Button from '@/components/general/Button';

export default function LoginPage() {
    return (
        <VStack className={s.container} align='center' justify='center' gap={32}>
            <Hero title='회원가입'/>
            <VStack className={s.contents} align='center' justify='center' gap={20} >
                <VStack gap={16} align='center' justify='center' style={{width : "100%"}}>
                    <InputSection text="이름" placeholder="이름을 입력하세요" />
                    <InputSection text="이메일" placeholder="이메일을 입력하세요" type="email" />
                    <InputSection text="비밀번호" placeholder="비밀번호를 입력하세요" type="password" />
                    <InputSection text="비밀번호 확인" placeholder="비밀번호를 다시 입력하세요" type="password" />
                </VStack>
                <Divider />
                <VStack className={s.submit} align='center' justify='center' gap={12}>
                    <Button className={s.signupButton}>
                        회원가입
                    </Button>
                    <p>이미 계정이 있으신가요? <a href="/login">로그인</a></p>
                </VStack>
            </VStack>
        </VStack>
    )
}