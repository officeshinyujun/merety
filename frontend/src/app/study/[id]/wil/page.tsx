import { VStack } from "@/components/general/VStack"
import s from "./style.module.scss"
import Title from "@/components/study/Title"
import SubTitle from "@/components/study/SubTitle"
import { HStack } from "@/components/general/HStack"
import Input from "@/components/general/Input"
import { Search } from "lucide-react"
import DateCard from "@/components/study/WIL/DateCard"

export default function WilPage() {
    return (
        <VStack 
        align='start'
        justify='start' 
        fullWidth
        fullHeight 
        gap={16} 
        style={{padding : "48px 128px"}} 
        className={s.container}
        >
            <SubTitle text="WIL" />
            <VStack 
            fullWidth
            align='start' 
            justify='start' 
            gap={12}
            className={s.contents}
            >
                <HStack fullWidth align="center" justify="center">
                    <Input 
                    width="700px"
                    height="40px"
                    placeholder="WIL을 검색하세요" 
                    icon={<Search size={18} color="#959595" />}
                    />
                </HStack>
                <HStack fullWidth align='center' justify='start' gap={12} className={s.dateSelect}>
                    <DateCard date="2024-01-01"/>
                    <p>to</p>
                    <DateCard date="2024-01-01"/>
                </HStack>
                <HStack fullWidth align='center' justify='start' gap={12}>
                    {/* WIL 리스트 */}
                </HStack>
                {/* 페이지네이션 */}
            </VStack>
        </VStack>
    )
}