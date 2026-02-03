import { UUID, Timestamp } from "./common";
import { Archive } from "./archive";

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
  data?: {
    materials?: string[];
  };
  round: number;
  createUser?: {
    name: string;
    userImage: string;
  };
  archives?: Archive[];
}
