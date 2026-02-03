import { UUID, Timestamp } from "./common";
import { User } from "./user";

export interface Notice {
  id: UUID;
  title: string;
  content_md: string;
  created_by: UUID;
  creator: User;
  created_at: Timestamp;
  updated_at: Timestamp;
  is_deleted: boolean;
}
