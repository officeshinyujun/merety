'use client';

import { VStack } from "@/components/general/VStack";
import s from "./style.module.scss";
import Title from "@/components/study/Title";
import { HStack } from "@/components/general/HStack";
import Input from "@/components/general/Input";
import { Search } from "lucide-react";
import ChartBase from "@/components/general/Chart/ChartBase";
import ChartSection from "@/components/general/Chart/ChartSection";
import { useState, useMemo } from "react";
import PagenationBar from "@/components/general/PagenationBar";
import { useRouter } from "next/navigation";
import UserEditCard from "@/components/admin/UserEditCard";
import CreateUserModal from "@/components/admin/CreateUserModal";
import ModalContainer from "@/components/general/ModalContainer";
import Button from "@/components/general/Button"; // Check if Button exists or import appropriately
import { useItemsPerPage } from "@/hooks/useItemsPerPage";
import { adminUsersApi } from "@/api";
import { User } from "@/types/user";
import { useEffect } from "react";

export default function UserPage() {
    const router = useRouter();
    // 화면 높이에 따라 동적으로 itemsPerPage 계산
    const itemsPerPage = useItemsPerPage({
        itemHeight: 60,      // 각 행의 높이
        headerOffset: 200,   // 헤더 + 검색창 영역
        footerOffset: 80,    // 페이지네이션 바 영역
        minItems: 4,
        maxItems: 15,
    }) - 3;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await adminUsersApi.getUsers({
                page: currentPage,
                limit: itemsPerPage,
                search: searchText || undefined,
            });
            setUsers(response.data);
            setTotalItems(response.pagination.total);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, itemsPerPage]); // searchText is handled by Enter key

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setCurrentPage(1);
            fetchUsers();
        }
    };

    const handleRowClick = (user: User) => {
        // Transform User to the format UserEditCard expects if needed, or pass User directly
        // UserEditCard expects flattened props, so we'll pass the whole object wrapper or individual props
        setSelectedMember({ user, role: user.role }); 
    };

    const infoColumnData = users.map(user => ({
        text: user.name || user.handle, // Fallback to handle if name is empty
        image: user.user_image || "/default-avatar.png",
        onClick: () => handleRowClick(user),
    }));

    const statusColumnData = users.map(user => ({
        text: user.status,
        onClick: () => handleRowClick(user),
    }));

    const roleColumnData = users.map(user => ({
        text: user.role,
        onClick: () => handleRowClick(user),
    }));

    return (
        <>
            <VStack fullWidth fullHeight align='start' justify='start' className={s.container} gap={24}>
                <Title text="User Management" />
                <HStack fullWidth align="center" justify="center" gap={16}>
                    <Input
                        width="700px"
                        placeholder="유저를 검색하세요..."
                        icon={<Search size={20} color="#959595" strokeWidth={1.5} />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <Button className={s.createButton} onClick={() => setIsCreateModalOpen(true)}>
                        + Create User
                    </Button>
                </HStack>
                <VStack fullWidth fullHeight align='start' justify='start' gap={12} className="">
                    <ChartBase>
                        <ChartSection
                            title="Info"
                            width="60%"
                            children={infoColumnData}
                        />
                        <ChartSection
                            title="Status"
                            width="20%"
                            children={statusColumnData}
                        />
                        <ChartSection
                            title="Role"
                            width="20%"
                            children={roleColumnData}
                        />
                    </ChartBase>
                    <PagenationBar
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </VStack>
            </VStack>
            {selectedMember && (
                <ModalContainer>
                    <UserEditCard
                        userId={selectedMember.user.id}
                        password={""} // Password is not available in user object
                        userImage={selectedMember.user.user_image || "/default-profile.png"} // Provide default if null
                        name={selectedMember.user.name || selectedMember.user.handle}
                        email={selectedMember.user.email}
                        role={selectedMember.role}
                        status={selectedMember.user.status}
                        onClose={() => {
                            setSelectedMember(null);
                            fetchUsers(); // Refresh list on close (after save)
                        }}
                    />
                </ModalContainer>
            )}
            {isCreateModalOpen && (
                <ModalContainer>
                    <CreateUserModal
                        onClose={() => setIsCreateModalOpen(false)}
                        onSuccess={() => {
                            // Keep modal open to show password? Or close?
                            // CreateUserModal handles success state internally to show password. 
                            // It calls onClose when USER clicks Done.
                            // However, we might want to refresh the list *immediately* upon creation, 
                            // even if the user is looking at the password.
                            // But CreateUserModal calls onSuccess when creation happens. 
                            // Let's refresh list here.
                            fetchUsers();
                        }}
                    />
                </ModalContainer>
            )}
        </>
    )
}