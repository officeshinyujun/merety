'use client';

import React from 'react';

// 페이지나 컴포넌트가 클라이언트에 마운트된 후에만 렌더링되도록 하는 훅
// Hydration Error 방지용
export function useMounted() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return mounted;
}
