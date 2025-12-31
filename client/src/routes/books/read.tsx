// ===========================================
// Chapter Read Page
// ===========================================

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBookBySlug, useChapter, useIncrementChapterView } from "@/hooks";
import { ChevronLeft, ChevronRight, Home, List, Loader2, Maximize, Minimize } from "lucide-react";
import type { ChapterPage } from "@/types";

export default function ReadChapterPage() {
  const { slug, chapter: chapterParam } = useParams<{
    slug: string;
    chapter: string;
  }>();
  const navigate = useNavigate();
  const chapterNumber = parseInt(chapterParam ?? "1", 10);

  const { data: book } = useBookBySlug(slug ?? "");
  const { data: chapter, isLoading } = useChapter(book?.id ?? "", chapterNumber);
  const incrementView = useIncrementChapterView();

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Increment view count
  useEffect(() => {
    if (book?.id && chapter?.id) {
      incrementView.mutate({ bookId: book.id, id: chapter.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book?.id, chapter?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && chapterNumber > 1) {
        navigate(`/books/${slug}/chapter/${chapterNumber - 1}`);
      } else if (e.key === "ArrowRight" && book && chapterNumber < book.totalChapters) {
        navigate(`/books/${slug}/chapter/${chapterNumber + 1}`);
      } else if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [chapterNumber, book, navigate, slug]);

  if (isLoading || !book) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const hasPrevious = chapterNumber > 1;
  const hasNext = chapterNumber < book.totalChapters;

  return (
    <div className={`min-h-screen ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}>
      {/* Header */}
      <header
        className={`bg-background/95 sticky top-0 z-40 border-b backdrop-blur ${
          isFullscreen ? "hidden" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link to={`/books/${slug}`}>
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="line-clamp-1 font-semibold">{book.title}</h1>
              <p className="text-muted-foreground text-sm">
                Chapter {chapterNumber}
                {chapter?.title && `: ${chapter.title}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
            <Link to={`/books/${slug}`}>
              <Button variant="ghost" size="icon">
                <List className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Chapter Content */}
      <main className={`mx-auto max-w-3xl ${isFullscreen ? "p-0" : "px-4 py-8"}`}>
        {chapter?.pages && chapter.pages.length > 0 ? (
          <div className="space-y-1">
            {chapter.pages.map((page: ChapterPage) => (
              <img
                key={page.id}
                src={page.imageUrl}
                alt={`Page ${page.pageNumber}`}
                className="mx-auto w-full"
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No pages available</p>
          </div>
        )}
      </main>

      {/* Navigation Footer */}
      <footer
        className={`bg-background/95 sticky bottom-0 border-t backdrop-blur ${
          isFullscreen ? "fixed right-0 left-0" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button
            variant="outline"
            disabled={!hasPrevious}
            onClick={() => navigate(`/books/${slug}/chapter/${chapterNumber - 1}`)}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <span className="text-muted-foreground text-sm">
            {chapterNumber} / {book.totalChapters}
          </span>

          <Button
            variant="outline"
            disabled={!hasNext}
            onClick={() => navigate(`/books/${slug}/chapter/${chapterNumber + 1}`)}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
