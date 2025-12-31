// ===========================================
// Books Hooks
// ===========================================

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { booksService } from "@/services";
import { queryKeys } from "./query-keys";
import type { PaginationQuery, CreateBookInput, UpdateBookInput } from "@/types";

/**
 * Hook to fetch paginated books
 */
export function useBooks(query?: PaginationQuery) {
  return useQuery({
    queryKey: queryKeys.books.list(query),
    queryFn: () => booksService.getAll(query),
  });
}

/**
 * Hook to fetch featured books
 */
export function useFeaturedBooks(limit = 5) {
  return useQuery({
    queryKey: queryKeys.books.featured(limit),
    queryFn: () => booksService.getFeatured(limit),
  });
}

/**
 * Hook to fetch a single book by slug
 */
export function useBookBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.books.bySlug(slug),
    queryFn: () => booksService.getBySlug(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to fetch a single book by ID
 */
export function useBook(id: string) {
  return useQuery({
    queryKey: queryKeys.books.detail(id),
    queryFn: () => booksService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a book
 */
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookInput) => booksService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
}

/**
 * Hook to update a book
 */
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookInput }) =>
      booksService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(variables.id) });
    },
  });
}

/**
 * Hook to delete a book
 */
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => booksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
}

/**
 * Hook to increment view count
 */
export function useIncrementBookView() {
  return useMutation({
    mutationFn: (id: string) => booksService.incrementView(id),
  });
}
