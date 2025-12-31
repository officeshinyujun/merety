import { UUID, Timestamp } from "./common";

export interface Notice {
  id: UUID;
  title: string;
  content_md: string;
  created_by: UUID;
  created_at: Timestamp;
  updated_at: Timestamp;
  is_deleted: boolean;
}
