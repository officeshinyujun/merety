import { VStack } from "../../VStack";
import s from "./style.module.scss";
import Divider from "../../Divider";
import { HStack } from "../../HStack";
import Image from "next/image";

interface ChartChildrenType {
    title?: string;
    text ?: string;
    image? : string;
    icon? : React.ReactNode[];
    
}

interface ChartSectionProps {
    width? : string;
    height? : string;
    title : string;
    children : ChartChildrenType[]
    
}
export default function ChartSection({ title, children, width, height }: ChartSectionProps) {
    return (
        <VStack 
        style={width?.endsWith('px') ? { minWidth: width, height } : { width, height }}
        className={s.container} align="start" justify="start" >
            <p>{title}</p>
            <VStack align="start" justify="start" gap={4} fullWidth fullHeight style={{overflowY: 'auto'}}>
                {
                    children.map((child, index) => (
                        <VStack key={index} align="start" justify="start" fullWidth gap={4} > 
                            <HStack className={s.card} fullWidth align="center" justify="start" gap={12} style={{height:"64px"}}>
                                {child.image && <Image width={40} height={40} src={child.image} alt={child.text || child.title || ""} style={{borderRadius: "100%"}} />}
                                {child.icon && child.icon.map((icon) => (
                                    icon
                                ))}
                                {child.title && <h3>{child.title}</h3>}
                                {child.text && <p>{child.text}</p>}
                            </HStack>
                            <Divider/>
                        </VStack>
                    ))
                }
            </VStack>
        </VStack>
    )
}