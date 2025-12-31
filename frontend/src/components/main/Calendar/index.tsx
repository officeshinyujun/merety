'use client'

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import s from './style.module.scss';

interface CalendarEvent {
    title: string;
    date: string;
    color?: string;
}

interface CalendarProps {
    events: CalendarEvent[];
}

export default function Calendar ({ events }: CalendarProps){
    return (
        <div className={s.container}>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                dayCellClassNames={s.day}
                events={events}
            />
        </div>
    );
}