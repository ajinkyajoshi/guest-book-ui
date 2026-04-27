export interface GuestEntry {
  id?: number;
  name: string;
  email?: string;
  message: string;
  mood?: string;
  likes?: number;
  pinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GuestBookStats {
  totalEntries: number;
  todayEntries: number;
  totalLikes: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  last: boolean;
  first: boolean;
}
