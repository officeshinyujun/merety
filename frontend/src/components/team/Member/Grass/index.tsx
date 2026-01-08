import s from './style.module.scss';

interface GrassProps {
    data: { day: string; measure: number }[];
}

export default function Grass({ data }: GrassProps) {
    // Ensure we have exactly 32 cells (8x4)
    // Map existing data, fill the rest with 0
    const cells = Array.from({ length: 32 }, (_, i) => {
        const item = data[i];
        return item ? item.measure : 0;
    });

    return (
        <div className={s.container}>
            {cells.map((measure, index) => {
                const scaleClass = measure > 0 ? s[`scale-${Math.min(measure, 10)}`] : '';
                return (
                    <div 
                        key={index} 
                        className={`${s.cell} ${scaleClass}`} 
                        title={`Day ${index + 1}: Level ${measure}`}
                    />
                );
            })}
        </div>
    );
}
