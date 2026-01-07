'use client'
import { HStack } from "@/components/general/HStack";
import s from "./style.module.scss"
import { Calendar } from "lucide-react";
import { useRef, useState } from "react";

interface DateCardProps {
    date : string;
    onDateChange?: (newDate: string) => void;
}

export default function DateCard({date, onDateChange} : DateCardProps) {
    const [currentDate, setCurrentDate] = useState(date);
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
        dateInputRef.current?.showPicker();
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setCurrentDate(newDate);
        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    return (
        <HStack className={s.container} align="center" justify="start" gap={8} onClick={handleContainerClick} style={{cursor: 'pointer', position: 'relative'}}>
            <Calendar size={20} color="#959595" strokeWidth={2}/>
            <p>{currentDate}</p>
            <input 
                type="date" 
                ref={dateInputRef}
                value={currentDate}
                onChange={handleDateChange}
                style={{
                    position: 'absolute',
                    opacity: 0,
                    pointerEvents: 'none',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                }}
            />
        </HStack>
    )
}