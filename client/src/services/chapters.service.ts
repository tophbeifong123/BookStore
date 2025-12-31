// ===========================================
// Chapters Service
// ===========================================

import apiClient from "./api-client";
import type { Chapter, CreateChapterInput, AddPagesInput } from "@/types";

export const chaptersService = {
  /**
   * Get all chapters for a book
   */
  async getAll(bookId: string): Promise<Chapter[]> {
    return apiClient.get<Chapter[]>(`/books/${bookId}/chapters`);
  },

  /**
   * Get chapter by number (with pages for reading)
   */
  async getByNumber(bookId: string, chapterNumber: number): Promise<Chapter> {
    return apiClient.get<Chapter>(`/books/${bookId}/chapters/${chapterNumber}`);
  },

  /**
   * Create a new chapter
   */
  async create(bookId: string, data: CreateChapterInput): Promise<Chapter> {
    return apiClient.post<Chapter>(`/books/${bookId}/chapters`, data);
  },

  /**
   * Update a chapter
   */
  async update(bookId: string, id: string, data: Partial<CreateChapterInput>): Promise<Chapter> {
    return apiClient.patch<Chapter>(`/books/${bookId}/chapters/${id}`, data);
  },

  /**
   * Delete a chapter
   */
  async delete(bookId: string, id: string): Promise<{ deleted: boolean; id: string }> {
    return apiClient.delete<{ deleted: boolean; id: string }>(`/books/${bookId}/chapters/${id}`);
  },

  /**
   * Add pages to a chapter
   */
  async addPages(bookId: string, chapterId: string, data: AddPagesInput): Promise<Chapter> {
    return apiClient.post<Chapter>(`/books/${bookId}/chapters/${chapterId}/pages`, data);
  },

  /**
   * Remove a page
   */
  async removePage(bookId: string, pageId: string): Promise<{ deleted: boolean; id: string }> {
    return apiClient.delete<{ deleted: boolean; id: string }>(
      `/books/${bookId}/chapters/pages/${pageId}`
    );
  },

  /**
   * Increment view count
   */
  async incrementView(bookId: string, id: string): Promise<Chapter> {
    return apiClient.post<Chapter>(`/books/${bookId}/chapters/${id}/view`);
  },

  /**
   * Publish a chapter
   */
  async publish(bookId: string, id: string): Promise<Chapter> {
    return apiClient.post<Chapter>(`/books/${bookId}/chapters/${id}/publish`);
  },
};

export default chaptersService;
