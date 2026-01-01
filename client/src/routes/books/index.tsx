// ===========================================
// Books List Page
// ===========================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppPagination } from "@/components/common/AppPagination";
import { useBooks, useTags } from "@/hooks";
import { BookOpen, Search, Loader2 } from "lucide-react";
import type { BookType, Book, Tag } from "@/types";

const TYPE_COLORS: Record<BookType, string> = {
  manga: "bg-red-500/90",
  manhwa: "bg-blue-500/90",
  manhua: "bg-green-500/90",
  novel: "bg-purple-500/90",
  comic: "bg-orange-500/90",
};

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const limit = 12;

  const { data: booksData, isLoading: booksLoading } = useBooks({
    page,
    limit,
    search: search || undefined,
  });

  const { data: tags } = useTags();

  const books = booksData?.data ?? [];
  const totalPages = booksData?.meta.totalPages ?? 1;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold">
          <BookOpen className="text-primary h-8 w-8" />
          Library
        </h1>
        <p className="text-muted-foreground mt-2">
          Discover your next favorite manga, manhwa, or novel
        </p>
      </header>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Search books..."
            className="pl-10"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === null ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedTag(null)}
          >
            All
          </Badge>
          {tags?.slice(0, 6).map((tag: Tag) => (
            <Badge
              key={tag.id}
              variant={selectedTag === tag.id ? "default" : "outline"}
              className="cursor-pointer"
              style={
                selectedTag === tag.id
                  ? { backgroundColor: tag.color, borderColor: tag.color }
                  : { borderColor: tag.color, color: tag.color }
              }
              onClick={() => setSelectedTag(tag.id)}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {booksLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!booksLoading && books.length === 0 && (
        <div className="py-20 text-center">
          <BookOpen className="text-muted-foreground mx-auto h-16 w-16" />
          <h2 className="text-muted-foreground mt-4 text-xl font-semibold">No books found</h2>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Books Grid */}
      {!booksLoading && books.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {books.map((book: Book) => (
              <Link key={book.id} to={`/books/${book.slug}`}>
                <Card className="group h-full overflow-hidden border-0 bg-transparent shadow-none transition-transform hover:-translate-y-1">
                  <CardContent className="relative p-0">
                    <div className="bg-secondary aspect-[2/3] overflow-hidden rounded-lg">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen className="text-muted-foreground h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 left-2">
                      <Badge className={`${TYPE_COLORS[book.type]} text-white backdrop-blur-md`}>
                        {book.type}
                      </Badge>
                    </div>
                    {book.latestChapter > 0 && (
                      <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="text-xs font-medium">Ch. {book.latestChapter}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-1 p-2">
                    <h3 className="group-hover:text-primary line-clamp-2 text-sm leading-tight font-bold transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-muted-foreground text-xs">
                      {book.author} • {Number(book.rating || 0).toFixed(1)} ★
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <AppPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-8"
          />
        </>
      )}
    </div>
  );
}
