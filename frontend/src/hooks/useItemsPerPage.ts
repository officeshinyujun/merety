'use client';

import { useState, useEffect } from 'react';

interface UseItemsPerPageOptions {
    itemHeight?: number;      // 각 아이템의 높이 (px)
    headerOffset?: number;    // 헤더, 검색창 등 상단 영역 높이 (px)
    footerOffset?: number;    // 페이지네이션 바 등 하단 영역 높이 (px)
    minItems?: number;        // 최소 아이템 개수
    maxItems?: number;        // 최대 아이템 개수
}

const DEFAULT_OPTIONS: UseItemsPerPageOptions = {
    itemHeight: 69,
    headerOffset: 200,
    footerOffset: 80,
    minItems: 4,
    maxItems: 20,
};

/**
 * 화면 높이에 따라 페이지당 표시할 아이템 개수를 동적으로 계산하는 훅
 * @param options - 계산에 사용할 옵션값들
 * @returns 페이지당 아이템 개수
 */
export function useItemsPerPage(options: UseItemsPerPageOptions = {}): number {
    const {
        itemHeight = DEFAULT_OPTIONS.itemHeight!,
        headerOffset = DEFAULT_OPTIONS.headerOffset!,
        footerOffset = DEFAULT_OPTIONS.footerOffset!,
        minItems = DEFAULT_OPTIONS.minItems!,
        maxItems = DEFAULT_OPTIONS.maxItems!,
    } = options;

    const [itemsPerPage, setItemsPerPage] = useState<number>(minItems);

    useEffect(() => {
        const calculateItemsPerPage = () => {
            const windowHeight = window.innerHeight;
            const availableHeight = windowHeight - headerOffset - footerOffset;
            const calculatedItems = Math.floor(availableHeight / itemHeight);

            // 최소/최대 범위 내로 조정
            const clampedItems = Math.max(minItems, Math.min(maxItems, calculatedItems));
            setItemsPerPage(clampedItems);
        };

        // 초기 계산
        calculateItemsPerPage();

        // 윈도우 리사이즈 이벤트 리스너 등록
        window.addEventListener('resize', calculateItemsPerPage);

        // 클린업
        return () => {
            window.removeEventListener('resize', calculateItemsPerPage);
        };
    }, [itemHeight, headerOffset, footerOffset, minItems, maxItems]);

    return itemsPerPage;
}

export default useItemsPerPage;
