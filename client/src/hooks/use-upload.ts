// ===========================================
// Upload Hooks
// ===========================================

import { useMutation } from "@tanstack/react-query";
import { uploadService } from "@/services";

/**
 * Hook to upload book cover
 */
export function useUploadCover() {
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadCover(file),
  });
}

/**
 * Hook to upload chapter pages
 */
export function useUploadChapterPages() {
  return useMutation({
    mutationFn: ({ chapterId, files }: { chapterId: string; files: File[] }) =>
      uploadService.uploadChapterPages(chapterId, files),
  });
}
