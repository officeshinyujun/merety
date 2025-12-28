import { VStack } from "@/components/general/VStack";
import s from './style.module.scss';
import Input from "@/components/general/Input";

interface InputSectionProps {
  text: string;
  placeholder: string;
  type?: string;
}

export default function InputSection({ text, placeholder, type = "text" }: InputSectionProps) {
  return (
    <VStack className={s.container} align="start" justify="start" gap={8}>
        <p>{text}</p>
        <Input placeholder={placeholder} type={type} className={s.input} />
    </VStack>
  );
}