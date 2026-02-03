
interface Props {
    width?: number;
    height?: number;
    onClick?: () => void;
    className?: string; // Optional
    children?: React.ReactNode;
    leftIcon ?: string;
    rightIcon ?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}

export default function Button({ width, height, onClick, className, children, leftIcon, rightIcon, disabled, style }: Props) {
    return (
        <button 
            className={className} 
            onClick={onClick} 
            disabled={disabled}
            style={{
                width, 
                height, 
                outline: 'none', 
                border: "none", 
                background: "none",
                borderRadius: 8,
                cursor: disabled ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                opacity: disabled ? 0.6 : 1,
                ...style
            }}
        >
            {leftIcon && <img width={24} height={24} src={leftIcon} alt="leftIcon" />}
            {children}
            {rightIcon && <img width={24} height={24} src={rightIcon} alt="rightIcon" />}
        </button>
    );
}