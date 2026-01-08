import { VStack } from "@/components/general/VStack"
import s from "./style.module.scss"
import Title from "@/components/study/Title"
import dummyTeamData from "@/data/dummyTeamData.json"
import Divider from "@/components/general/Divider"
import { HStack } from "@/components/general/HStack"

export default function RolesPage() {
    const roles = dummyTeamData.roles;
    return (
        <VStack align="start" justify="start" gap={16} fullWidth fullHeight className={s.container}>
            <Title text="Roles"/>
            <Divider/>
            <VStack fullWidth align="start" justify="start" gap={12} >
                {roles.map((role, index) => (
                    <VStack fullWidth align="start" justify="start" gap={8} className={s.roleItem} key={index}>
                        <h2>{role.role}</h2>
                        <p>{role.description}</p>
                    </VStack>
                ))}
            </VStack>
        </VStack>
    )
}