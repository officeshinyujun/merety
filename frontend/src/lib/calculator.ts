export const calculateIncreaseRate = (current: number, previous: number) => {
    const value = parseFloat((current - previous).toFixed(1));
    return {
        value: Math.abs(value),
        isIncreased: value >= 0
    };
};
