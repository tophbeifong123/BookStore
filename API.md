# 📚 Book Store API Documentation

> **Base URL:** `http://localhost:8000/api`  
> **Swagger UI:** `http://localhost:8000/docs`

---

## 🔐 Authentication

### Headers

```
Authorization: Bearer <access_token>
```

### Endpoints

| Method | Endpoint         | Description              | Auth |
| ------ | ---------------- | ------------------------ | ---- |
| `POST` | `/auth/register` | Register new user        | ❌   |
| `POST` | `/auth/login`    | Login                    | ❌   |
| `GET`  | `/auth/profile`  | Get current user profile | ✅   |

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "password123",
  "displayName": "John Doe"  // optional
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John Doe",
    "role": "user"
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "displayName": "John Doe",
    "role": "user",
    "avatarUrl": null
  }
}
```

---

## 📖 Books

### Endpoints

| Method   | Endpoint             | Description               | Auth     |
| -------- | -------------------- | ------------------------- | -------- |
| `GET`    | `/books`             | Get all books (paginated) | ❌       |
| `GET`    | `/books/featured`    | Get featured books        | ❌       |
| `GET`    | `/books/my-books`    | Get current user's books  | ✅       |
| `GET`    | `/books/pending`     | Get pending books         | ✅ Admin |
| `GET`    | `/books/slug/:slug`  | Get book by slug          | ❌       |
| `GET`    | `/books/:id`         | Get book by ID            | ❌       |
| `POST`   | `/books`             | Create book               | ✅       |
| `PATCH`  | `/books/:id`         | Update book               | ✅       |
| `PATCH`  | `/books/:id/approve` | Approve book              | ✅ Admin |
| `PATCH`  | `/books/:id/reject`  | Reject book               | ✅ Admin |
| `DELETE` | `/books/:id`         | Delete book               | ✅       |
| `POST`   | `/books/:id/view`    | Increment view count      | ❌       |

### Get All Books

```http
GET /api/books?page=1&limit=10&search=solo&sortBy=createdAt&sortOrder=DESC
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |
| `search` | string | - | Search by title |
| `sortBy` | string | createdAt | Sort field |
| `sortOrder` | ASC/DESC | DESC | Sort order |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Solo Leveling",
      "slug": "solo-leveling",
      "author": "Chugong",
      "description": "...",
      "coverImage": "http://localhost:8000/uploads/covers/xxx.jpg",
      "type": "manhwa",
      "status": "published",
      "rating": 4.9,
      "totalChapters": 179,
      "latestChapter": 179,
      "viewCount": 1000000,
      "isFeatured": true,
      "approvalStatus": "approved",
      "tags": [
        { "id": "uuid", "name": "Action", "slug": "action", "color": "#ef4444" }
      ],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Get Featured Books

```http
GET /api/books/featured?limit=5
```

### Get Book by Slug

```http
GET /api/books/slug/solo-leveling
```

### Create Book

```http
POST /api/books
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Book",
  "slug": "new-book",
  "author": "Author Name",
  "description": "Book description",
  "coverImage": "http://localhost:8000/uploads/covers/xxx.jpg",
  "type": "manga",
  "status": "draft",
  "tagIds": ["uuid1", "uuid2"]
}
```

### Book Types (Enum)

```typescript
enum BookType {
  MANGA = "manga",
  NOVEL = "novel",
  MANHWA = "manhwa",
  MANHUA = "manhua",
  COMIC = "comic",
}
```

### Book Status (Enum)

```typescript
enum BookStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}
```

### Approval Status (Enum)

```typescript
enum ApprovalStatus {
  PENDING = "pending", // User creates -> pending
  APPROVED = "approved", // Admin approves
  REJECTED = "rejected", // Admin rejects
}
```

### Get Pending Books (Admin Only)

