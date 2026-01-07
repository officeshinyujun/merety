import s from "./style.module.scss";
import { HStack } from "../../HStack";

interface ChartBaseProps {
    children: React.ReactNode;
}
export default function ChartBase({ children }: ChartBaseProps) {
    return (
        <HStack fullWidth fullHeight className={s.container} align="start" justify="start" >
            {children}
        </HStack>
    )
}