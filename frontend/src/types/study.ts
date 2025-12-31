import { UUID, Timestamp } from "./common";

export enum StudyType {
  RED = "RED",
  WEB = "WEB",
}

export enum StudyStatus {
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export interface Study {
  id: UUID;
  name: string;
  type: StudyType;
  slug: string;
  status: StudyStatus;
  created_by: UUID; // user_id
  created_at: Timestamp;
  updated_at: Timestamp;
}

export enum StudyMemberRole {
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
}

export interface StudyMembership {
  id: UUID;
  study_id: UUID;
  user_id: UUID;
  member_role: StudyMemberRole;
  joined_at: Timestamp;
}

export interface StudyOverview {
  study_id: UUID;
  content_md: string;
  updated_by: UUID; // user_id
  updated_at: Timestamp;
}
