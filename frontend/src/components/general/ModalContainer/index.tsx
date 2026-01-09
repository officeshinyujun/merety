import { HStack } from "../HStack"
import s from "./style.module.scss"

interface ModalContainerProps {
    children: React.ReactNode;
}

export default function ModalContainer({ children }: ModalContainerProps) {
    return (
        <HStack
         align="center"
         justify="center"
         fullWidth
         fullHeight
         className={s.container}
        >
            {children}
        </HStack>
    )
}