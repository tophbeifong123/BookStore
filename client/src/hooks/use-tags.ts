// ===========================================
// Tags Hooks
// ===========================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagsService } from "@/services";
import { queryKeys } from "./query-keys";
import type { CreateTagInput, UpdateTagInput } from "@/types";

/**
 * Hook to fetch all tags
 */
export function useTags() {
  return useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: () => tagsService.getAll(),
  });
}

/**
 * Hook to fetch a tag by slug
 */
export function useTagBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.tags.bySlug(slug),
    queryFn: () => tagsService.getBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to fetch a tag by ID
 */
export function useTag(id: string) {
  return useQuery({
    queryKey: queryKeys.tags.detail(id),
    queryFn: () => tagsService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a tag
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTagInput) => tagsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
}

/**
 * Hook to update a tag
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagInput }) =>
      tagsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
}

/**
 * Hook to delete a tag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
  });
}
