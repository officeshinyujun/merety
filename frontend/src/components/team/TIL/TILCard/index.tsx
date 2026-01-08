import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss"
import { HStack } from "@/components/general/HStack";
import Image from "next/image";
interface TILCardProps {
    title : string;
    user : {
        name : string;
        image : string;
    };
    date : string;
}

export default function TILCard({title, user, date}: TILCardProps){
    return (
       <HStack align="center" justify="between" fullWidth className={s.container}>
            <VStack align="start" justify="start" gap={12} className={s.contents}>
                <h2>{title}</h2>
                <HStack align="center" justify="start" gap={8} className={s.user}>
                    <Image src={user.image} width={20} height={20} alt={user.name}/>
                    <p>{user.name}</p>
                </HStack>
            </VStack>
            <span>{date}</span>
       </HStack>
    )
}