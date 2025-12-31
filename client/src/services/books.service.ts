// ===========================================
// Books Service
// ===========================================

import apiClient from "./api-client";
import type {
  Book,
  CreateBookInput,
  UpdateBookInput,
  PaginatedResponse,
  PaginationQuery,
} from "@/types";

export const booksService = {
  /**
   * Get all books with pagination
   */
  async getAll(query?: PaginationQuery): Promise<PaginatedResponse<Book>> {
    return apiClient.get<PaginatedResponse<Book>>("/books", query);
  },

  /**
   * Get featured books
   */
  async getFeatured(limit = 5): Promise<Book[]> {
    return apiClient.get<Book[]>("/books/featured", { limit });
  },

  /**
   * Get book by slug
   */
  async getBySlug(slug: string): Promise<Book> {
    return apiClient.get<Book>(`/books/slug/${slug}`);
  },

  /**
   * Get book by ID
   */
  async getById(id: string): Promise<Book> {
    return apiClient.get<Book>(`/books/${id}`);
  },

  /**
   * Create a new book
   */
  async create(data: CreateBookInput): Promise<Book> {
    return apiClient.post<Book>("/books", data);
  },

  /**
   * Update a book
   */
  async update(id: string, data: UpdateBookInput): Promise<Book> {
    return apiClient.patch<Book>(`/books/${id}`, data);
  },

  /**
   * Delete a book
   */
  async delete(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiClient.delete<{ deleted: boolean; id: string }>(`/books/${id}`);
  },

  /**
   * Increment view count
   */
  async incrementView(id: string): Promise<Book> {
    return apiClient.post<Book>(`/books/${id}/view`);
  },
};

export default booksService;
