import { VStack } from '@/components/general/VStack';
import s from './style.module.scss';
import Image from 'next/image';
import Logo from "../../../../public/404Bnf_Logo.png"

interface HeroProps {
  title: string;
}

export default function Hero({ title }: HeroProps) {
    return (
        <VStack gap={22} align='center' justify='center'>
            <Image src={Logo} alt="Logo" width={108} />
            <h1 className={s.title}>{title}</h1>
        </VStack>
    );
}