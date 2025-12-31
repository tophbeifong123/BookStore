// ===========================================
// Chapters Hooks
// ===========================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chaptersService } from "@/services";
import { queryKeys } from "./query-keys";
import type { CreateChapterInput, AddPagesInput } from "@/types";

/**
 * Hook to fetch all chapters for a book
 */
export function useChapters(bookId: string) {
  return useQuery({
    queryKey: queryKeys.chapters.all(bookId),
    queryFn: () => chaptersService.getAll(bookId),
    enabled: !!bookId,
  });
}

/**
 * Hook to fetch a chapter with pages (for reading)
 */
export function useChapter(bookId: string, chapterNumber: number) {
  return useQuery({
    queryKey: queryKeys.chapters.detail(bookId, chapterNumber),
    queryFn: () => chaptersService.getByNumber(bookId, chapterNumber),
    enabled: !!bookId && chapterNumber > 0,
  });
}

/**
 * Hook to create a chapter
 */
export function useCreateChapter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, data }: { bookId: string; data: CreateChapterInput }) =>
      chaptersService.create(bookId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chapters.all(variables.bookId) });
    },
  });
}

/**
 * Hook to add pages to a chapter
 */
export function useAddChapterPages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookId,
      chapterId,
      data,
    }: {
      bookId: string;
      chapterId: string;
      data: AddPagesInput;
    }) => chaptersService.addPages(bookId, chapterId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chapters.all(variables.bookId) });
    },
  });
}

/**
 * Hook to increment chapter view count
 */
export function useIncrementChapterView() {
  return useMutation({
    mutationFn: ({ bookId, id }: { bookId: string; id: string }) =>
      chaptersService.incrementView(bookId, id),
  });
}
