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
    onClick?: () => void;
}

export default function TILCard({title, user, date, onClick}: TILCardProps){
    return (
       <HStack align="center" justify="between" fullWidth className={s.container} onClick={onClick}>
            <VStack align="start" justify="start" gap={12} className={s.contents}>
                <h2>{title}</h2>
                <HStack align="center" justify="start" gap={8} className={s.user}>
                    <Image 
                        src={user.image || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhNJEXqIaNHfAlHrN588FXk4quCwsg0mz19g&s"} 
                        width={20} 
                        height={20} 
                        alt={user.name}
                    />
                    <p>{user.name}</p>
                </HStack>
            </VStack>
            <span>{date}</span>
       </HStack>
    )
}