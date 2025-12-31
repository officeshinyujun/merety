import { HStack } from '@/components/general/HStack';
import React from 'react';
import s from './layout.module.scss';
import Sidebar from '@/components/general/Sidebar';

export default function StudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HStack className={s.container} align='start' justify='start'>
        <Sidebar/>
        {children}
    </HStack>
  );
}