// ===========================================
// Book Detail Page
// ===========================================

import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useBookBySlug, useChapters, useIncrementBookView } from "@/hooks";
import { BookOpen, Eye, Star, Clock, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import type { BookType, Tag, Chapter } from "@/types";

const TYPE_COLORS: Record<BookType, string> = {
  manga: "bg-red-500",
  manhwa: "bg-blue-500",
  manhua: "bg-green-500",
  novel: "bg-purple-500",
  comic: "bg-orange-500",
};

export default function BookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: book, isLoading, error } = useBookBySlug(slug ?? "");
  const { data: chapters } = useChapters(book?.id ?? "");
  const incrementView = useIncrementBookView();

  // Increment view count on page load
  useEffect(() => {
    if (book?.id) {
      incrementView.mutate(book.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <BookOpen className="text-muted-foreground mx-auto h-16 w-16" />
        <h1 className="mt-4 text-2xl font-bold">Book not found</h1>
        <p className="text-muted-foreground mt-2">The book you're looking for doesn't exist</p>
        <Link to="/books">
          <Button className="mt-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-secondary/30 relative overflow-hidden">
        {/* Background Blur */}
        {book.coverImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl"
            style={{ backgroundImage: `url(${book.coverImage})` }}
          />
        )}

        <div className="relative container mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-[250px_1fr]">
            {/* Cover Image */}
            <figure className="mx-auto w-[200px] md:mx-0 md:w-full">
              <div className="bg-secondary aspect-[2/3] overflow-hidden rounded-xl shadow-2xl">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <BookOpen className="text-muted-foreground h-16 w-16" />
                  </div>
                )}
              </div>
            </figure>

            {/* Info */}
            <div className="space-y-6">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge className={`${TYPE_COLORS[book.type]} text-white`}>
                    {book.type.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">{book.status}</Badge>
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">{book.title}</h1>
                <p className="text-muted-foreground mt-2 text-lg">by {book.author}</p>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{book.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="text-muted-foreground h-5 w-5" />
                  <span>{book.viewCount.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-muted-foreground h-5 w-5" />
                  <span>{book.totalChapters} chapters</span>
                </div>
              </div>

              {/* Tags */}
              {book.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag: Tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              {book.description && (
                <p className="text-muted-foreground leading-relaxed">{book.description}</p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {book.latestChapter > 0 && (
                  <Link to={`/books/${book.slug}/chapter/1`}>
                    <Button size="lg" className="h-12 rounded-full px-8">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Start Reading
                    </Button>
                  </Link>
                )}
                {book.latestChapter > 1 && (
                  <Link to={`/books/${book.slug}/chapter/${book.latestChapter}`}>
                    <Button size="lg" variant="outline" className="h-12 rounded-full px-6">
                      Latest Ch. {book.latestChapter}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters List */}
      <section className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Chapters</h2>

        {!chapters || chapters.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="text-muted-foreground mx-auto h-12 w-12" />
              <p className="text-muted-foreground mt-4">No chapters available yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-2">
            {chapters.map((chapter: Chapter) => (
              <Link key={chapter.id} to={`/books/${book.slug}/chapter/${chapter.chapterNumber}`}>
                <Card className="hover:bg-secondary/50 transition-colors">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-semibold">
                        Chapter {chapter.chapterNumber}
                        {chapter.title && `: ${chapter.title}`}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {chapter.pageCount} pages • {chapter.viewCount.toLocaleString()} views
                      </p>
                    </div>
                    <ChevronRight className="text-muted-foreground h-5 w-5" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
