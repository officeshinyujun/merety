import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss"
import SubTitle from "@/components/study/SubTitle";

export default function Archive() {
    return (
        <VStack 
        align="start" 
        justify="start"
        className={s.container}
        fullWidth
        fullHeight>
            <SubTitle text="Archives" />
        </VStack>
    )
}