```http
GET /api/books/pending?page=1&limit=10
Authorization: Bearer <token>
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Pending Book",
      "author": "Author Name",
      "approvalStatus": "pending",
      "status": "draft",
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Approve Book (Admin Only)

```http
PATCH /api/books/{bookId}/approve
Authorization: Bearer <token>
```

**Response:**

```json
{
  "id": "uuid",
  "title": "Approved Book",
  "approvalStatus": "approved",
  "approvedBy": "admin-uuid",
  "approvedAt": "2025-01-01T12:00:00.000Z"
}
```

### Reject Book (Admin Only)

```http
PATCH /api/books/{bookId}/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Does not meet content guidelines"
}
```

**Response:**

```json
{
  "id": "uuid",
  "title": "Rejected Book",
  "approvalStatus": "rejected",
  "approvedBy": "admin-uuid",
  "approvedAt": "2025-01-01T12:00:00.000Z",
  "rejectionReason": "Does not meet content guidelines"
}
```

---

## 🏷️ Tags

### Endpoints

| Method   | Endpoint           | Description                | Auth     |
| -------- | ------------------ | -------------------------- | -------- |
| `GET`    | `/tags`            | Get all tags               | ❌       |
| `GET`    | `/tags/slug/:slug` | Get tag by slug with books | ❌       |
| `GET`    | `/tags/:id`        | Get tag by ID              | ❌       |
| `POST`   | `/tags`            | Create tag                 | ✅ Admin |
| `PATCH`  | `/tags/:id`        | Update tag                 | ✅ Admin |
| `DELETE` | `/tags/:id`        | Delete tag                 | ✅ Admin |

### Get All Tags

```http
GET /api/tags
```

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Action",
    "slug": "action",
    "description": "Action genre",
    "color": "#ef4444",
    "bookCount": 25,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

## 📑 Chapters

### Endpoints

| Method   | Endpoint                                 | Description            | Auth |
| -------- | ---------------------------------------- | ---------------------- | ---- |
| `GET`    | `/books/:bookId/chapters`                | Get all chapters       | ❌   |
| `GET`    | `/books/:bookId/chapters/:chapterNumber` | Get chapter with pages | ❌   |
| `POST`   | `/books/:bookId/chapters`                | Create chapter         | ✅   |
| `PATCH`  | `/books/:bookId/chapters/:id`            | Update chapter         | ✅   |
| `DELETE` | `/books/:bookId/chapters/:id`            | Delete chapter         | ✅   |
| `POST`   | `/books/:bookId/chapters/:id/pages`      | Add pages              | ✅   |
| `DELETE` | `/books/:bookId/chapters/pages/:pageId`  | Remove page            | ✅   |
| `POST`   | `/books/:bookId/chapters/:id/view`       | Increment view         | ❌   |
| `POST`   | `/books/:bookId/chapters/:id/publish`    | Publish chapter        | ✅   |

### Get All Chapters

```http
GET /api/books/{bookId}/chapters
```

**Response:**

```json
[
  {
    "id": "uuid",
    "chapterNumber": 1,
    "title": "The Beginning",
    "pageCount": 25,
    "viewCount": 50000,
    "publishedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Get Chapter with Pages (for Reading)

```http
GET /api/books/{bookId}/chapters/1
```

**Response:**

```json
{
  "id": "uuid",
  "chapterNumber": 1,
  "title": "The Beginning",
  "pageCount": 25,
  "viewCount": 50000,
  "pages": [
    {
      "id": "uuid",
      "pageNumber": 1,
      "imageUrl": "http://localhost:8000/uploads/chapters/xxx.jpg",
      "width": 800,
      "height": 1200
    }
  ]
}
```

### Create Chapter

```http
POST /api/books/{bookId}/chapters
Authorization: Bearer <token>
Content-Type: application/json

{
  "chapterNumber": 2,
  "title": "The Awakening",
  "isPublished": false
}
```

### Add Pages to Chapter

```http
POST /api/books/{bookId}/chapters/{chapterId}/pages
Authorization: Bearer <token>
Content-Type: application/json

{
  "pages": [
    { "pageNumber": 1, "imageUrl": "http://localhost:8000/uploads/chapters/p1.jpg" },
    { "pageNumber": 2, "imageUrl": "http://localhost:8000/uploads/chapters/p2.jpg" },
    { "pageNumber": 3, "imageUrl": "http://localhost:8000/uploads/chapters/p3.jpg" }
  ]
}
```

---

## 📤 Uploads

### Endpoints

| Method | Endpoint                             | Description                     | Auth |
| ------ | ------------------------------------ | ------------------------------- | ---- |
| `POST` | `/uploads/cover`                     | Upload book cover               | ✅   |
| `POST` | `/uploads/chapters/:chapterId/pages` | Upload chapter pages (multiple) | ✅   |

### Upload Cover

```http
POST /api/uploads/cover
Authorization: Bearer <token>
Content-Type: multipart/form-data

cover: <file>
```

**Response:**

```json
{
  "filename": "uuid-xxx.jpg",
  "originalname": "cover.jpg",
  "mimetype": "image/jpeg",
  "size": 123456,
  "url": "http://localhost:8000/uploads/covers/uuid-xxx.jpg"
}
```

### Upload Chapter Pages

```http
POST /api/uploads/chapters/{chapterId}/pages
Authorization: Bearer <token>
Content-Type: multipart/form-data

pages: <file1>
pages: <file2>
pages: <file3>
```

**Response:**

```json
{
  "chapterId": "uuid",
  "totalPages": 3,
  "pages": [
    {
      "pageNumber": 1,
      "url": "http://localhost:8000/uploads/chapters/xxx.jpg",
      "size": 50000
    },
    {
      "pageNumber": 2,
      "url": "http://localhost:8000/uploads/chapters/yyy.jpg",
      "size": 48000
    },
    {
      "pageNumber": 3,
      "url": "http://localhost:8000/uploads/chapters/zzz.jpg",
      "size": 52000
    }
  ]
}
```

---

## 👥 Users (Admin Only)

### Endpoints

| Method   | Endpoint     | Description    | Auth     |
| -------- | ------------ | -------------- | -------- |
| `GET`    | `/users`     | Get all users  | ✅ Admin |
| `GET`    | `/users/:id` | Get user by ID | ✅ Admin |
| `POST`   | `/users`     | Create user    | ✅ Admin |
| `PATCH`  | `/users/:id` | Update user    | ✅ Admin |
| `DELETE` | `/users/:id` | Delete user    | ✅ Admin |

### User Roles

```typescript
enum UserRole {
  USER = "user",
  ADMIN = "admin",
}
```

---

## ❤️ Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 12345.67
}
```

---

## 📊 TypeScript Interfaces (สำหรับ Client)

```typescript
// User
interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  role: "user" | "admin";
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// Auth Response
interface AuthResponse {
  accessToken: string;
  user: User;
}

// Book
interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description?: string;
  coverImage?: string;
  type: "manga" | "novel" | "manhwa" | "manhua" | "comic";
  status: "draft" | "published" | "archived";
  rating: number;
  totalChapters: number;
  latestChapter: number;
  viewCount: number;
  isFeatured: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

// Tag
interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  bookCount?: number;
  createdAt: string;
}

// Chapter
interface Chapter {
  id: string;
  bookId: string;
  chapterNumber: number;
  title?: string;
  pageCount: number;
  viewCount: number;
  isPublished: boolean;
  publishedAt?: string;
  pages?: ChapterPage[];
}

// Chapter Page
interface ChapterPage {
  id: string;
  chapterId: string;
  pageNumber: number;
  imageUrl: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

// Pagination Response
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

---

## 🔗 Quick Reference

### Base URLs

- **API:** `http://localhost:8000/api`
- **Uploads:** `http://localhost:8000/uploads`
- **Swagger:** `http://localhost:8000/docs`

### File Paths

- **Covers:** `/uploads/covers/{filename}`
- **Chapter Pages:** `/uploads/chapters/{filename}`
