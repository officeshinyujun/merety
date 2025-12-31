import { UUID, Timestamp } from "./common";

export enum ActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  // 필요 시 확장
}

export enum EntityType {
  USER = "USER",
  STUDY = "STUDY",
  SESSION = "SESSION",
  TIL_POST = "TIL_POST",
  ARCHIVE = "ARCHIVE",
  NOTICE = "NOTICE",
  ATTENDANCE = "ATTENDANCE",
}

export interface ActivityLog {
  id: UUID;
  user_id: UUID;
  action_type: ActionType;
  entity_type: EntityType;
  entity_id: UUID;
  meta: Record<string, unknown>;
  created_at: Timestamp;
}
