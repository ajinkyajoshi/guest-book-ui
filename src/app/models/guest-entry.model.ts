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

export interface Comment {
  id?: number;
  entryId: number;
  authorName: string;
  content: string;
  createdAt?: string;
}

export interface UserProfile {
  id?: number;
  username: string;
  email: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  totalEntries?: number;
  totalLikesReceived?: number;
  active?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface GuestBookStats {
  totalEntries: number;
  todayEntries: number;
  totalLikes: number;
}

export interface AnalyticsDashboard {
  totalPageViews: number;
  todayPageViews: number;
  uniqueVisitorsToday: number;
  totalEntriesCreated: number;
  totalLikes: number;
}

export interface NotificationStats {
  total: number;
  sent: number;
  pending: number;
  failed: number;
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
