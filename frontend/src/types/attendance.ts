import { UUID, Timestamp } from "./common";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  LATE = "LATE",
  ABSENT = "ABSENT",
  UNKNOWN = "UNKNOWN",
}

export interface Attendance {
  id: UUID;
  session_id: UUID;
  user_id: UUID;
  status: AttendanceStatus;
  memo?: string | null;
  updated_by: UUID; // user_id
  updated_at: Timestamp;
}
