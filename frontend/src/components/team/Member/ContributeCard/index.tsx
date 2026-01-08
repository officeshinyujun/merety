import { VStack } from "@/components/general/VStack"
import s from "./style.module.scss"

interface ContributeCardProps{
    title : string;
    count : number;
    increaseRate : number
    isIncreased : boolean
}

export default function ContributeCard({title, count, increaseRate, isIncreased} : ContributeCardProps){
    const unit = title === "Participation Rate" ? "%" : "개";
    
    return(
        <VStack align="start" justify="start" gap={12} fullWidth className={s.container}>
            <p>{title}</p>
            <h2>{count}{title === "Participation Rate" ? "%" : "개"}</h2>
            <span style={{color: isIncreased ? "#89DA7F" : "#DA7F7F"}}>전 달 대비 {increaseRate}{unit} {isIncreased ? "증가" : "감소"}</span>
        </VStack>
    )
}