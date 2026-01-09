'use client';

import { HStack } from "@/components/general/HStack"
import { VStack } from "@/components/general/VStack"
import { X } from "lucide-react"
import s from "./style.module.scss"
import Image from "next/image"
import Input from "@/components/general/Input"
import Button from "@/components/general/Button"
import { useState } from "react"

interface UserEditCardProps {
    userImage: string;
    name: string;
    email : string;
    role: string;
    status: string;
    password: string;
    onClose: () => void;
}

export default function UserEditCard({ userImage, name, email, password, role, status, onClose }: UserEditCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editRole, setEditRole] = useState(role);
    const [editStatus, setEditStatus] = useState(status);
    const [tempPassword, setTempPassword] = useState("");

    const handleEditClick = () => {
        if (isEditing) {
            // Save logic would go here
            console.log("Saving:", { editRole, editStatus, tempPassword });
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
    };

    return (
        <VStack
            align="start"
            justify="start"
            gap={24}
            className={s.container}
        >
            <HStack fullWidth justify="between" align="center">
                <h2 className={s.title}>Edit User</h2>
                <X size={24} onClick={onClose} style={{ cursor: 'pointer' }} className={s.closeIcon} />
            </HStack>
            
            <VStack fullWidth align="center" gap={12}>
                <Image src={userImage} alt={name} width={80} height={80} style={{ borderRadius: '50%' }} />
                <h3 className={s.name}>{name}</h3>
            </VStack>

            <VStack fullWidth gap={16} className={s.scrollableContent}>
                <VStack fullWidth align="start" gap={8}>
                    <p className={s.label}>Email</p>
                    <Input value={email} readOnly />
                </VStack>
                
                <VStack fullWidth align="start" gap={8}>
                    <p className={s.label}>Password</p>
                    <Input value={password} readOnly type="password" />
                    {isEditing && (
                        <VStack fullWidth align="start" gap={8} style={{ marginTop: '8px' }}>
                            <p className={s.label} style={{ fontSize: '12px' }}>Temporary Password</p>
                            <Input 
                                value={tempPassword} 
                                onChange={(e) => setTempPassword(e.target.value)} 
                                placeholder="Enter temporary password" 
                            />
                            <Button className={s.smallButton} onClick={() => console.log("Issue temp password")}>
                                Issue
                            </Button>
                        </VStack>
                    )}
                </VStack>

                <HStack fullWidth gap={16}>
                     <VStack fullWidth align="start" gap={8}>
                        <p className={s.label}>Role</p>
                        {isEditing ? (
                            <select 
                                value={editRole} 
                                onChange={(e) => setEditRole(e.target.value)}
                                className={s.selectInput}
                            >
                                <option value="MEMBER">MEMBER</option>
                                <option value="STUDY_MANAGER">STUDY_MANAGER</option>
                            </select>
                        ) : (
                            <Input value={role} readOnly />
                        )}
                    </VStack>
                    <VStack fullWidth align="start" gap={8}>
                        <p className={s.label}>Status</p>
                         {isEditing ? (
                            <select 
                                value={editStatus} 
                                onChange={(e) => setEditStatus(e.target.value)}
                                className={s.selectInput}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Archived</option>
                            </select>
                        ) : (
                            <Input value={status} readOnly />
                        )}
                    </VStack>
                </HStack>
            </VStack>

            <Button className={s.button} onClick={handleEditClick}>
                {isEditing ? "Save" : "Edit"}
            </Button>
        </VStack>
    )
}