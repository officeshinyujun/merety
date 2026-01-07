'use client';
import { HStack } from "../HStack"
import s from "./style.module.scss" 
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationBarProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export default function PagenationBar({ totalItems, itemsPerPage, currentPage, onPageChange }: PaginationBarProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <p 
                    key={i} 
                    className={i === currentPage ? s.active : s.inactive}
                    onClick={() => handlePageChange(i)}
                    style={{ cursor: 'pointer' }}
                >
                    {i}
                </p>
            );
        }
        return pages;
    };

    if (totalPages <= 0) return null;

    return (
        <HStack 
        align="center"
        justify="center" 
        fullWidth 
        className={s.container} 
        gap={16}
        >
            <ChevronLeft 
                size={24} 
                color={currentPage === 1 ? "#474747" : "#fdfdfe"} 
                strokeWidth={2} 
                onClick={() => handlePageChange(currentPage - 1)}
                style={{ cursor: currentPage === 1 ? 'default' : 'pointer' }}
            />
            <HStack 
            align="center"
            justify="center"
            gap={12}
            className={s.contents}
            >
                {renderPageNumbers()}
            </HStack>
            <ChevronRight 
                size={24} 
                color={currentPage === totalPages ? "#474747" : "#fdfdfe"} 
                strokeWidth={2}
                onClick={() => handlePageChange(currentPage + 1)}
                style={{ cursor: currentPage === totalPages ? 'default' : 'pointer' }}
            />
        </HStack>
    )
}