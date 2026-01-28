import { VStack } from "@/components/general/VStack";
import s from './style.module.scss';
import Input from "@/components/general/Input";

interface InputSectionProps {
  text: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function InputSection({ text, placeholder, type = "text", value, onChange, onKeyDown }: InputSectionProps) {
  return (
    <VStack className={s.container} align="start" justify="start" gap={8}>
        <p>{text}</p>
        <Input placeholder={placeholder} type={type} className={s.input} value={value} onChange={onChange} onKeyDown={onKeyDown} />
    </VStack>
  );
}