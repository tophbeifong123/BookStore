// ===========================================
// Book Store - TypeScript Types
// ===========================================

// ============ Auth Types ============

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type UserRole = "user" | "admin";

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, "isActive" | "createdAt" | "lastLoginAt">;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

// ============ Book Types ============

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description?: string;
  coverImage?: string;
  type: BookType;
  status: BookStatus;
  rating: number;
  totalChapters: number;
  latestChapter: number;
  viewCount: number;
  isFeatured: boolean;
  approvalStatus: ApprovalStatus;
  createdBy?: string;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export type BookType = "manga" | "novel" | "manhwa" | "manhua" | "comic";
export type BookStatus = "draft" | "published" | "archived";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface CreateBookInput {
  title: string;
  slug: string;
  author: string;
  description?: string;
  coverImage?: string;
  type: BookType;
  status?: BookStatus;
  tagIds?: string[];
}

export interface UpdateBookInput extends Partial<CreateBookInput> {}

// ============ Tag Types ============

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  bookCount?: number;
  createdAt: string;
}

export interface CreateTagInput {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {}

// ============ Chapter Types ============

export interface Chapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  title?: string;
  pageCount: number;
  viewCount: number;
  isPublished: boolean;
  publishedAt?: string;
  pages?: ChapterPage[];
  createdAt: string;
}

export interface ChapterPage {
  id: string;
  chapterId: string;
  pageNumber: number;
  imageUrl: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

export interface CreateChapterInput {
  chapterNumber: number;
  title?: string;
  isPublished?: boolean;
}

export interface AddPagesInput {
  pages: {
    pageNumber: number;
    imageUrl: string;
    width?: number;
    height?: number;
    fileSize?: number;
  }[];
}

// ============ Pagination Types ============

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

// ============ Upload Types ============

export interface UploadedFile {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  url: string;
}

export interface UploadPagesResponse {
  chapterId: string;
  totalPages: number;
  pages: (UploadedFile & { pageNumber: number })[];
}

// ============ API Error Types ============

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
