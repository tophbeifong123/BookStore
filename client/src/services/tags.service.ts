// ===========================================
// Tags Service
// ===========================================

import apiClient from "./api-client";
import type { Tag, CreateTagInput, UpdateTagInput } from "@/types";

export const tagsService = {
  /**
   * Get all tags
   */
  async getAll(): Promise<Tag[]> {
    return apiClient.get<Tag[]>("/tags");
  },

  /**
   * Get tag by slug with books
   */
  async getBySlug(slug: string): Promise<Tag> {
    return apiClient.get<Tag>(`/tags/slug/${slug}`);
  },

  /**
   * Get tag by ID
   */
  async getById(id: string): Promise<Tag> {
    return apiClient.get<Tag>(`/tags/${id}`);
  },

  /**
   * Create a new tag (Admin only)
   */
  async create(data: CreateTagInput): Promise<Tag> {
    return apiClient.post<Tag>("/tags", data);
  },

  /**
   * Update a tag (Admin only)
   */
  async update(id: string, data: UpdateTagInput): Promise<Tag> {
    return apiClient.patch<Tag>(`/tags/${id}`, data);
  },

  /**
   * Delete a tag (Admin only)
   */
  async delete(id: string): Promise<{ deleted: boolean; id: string }> {
    return apiClient.delete<{ deleted: boolean; id: string }>(`/tags/${id}`);
  },
};

export default tagsService;
