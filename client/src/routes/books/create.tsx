// ===========================================
// Create/Edit Book Page
// ===========================================

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateBook, useUpdateBook, useBook, useTags, useUploadCover, useAuth } from "@/hooks";
import { BookOpen, Loader2, Save, ArrowLeft, Upload, X, AlertCircle } from "lucide-react";
import type { BookType, BookStatus, Tag } from "@/types";

const BOOK_TYPES: { value: BookType; label: string }[] = [
  { value: "manga", label: "Manga" },
  { value: "manhwa", label: "Manhwa" },
  { value: "manhua", label: "Manhua" },
  { value: "novel", label: "Novel" },
  { value: "comic", label: "Comic" },
];

const BOOK_STATUSES: { value: BookStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export default function CreateBookPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const navigate = useNavigate();

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: existingBook, isLoading: bookLoading } = useBook(id ?? "");
  const { data: allTags } = useTags();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const uploadCover = useUploadCover();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [type, setType] = useState<BookType>("manga");
  const [status, setStatus] = useState<BookStatus>("draft");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Populate form when editing
  useEffect(() => {
    if (existingBook && isEditing) {
      setTitle(existingBook.title);
      setSlug(existingBook.slug);
      setAuthor(existingBook.author);
      setDescription(existingBook.description || "");
      setCoverImage(existingBook.coverImage || "");
      setType(existingBook.type);
      setStatus(existingBook.status);
      setSelectedTags(existingBook.tags.map((t: Tag) => t.id));
    }
  }, [existingBook, isEditing]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  }, [title, isEditing]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadCover.mutateAsync(file);
      setCoverImage(result.url);
    } catch (error) {
      console.error("Failed to upload cover:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bookData = {
      title,
      slug,
      author,
      description: description || undefined,
      coverImage: coverImage || undefined,
      type,
      status,
      tagIds: selectedTags,
    };

    try {
      if (isEditing && id) {
        await updateBook.mutateAsync({ id, data: bookData });
      } else {
        await createBook.mutateAsync(bookData);
      }
      navigate("/my-books");
    } catch (error) {
      console.error("Failed to save book:", error);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  if (authLoading || (isEditing && bookLoading)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isPending = createBook.isPending || updateBook.isPending;
  const error = createBook.error || updateBook.error;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{isEditing ? "Edit Book" : "Add New Book"}</h1>
          <p className="text-muted-foreground text-sm">
            {isEditing ? "Update your book information" : "Share your favorite manga or novel"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
            <AlertCircle className="h-5 w-5" />
            <p>{error.message}</p>
          </div>
        )}

        {/* Cover Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cover Image</CardTitle>
            <CardDescription>Upload a cover image for your book</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-6">
              <div className="bg-secondary flex aspect-[2/3] w-32 items-center justify-center overflow-hidden rounded-lg">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen className="text-muted-foreground h-10 w-10" />
                )}
              </div>
              <div className="flex-1 space-y-3">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                    disabled={uploadCover.isPending}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={uploadCover.isPending}
                    onClick={() =>
                      document.querySelector<HTMLInputElement>('input[type="file"]')?.click()
                    }
                  >
                    {uploadCover.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </>
                    )}
                  </Button>
                </label>
                {coverImage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCoverImage("")}
                    className="text-destructive"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Remove
                  </Button>
                )}
                <p className="text-muted-foreground text-xs">Recommended: 600x900px, JPG or PNG</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title *</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Slug *</label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="book-url-slug"
                required
              />
              <p className="text-muted-foreground text-xs">URL: /books/{slug || "your-slug"}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Author *</label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the book..."
                className="border-input focus:ring-ring/20 bg-background min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Type & Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Type & Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type *</label>
              <div className="flex flex-wrap gap-2">
                {BOOK_TYPES.map((t) => (
                  <Badge
                    key={t.value}
                    variant={type === t.value ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setType(t.value)}
                  >
                    {t.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-2">
                {BOOK_STATUSES.map((s) => (
                  <Badge
                    key={s.value}
                    variant={status === s.value ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setStatus(s.value)}
                  >
                    {s.label}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
            <CardDescription>Select genres and categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {allTags?.map((tag: Tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  style={
                    selectedTags.includes(tag.id)
                      ? { backgroundColor: tag.color, borderColor: tag.color }
                      : { borderColor: tag.color, color: tag.color }
                  }
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
              {(!allTags || allTags.length === 0) && (
                <p className="text-muted-foreground text-sm">No tags available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditing ? "Update Book" : "Create Book"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
