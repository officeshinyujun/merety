import { UUID, Timestamp } from "./common";

export interface TilPost {
  id: UUID;
  category: 'TIL' | 'WIL';
  study_id: UUID;
  author_id: UUID;
  author_name: string;
  author_image: string;
  title: string;
  content_md: string;
  tags: string[];
  created_at: Timestamp;
  updated_at: Timestamp;
  is_deleted: boolean;
}
