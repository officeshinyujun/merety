'use client'

import { useState } from 'react'
import s from './style.module.scss'

interface CheckBoxProps {
    checked?: boolean
    disabled?: boolean
    onChange?: (checked: boolean) => void
    className?: string
}

export default function CheckBox({ checked = false, disabled = false, onChange, className }: CheckBoxProps) {
    const [isChecked, setIsChecked] = useState(checked)

    const handleChange = () => {
        if (disabled) return
        
        const newCheckedState = !isChecked
        setIsChecked(newCheckedState)
        
        if (onChange) {
            onChange(newCheckedState)
        }
    }

    return (
        <input 
            className={`${s.checkbox} ${className || ''}`}
            type="checkbox" 
            checked={isChecked} 
            disabled={disabled}
            onChange={handleChange}
        />
    )
}