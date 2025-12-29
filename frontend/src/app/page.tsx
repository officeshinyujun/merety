import { HStack } from "@/components/general/HStack";
import s from "./page.module.scss";
import Sidebar from "@/components/general/Sidebar";

export default function Home() {
  return (
    <HStack className={s.container}>
      <Sidebar />
    </HStack>
  );
}
