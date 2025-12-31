// ===========================================
// React Query Keys
// ===========================================

export const queryKeys = {
  // Auth
  auth: {
    profile: ["auth", "profile"] as const,
  },

  // Books
  books: {
    all: ["books"] as const,
    list: (params?: Record<string, unknown>) => ["books", "list", params] as const,
    featured: (limit?: number) => ["books", "featured", limit] as const,
    detail: (id: string) => ["books", "detail", id] as const,
    bySlug: (slug: string) => ["books", "slug", slug] as const,
  },

  // Tags
  tags: {
    all: ["tags"] as const,
    detail: (id: string) => ["tags", "detail", id] as const,
    bySlug: (slug: string) => ["tags", "slug", slug] as const,
  },

  // Chapters
  chapters: {
    all: (bookId: string) => ["chapters", bookId] as const,
    detail: (bookId: string, chapterNumber: number) => ["chapters", bookId, chapterNumber] as const,
  },
};
