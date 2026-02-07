'use client';

import { VStack } from "@/components/general/VStack"
import s from "./style.module.scss"
import Title from "@/components/study/Title"
import Divider from "@/components/general/Divider"
import { HStack } from "@/components/general/HStack"
import { useState, useEffect } from "react"
import { roleDescriptionsApi } from "@/api"
import { authApi } from "@/api"
import { UserRole } from "@/types/user"
import { Edit2, Save, X, Loader2 } from "lucide-react"
import Button from "@/components/general/Button"
import Input from "@/components/general/Input"
import { toast } from "react-hot-toast"

interface RoleData {
    role: UserRole;
    description: string;
}

const DEFAULT_ROLES: RoleData[] = [
    {
        role: UserRole.SUPER_ADMIN,
        description: "Total control over the system and all teams."
    },
    {
        role: UserRole.STUDY_MANAGER,
        description: "Manages the study group, schedules sessions, and posts notices."
    },
    {
        role: UserRole.MEMBER,
        description: "Participates in sessions and writes TILs."
    }
];

export default function RolesPage() {
    const [roles, setRoles] = useState<RoleData[]>(DEFAULT_ROLES);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [editingRole, setEditingRole] = useState<UserRole | null>(null);
    const [editDescription, setEditDescription] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user info to check role
                const { user } = await authApi.getMe();
                if (user && user.role === UserRole.SUPER_ADMIN) {
                    setIsSuperAdmin(true);
                }

                // Fetch role descriptions
                const descriptions = await roleDescriptionsApi.getRoleDescriptions();

                // Merge with default roles
                const mergedRoles = DEFAULT_ROLES.map(defaultRole => {
                    const apiDesc = descriptions.find(d => d.role === defaultRole.role);
                    return apiDesc ? { ...defaultRole, description: apiDesc.description } : defaultRole;
                });

                setRoles(mergedRoles);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                toast.error("Failed to load role descriptions.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (role: RoleData) => {
        setEditingRole(role.role);
        setEditDescription(role.description);
    };

    const handleCancel = () => {
        setEditingRole(null);
        setEditDescription("");
    };

    const handleSave = async (role: UserRole) => {
        if (!editDescription.trim()) {
            toast.error("Description cannot be empty.");
            return;
        }

        setIsSaving(true);
        try {
            await roleDescriptionsApi.updateRoleDescription(role, editDescription);

            // Update local state
            setRoles(prev => prev.map(r =>
                r.role === role ? { ...r, description: editDescription } : r
            ));

            toast.success("Description updated!");
            setEditingRole(null);
        } catch (error) {
            console.error("Failed to update description:", error);
            toast.error("Failed to update description.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <VStack fullWidth fullHeight align="center" justify="center">
                <Loader2 size={32} className="animate-spin" />
            </VStack>
        )
    }

    return (
        <VStack align="start" justify="start" gap={16} fullWidth fullHeight className={s.container}>
            <Title text="Roles" />
            <Divider />
            <VStack fullWidth align="start" justify="start" gap={24} >
                {roles.map((role, index) => (
                    <VStack fullWidth align="start" justify="start" gap={8} className={s.roleItem} key={index}>
                        <HStack fullWidth align="center" justify="between">
                            <h2>{role.role}</h2>
                            {isSuperAdmin && !editingRole && (
                                <Button
                                    className={s.editButton}
                                    onClick={() => handleEditClick(role)}
                                    icon={<Edit2 size={14} />}
                                >
                                    Edit
                                </Button>
                            )}
                        </HStack>

                        {editingRole === role.role ? (
                            <VStack fullWidth gap={8} align="start">
                                <textarea
                                    className={s.textarea}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    rows={3}
                                />
                                <HStack gap={8}>
                                    <Button
                                        className={s.saveButton}
                                        onClick={() => handleSave(role.role)}
                                        disabled={isSaving}
                                        icon={<Save size={14} />}
                                    >
                                        {isSaving ? "Saving..." : "Save"}
                                    </Button>
                                    <Button
                                        className={s.cancelButton}
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        icon={<X size={14} />}
                                    >
                                        Cancel
                                    </Button>
                                </HStack>
                            </VStack>
                        ) : (
                            <p className={s.description}>{role.description}</p>
                        )}
                    </VStack>
                ))}
            </VStack>
        </VStack>
    )
}