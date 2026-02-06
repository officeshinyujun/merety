'use client';

import { HStack } from "@/components/general/HStack"
import { VStack } from "@/components/general/VStack"
import { X } from "lucide-react"
import s from "./style.module.scss"
import Image from "next/image"
import Input from "@/components/general/Input"
import Button from "@/components/general/Button"
import { useRef, useState } from "react"
import { Camera } from "lucide-react"
import { authApi } from "@/api"
import { adminUsersApi } from "@/api"
import { toast, Toaster } from "react-hot-toast"

interface UserEditCardProps {
    userId: string;
    userImage: string;
    name: string;
    email: string;
    role: string;
    status: string;
    password: string;
    onClose: () => void;
}

export default function UserEditCard({ userId, userImage, name, email, password, role, status, onClose }: UserEditCardProps) {
    const [willDelete, setWillDelete] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editRole, setEditRole] = useState(role);
    const [editStatus, setEditStatus] = useState(status);
    const [tempPassword, setTempPassword] = useState("");
    const [currentImage, setCurrentImage] = useState(userImage);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const result = await authApi.uploadProfile(file);
            setCurrentImage(result.url);
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload image");
        }
    };

    const handleIssueTempPassword = async () => {
        try {
            const data = await adminUsersApi.resetPassword(userId);
            setTempPassword(data.temporary_password);
            toast.success("Temporary password issued");
        } catch (error) {
            console.error("Failed to issue temp password", error);
            toast.error("Failed to issue temporary password");
        }
    };

    const handleEditClick = async () => {
        if (isEditing) {
            try {
                if (willDelete) {
                    await adminUsersApi.deleteUser(userId);
                    toast.success("User deleted successfully");
                } else {
                    await adminUsersApi.updateUser(userId, {
                        role: editRole as any,
                        status: editStatus as any,
                        userImage: currentImage,
                    });
                    toast.success("User updated successfully");
                }

                setIsEditing(false);
                onClose();
            } catch (error) {
                console.error("Operation failed", error);
                toast.error("Failed to update/delete user");
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleDelete = async () => {
        if (!willDelete) {
            if (confirm("This will PERMANENTLY delete the user. Are you sure?")) {
                setWillDelete(true);
                toast("User marked for deletion. Click Save to confirm.", { icon: "⚠️" });
            }
        } else {
            setWillDelete(false);
            toast.success("Deletion cancelled.");
        }
    }

    return (
        <VStack
            align="start"
            justify="start"
            gap={24}
            className={`${s.container} ${willDelete ? s.markedForDeletion : ''}`}
        >
            <Toaster />
            <HStack fullWidth justify="between" align="center">
                <h2 className={s.title}>Edit User</h2>
                <X size={24} onClick={onClose} style={{ cursor: 'pointer' }} className={s.closeIcon} />
            </HStack>

            <VStack fullWidth align="center" gap={12}>
                <div
                    className={s.imageContainer}
                    onClick={handleImageClick}
                    style={{ cursor: isEditing ? 'pointer' : 'default', position: 'relative' }}
                >
                    <Image
                        src={currentImage}
                        alt={name}
                        width={80}
                        height={80}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                    {isEditing && (
                        <div className={s.imageOverlay}>
                            <Camera size={24} color="white" />
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
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
                            <Button className={s.smallButton} onClick={handleIssueTempPassword}>
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

            <HStack fullWidth justify="end" gap={12}>
                <Button className={s.button} onClick={handleEditClick}>
                    {isEditing ? "Save" : "Edit"}
                </Button>
                {isEditing && (
                    <Button
                        className={willDelete ? s.cancelDeleteButton : s.deleteButton}
                        onClick={handleDelete}
                    >
                        {willDelete ? "Cancel Delete" : "Delete"}
                    </Button>
                )}
            </HStack>
        </VStack>
    )
}