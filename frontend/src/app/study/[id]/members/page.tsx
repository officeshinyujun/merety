import s from "./style.module.scss";
import { VStack } from "@/components/general/VStack";
import SubTitle from '@/components/study/SubTitle';

export default function Members() {
    return (
        <VStack align='start' justify='start' fullWidth fullHeight gap={16} className={s.container} >
            <SubTitle text="Members" />
        </VStack>
    )
}