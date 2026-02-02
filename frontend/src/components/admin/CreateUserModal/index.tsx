'use client';

import { HStack } from "@/components/general/HStack"
import { VStack } from "@/components/general/VStack"
import { X, Copy, Check } from "lucide-react"
import s from "./style.module.scss"
import Input from "@/components/general/Input"
import Button from "@/components/general/Button"
import { useState } from "react"
import { adminUsersApi } from "@/api"
import { toast, Toaster } from "react-hot-toast"
import { UserRole } from "@/types/user"

interface CreateUserModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
    const [email, setEmail] = useState("");
    const [handle, setHandle] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState<UserRole>(UserRole.MEMBER);
    
    const [isLoading, setIsLoading] = useState(false);
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleCreate = async () => {
        if (!email || !handle) {
            toast.error("Email and Handle are required");
            return;
        }

        try {
            setIsLoading(true);
            const response = await adminUsersApi.createUser({
                email,
                handle,
                name: name || undefined,
                role
            });

            setTempPassword(response.temporary_password);
            toast.success("User created successfully");
            onSuccess();
        } catch (error: any) {
            console.error("Create failed", error);
            const message = error.response?.data?.message || "Failed to create user";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyPassword = () => {
        if (tempPassword) {
            navigator.clipboard.writeText(tempPassword);
            setIsCopied(true);
            toast.success("Password copied to clipboard");
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <VStack
            align="start"
            justify="start"
            gap={24}
            className={s.container}
        >
            <Toaster />
            <HStack fullWidth justify="between" align="center">
                <h2 className={s.title}>Create User</h2>
                <X size={24} onClick={onClose} style={{ cursor: 'pointer' }} className={s.closeIcon} />
            </HStack>
            
            {!tempPassword ? (
                // Input Form
                <VStack fullWidth gap={16}>
                    <VStack fullWidth align="start" gap={8}>
                        <p className={s.label}>Email *</p>
                        <Input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="user@example.com"
                        />
                    </VStack>
                    
                    <VStack fullWidth align="start" gap={8}>
                        <p className={s.label}>Handle (ID) *</p>
                        <Input 
                            value={handle} 
                            onChange={(e) => setHandle(e.target.value)} 
                            placeholder="unique_handle"
                        />
                    </VStack>

                    <VStack fullWidth align="start" gap={8}>
                        <p className={s.label}>Name</p>
                        <Input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="Display Name"
                        />
                    </VStack>

                    <VStack fullWidth align="start" gap={8}>
                        <p className={s.label}>Role</p>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value as UserRole)}
                            className={s.selectInput}
                        >
                            <option value={UserRole.MEMBER}>MEMBER</option>
                            <option value={UserRole.STUDY_MANAGER}>STUDY_MANAGER</option>
                            <option value={UserRole.SUPER_ADMIN}>SUPER_ADMIN</option>
                        </select>
                    </VStack>

                    <Button className={s.button} onClick={handleCreate} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create"}
                    </Button>
                </VStack>
            ) : (
                // Success / Temp Password View
                <VStack fullWidth gap={16} align="center">
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>User Created Successfully!</p>
                        <p style={{ fontSize: '14px', color: '#666' }}>Please share this temporary password with the user.</p>
                    </div>

                    <div className={s.tempPasswordBox}>
                        {tempPassword}
                    </div>
                    
                    <HStack gap={8} align="center" style={{ cursor: 'pointer' }} onClick={handleCopyPassword}>
                        {isCopied ? <Check size={16} color="green" /> : <Copy size={16} color="#666" />}
                        <span className={s.copyButton}>{isCopied ? "Copied!" : "Copy Password"}</span>
                    </HStack>

                    <Button className={s.button} onClick={onClose}>
                        Done
                    </Button>
                </VStack>
            )}
        </VStack>
    )
}
