// ===========================================
// Upload Service
// ===========================================

import apiClient from "./api-client";
import type { UploadedFile, UploadPagesResponse } from "@/types";

export const uploadService = {
  /**
   * Upload book cover image
   */
  async uploadCover(file: File): Promise<UploadedFile> {
    const formData = new FormData();
    formData.append("cover", file);
    return apiClient.upload<UploadedFile>("/uploads/cover", formData);
  },

  /**
   * Upload chapter pages (multiple files)
   */
  async uploadChapterPages(chapterId: string, files: File[]): Promise<UploadPagesResponse> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("pages", file);
    });
    return apiClient.upload<UploadPagesResponse>(`/uploads/chapters/${chapterId}/pages`, formData);
  },
};

export default uploadService;
