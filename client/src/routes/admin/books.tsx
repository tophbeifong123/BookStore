// ===========================================
// Admin Books Management Page
// ===========================================

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiClient } from "@/services";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppPagination } from "@/components/common/AppPagination";
import { Loader2, Trash2, Eye, Search, Edit } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/types";

export default function AdminBooksPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const limit = 10;

  // Fetch all books (admin can see all books including drafts)
  const { data: booksData, isLoading } = useQuery<{
    data: Book[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }>({
    queryKey: ["admin", "all-books", page, search, statusFilter, approvalFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);

      // For admin, we need a special endpoint that shows all books
      return await apiClient.get<{
        data: Book[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      }>(`/books/admin/all?${params.toString()}`);
    },
  });

  // Delete book mutation
  const deleteMutation = useMutation({
    mutationFn: async (bookId: string) => {
      await apiClient.delete(`/books/${bookId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "all-books"] });
      toast.success("Book deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedBook(null);
    },
    onError: () => {
      toast.error("Failed to delete book");
    },
  });

  // Update book status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ bookId, status }: { bookId: string; status: string }) => {
      await apiClient.patch(`/books/${bookId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "all-books"] });
      toast.success("Book status updated");
    },
    onError: () => {
      toast.error("Failed to update book status");
    },
  });

  // Toggle featured mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ bookId, isFeatured }: { bookId: string; isFeatured: boolean }) => {
      await apiClient.patch(`/books/${bookId}`, { isFeatured });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "all-books"] });
      toast.success("Featured status updated");
    },
    onError: () => {
      toast.error("Failed to update featured status");
    },
  });

  const handleDeleteClick = (book: Book) => {
    setSelectedBook(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedBook) {
      deleteMutation.mutate(selectedBook.id);
    }
  };

  const handleStatusChange = (bookId: string, newStatus: string) => {
    updateStatusMutation.mutate({ bookId, status: newStatus });
  };

  const handleToggleFeatured = (bookId: string, currentFeatured: boolean) => {
    toggleFeaturedMutation.mutate({ bookId, isFeatured: !currentFeatured });
  };

  const books = booksData?.data ?? [];
  const totalPages = booksData?.meta?.totalPages ?? 1;

  // Filter books client-side
  const filteredBooks = books.filter((book) => {
    if (statusFilter !== "all" && book.status !== statusFilter) return false;
    if (approvalFilter !== "all" && book.approvalStatus !== approvalFilter) return false;
    return true;
  });

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
        <h2 className="text-2xl font-bold">Books Management</h2>
        <p className="text-muted-foreground mt-1">Manage all books in the system</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

        {/* Status Filters */}
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={approvalFilter} onValueChange={setApprovalFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Approval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Approval</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Books Table */}
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
              <TableHead>Featured</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="py-10 text-center">
                  <p className="text-muted-foreground">No books found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredBooks.map((book) => (
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
                  <TableCell className="max-w-xs truncate font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{book.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={book.status}
                      onValueChange={(value: string) => handleStatusChange(book.id, value)}
                      disabled={updateStatusMutation.isPending}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <TableCell>
                    <Button
                      variant={book.isFeatured ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggleFeatured(book.id, book.isFeatured)}
                      disabled={toggleFeaturedMutation.isPending}
                    >
                      {book.isFeatured ? "★" : "☆"}
                    </Button>
                  </TableCell>
                  <TableCell>{book.viewCount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link to={`/books/${book.slug}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/books/edit/${book.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(book)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="text-destructive h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <AppPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBook?.title}"? This action cannot be undone
              and will also delete all chapters and pages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
