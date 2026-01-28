import { UUID, Timestamp } from "./common";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  STUDY_MANAGER = "STUDY_MANAGER",
  MEMBER = "MEMBER",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export interface User {
  id: UUID;
  email: string;
  password_hash: string;
  user_image: string | null;
  name?: string | null;
  handle: string;
  role: UserRole;
  status: UserStatus;
  must_change_password: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
  last_login_at?: Timestamp | null;
}

export interface Member {
  user: User;
  joined_at: Timestamp;
  role: UserRole;
}



