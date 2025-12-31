import { UUID, Timestamp } from "./common";

export enum ArchiveType {
  FILE = "FILE",
  LINK = "LINK",
}

export enum ArchiveCategory {
  SLIDE = "SLIDE",
  DOC = "DOC",
  CODE = "CODE",
  LINK = "LINK",
  ETC = "ETC",
}

export interface Archive {
  id: UUID;
  study_id: UUID;
  uploader_id: UUID;
  type: ArchiveType;
  title: string;
  url?: string;          // LINK
  storage_key?: string;  // FILE
  category: ArchiveCategory;
  created_at: Timestamp;
  is_deleted: boolean;
}
