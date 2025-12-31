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
  overview: StudyOverview;
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
  description: string;
  manager_list: UUID[];
}
