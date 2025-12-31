import { UUID, Timestamp } from "./common";

export interface Session {
  id: UUID;
  study_id: UUID;
  session_no: number;
  title: string;
  scheduled_at: Timestamp;
  content_md: string;
  created_by: UUID; // user_id
  created_at: Timestamp;
  updated_at: Timestamp;
  data?: Record<string, unknown>;
  
}
