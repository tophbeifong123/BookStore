import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryProvider } from "./providers";
import "./index.css";

// Import route components
import RootLayout from "./routes/layout";
import HomePage from "./routes/home";
import BooksPage from "./routes/books/index";
import BookDetailPage from "./routes/books/$slug";
import ReadChapterPage from "./routes/books/read";
import CreateBookPage from "./routes/books/create";
import MyBooksPage from "./routes/my-books/index";
import LoginPage from "./routes/auth/login";
import RegisterPage from "./routes/auth/register";
import NotFoundPage from "./routes/not-found";

// Admin routes
import AdminLayout from "./routes/admin/layout";
import AdminDashboard from "./routes/admin/index";
import AdminUsersPage from "./routes/admin/users";
import AdminApprovalsPage from "./routes/admin/approvals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "books",
        children: [
          {
            index: true,
            element: <BooksPage />,
          },
          {
            path: "create",
            element: <CreateBookPage />,
          },
          {
            path: "edit/:id",
            element: <CreateBookPage />,
          },
          {
            path: ":slug",
            element: <BookDetailPage />,
          },
          {
            path: ":slug/chapter/:chapter",
            element: <ReadChapterPage />,
          },
        ],
      },
      {
        path: "my-books",
        element: <MyBooksPage />,
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <AdminUsersPage />,
          },
          {
            path: "approvals",
            element: <AdminApprovalsPage />,
          },
        ],
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
);
