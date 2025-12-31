// ===========================================
// Home Page
// ===========================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AppPagination } from "@/components/common/AppPagination";
import { useFeaturedBooks, useBooks } from "@/hooks";
import { ArrowRight, Clock, BookOpen, Loader2 } from "lucide-react";
import type { BookType, Book } from "@/types";

const TYPE_COLORS: Record<BookType, string> = {
  manga: "bg-red-500/90",
  manhwa: "bg-blue-500/90",
  manhua: "bg-green-500/90",
  novel: "bg-purple-500/90",
  comic: "bg-orange-500/90",
};

const ITEMS_PER_PAGE = 8;

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch featured book
  const { data: featuredBooks, isLoading: featuredLoading } = useFeaturedBooks(1);
  const featured = featuredBooks?.[0];

  // Fetch latest books
  const { data: booksData, isLoading: booksLoading } = useBooks({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    sortBy: "createdAt",
    sortOrder: "DESC",
  });

  const books = booksData?.data ?? [];
  const totalPages = booksData?.meta.totalPages ?? 1;

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-secondary/30 px-4 py-20">
        <article className="container mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[1fr_300px]">
          {featuredLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          ) : featured ? (
            <>
              <div className="space-y-6">
                <Badge variant="secondary" className="mb-2">
                  Featured This Week
                </Badge>
                <h1 className="text-5xl leading-[0.9] font-black tracking-tighter md:text-7xl">
                  READ <br />
                  <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
                    {featured.title.toUpperCase()}
                  </span>
                </h1>
                <p className="text-muted-foreground line-clamp-3 max-w-xl text-lg">
                  {featured.description || `Discover ${featured.title} by ${featured.author}`}
                </p>
                <div className="flex gap-3 pt-2">
                  <Link to={`/books/${featured.slug}`}>
                    <Button size="lg" className="h-12 rounded-full px-8 text-base">
                      Read Now
                    </Button>
                  </Link>
                  <Link to="/books">
                    <Button variant="outline" size="lg" className="h-12 rounded-full px-6">
                      View Library
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hero Image */}
              <figure className="group relative hidden md:block">
                <div className="bg-primary/10 absolute inset-0 scale-95 rotate-6 rounded-xl transition-transform group-hover:rotate-3" />
                {featured.coverImage ? (
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    className="relative aspect-[2/3] w-full rotate-[-3deg] rounded-xl object-cover shadow-2xl transition-transform group-hover:rotate-0"
                  />
                ) : (
                  <div className="bg-secondary relative flex aspect-[2/3] w-full rotate-[-3deg] items-center justify-center rounded-xl shadow-2xl">
                    <BookOpen className="text-muted-foreground h-16 w-16" />
                  </div>
                )}
              </figure>
            </>
          ) : (
            <div className="space-y-6">
              <h1 className="text-5xl leading-[0.9] font-black tracking-tighter md:text-7xl">
                DISCOVER <br />
                <span className="from-primary bg-gradient-to-r to-purple-600 bg-clip-text text-transparent">
                  YOUR STORY
                </span>
              </h1>
              <p className="text-muted-foreground max-w-xl text-lg">
                Explore thousands of manga, manhwa, and novels
              </p>
              <Link to="/books">
                <Button size="lg" className="h-12 rounded-full px-8 text-base">
                  Start Reading
                </Button>
              </Link>
            </div>
          )}
        </article>
      </section>

      {/* Latest Updates Section */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <header className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Clock className="h-5 w-5" /> Latest Updates
          </h2>
          <Link to="/books" className="flex items-center gap-1 text-sm font-medium hover:underline">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        {booksLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : books.length === 0 ? (
          <div className="py-20 text-center">
            <BookOpen className="text-muted-foreground mx-auto h-16 w-16" />
            <p className="text-muted-foreground mt-4">No books available yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {books.map((book: Book) => (
                <Link key={book.id} to={`/books/${book.slug}`}>
                  <Card className="group h-full overflow-hidden border-0 bg-transparent shadow-none">
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
                      <h3 className="group-hover:text-primary line-clamp-1 text-base leading-tight font-bold transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {book.status} • {book.rating.toFixed(1)} ★
                      </p>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <AppPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              className="mt-8"
            />
          </>
        )}
      </section>
    </div>
  );
}
