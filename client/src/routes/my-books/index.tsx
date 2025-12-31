// ===========================================
// My Books Page (User's Books)
// ===========================================

import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useBooks, useDeleteBook, useAuth } from "@/hooks";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Loader2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Book, BookType, ApprovalStatus } from "@/types";

const TYPE_COLORS: Record<BookType, string> = {
  manga: "bg-red-500",
  manhwa: "bg-blue-500",
  manhua: "bg-green-500",
  novel: "bg-purple-500",
  comic: "bg-orange-500",
};

const APPROVAL_STATUS: Record<
  ApprovalStatus,
  { label: string; icon: typeof Clock; color: string }
> = {
  pending: { label: "Pending Review", icon: Clock, color: "text-yellow-500" },
  approved: { label: "Approved", icon: CheckCircle, color: "text-green-500" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-red-500" },
};

export default function MyBooksPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const deleteBook = useDeleteBook();

  // Fetch user's books
  const { data: booksData, isLoading } = useBooks({
    page: 1,
    limit: 50,
  });

  // Filter books created by current user
  const myBooks = booksData?.data.filter((book: Book) => book.createdBy === user?.id) ?? [];

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleDelete = async (bookId: string, bookTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      try {
        await deleteBook.mutateAsync(bookId);
      } catch (error) {
        console.error("Failed to delete book:", error);
      }
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-bold">
            <BookOpen className="text-primary h-7 w-7" />
            My Books
          </h1>
          <p className="text-muted-foreground mt-1">Manage your submitted books</p>
        </div>
        <Link to="/books/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </header>

      {/* Empty State */}
      {myBooks.length === 0 && (
        <Card className="py-16 text-center">
          <CardContent>
            <BookOpen className="text-muted-foreground mx-auto h-16 w-16" />
            <h2 className="mt-4 text-xl font-semibold">No books yet</h2>
            <p className="text-muted-foreground mt-2">
              Start by adding your first book to the library
            </p>
            <Link to="/books/create">
              <Button className="mt-6">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Book
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Books List */}
      {myBooks.length > 0 && (
        <div className="space-y-4">
          {myBooks.map((book: Book) => {
            const approvalInfo = APPROVAL_STATUS[book.approvalStatus];
            const ApprovalIcon = approvalInfo.icon;

            return (
              <Card key={book.id} className="overflow-hidden">
                <CardContent className="flex gap-4 p-4">
                  {/* Cover */}
                  <Link to={`/books/${book.slug}`} className="shrink-0">
                    <div className="bg-secondary aspect-[2/3] w-20 overflow-hidden rounded-lg">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen className="text-muted-foreground h-8 w-8" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            to={`/books/${book.slug}`}
                            className="hover:text-primary font-semibold transition-colors"
                          >
                            {book.title}
                          </Link>
                          <p className="text-muted-foreground text-sm">by {book.author}</p>
                        </div>
                        <div className="flex gap-1">
                          <Badge className={`${TYPE_COLORS[book.type]} text-white`}>
                            {book.type}
                          </Badge>
                          <Badge variant={book.status === "published" ? "default" : "secondary"}>
                            {book.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-muted-foreground mt-2 flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {book.viewCount.toLocaleString()} views
                        </span>
                        <span>{book.totalChapters} chapters</span>
                        <span className={`flex items-center gap-1 ${approvalInfo.color}`}>
                          <ApprovalIcon className="h-4 w-4" />
                          {approvalInfo.label}
                        </span>
                      </div>

                      {/* Rejection Reason */}
                      {book.approvalStatus === "rejected" && book.rejectionReason && (
                        <p className="mt-2 text-sm text-red-500">Reason: {book.rejectionReason}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                      <Link to={`/books/${book.slug}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                      <Link to={`/books/edit/${book.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handleDelete(book.id, book.title)}
                        disabled={deleteBook.isPending}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
