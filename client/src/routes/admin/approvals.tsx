// ===========================================
// Admin Book Approvals Page
// ===========================================

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Check, X, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/types";

export default function AdminApprovalsPage() {
  const queryClient = useQueryClient();
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Fetch pending books
  const { data: booksData, isLoading } = useQuery<{ data: Book[] }>({
    queryKey: ["admin", "pending-books"],
    queryFn: async () => {
      return await apiClient.get<{ data: Book[] }>("/books/pending");
    },
  });

  // Approve book mutation
  const approveMutation = useMutation({
    mutationFn: async (bookId: string) => {
      await apiClient.patch(`/books/${bookId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-books"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "books"] });
      toast.success("Book approved successfully");
    },
    onError: () => {
      toast.error("Failed to approve book");
    },
  });

  // Reject book mutation
  const rejectMutation = useMutation({
    mutationFn: async (bookId: string) => {
      await apiClient.patch(`/books/${bookId}/reject`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-books"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "books"] });
      toast.success("Book rejected");
    },
    onError: () => {
      toast.error("Failed to reject book");
    },
  });

  const handlePreviewClick = (book: Book) => {
    setSelectedBook(book);
    setPreviewDialogOpen(true);
  };

  const handleApprove = (bookId: string) => {
    approveMutation.mutate(bookId);
  };

  const handleReject = (bookId: string) => {
    rejectMutation.mutate(bookId);
  };

  const books = booksData?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Book Approvals</h2>
        <p className="text-muted-foreground mt-1">Review and approve pending book submissions</p>
      </div>

      {/* Empty State */}
      {books.length === 0 ? (
        <div className="py-20 text-center">
          <Check className="text-muted-foreground mx-auto h-16 w-16" />
          <h3 className="mt-4 text-xl font-semibold">All caught up!</h3>
          <p className="text-muted-foreground mt-2">
            There are no pending books to review at the moment.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book: Book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-16 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="bg-muted flex h-16 w-12 items-center justify-center rounded">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        book.approvalStatus === "pending"
                          ? "secondary"
                          : book.approvalStatus === "approved"
                            ? "default"
                            : "destructive"
                      }
                    >
                      {book.approvalStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(book.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handlePreviewClick(book)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {book.approvalStatus === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(book.id)}
                            disabled={approveMutation.isPending}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(book.id)}
                            disabled={rejectMutation.isPending}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedBook?.title}</DialogTitle>
            <DialogDescription>Book Details</DialogDescription>
          </DialogHeader>
          {selectedBook && (
            <div className="grid gap-4">
              <div className="flex gap-4">
                {selectedBook.coverImage && (
                  <img
                    src={selectedBook.coverImage}
                    alt={selectedBook.title}
                    className="h-48 w-32 rounded object-cover"
                  />
                )}
                <div className="flex-1 space-y-2">
                  <div>
                    <span className="text-muted-foreground text-sm">Author:</span>
                    <p className="font-medium">{selectedBook.author}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Type:</span>
                    <p className="font-medium capitalize">{selectedBook.type}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Status:</span>
                    <p className="font-medium capitalize">{selectedBook.status}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-sm">Rating:</span>
                    <p className="font-medium">{selectedBook.rating} ★</p>
                  </div>
                </div>
              </div>
              {selectedBook.description && (
                <div>
                  <span className="text-muted-foreground text-sm">Description:</span>
                  <p className="mt-1">{selectedBook.description}</p>
                </div>
              )}
              {selectedBook.tags && selectedBook.tags.length > 0 && (
                <div>
                  <span className="text-muted-foreground text-sm">Tags:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedBook.tags.map((tag) => (
                      <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
