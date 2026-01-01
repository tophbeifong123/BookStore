// ===========================================
// Admin Layout
// ===========================================

import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { Loader2, Users, BookCheck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminLayout() {
  const { isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect non-admins
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: Home },
    { path: "/admin/books", label: "Books", icon: BookCheck },
    { path: "/admin/users", label: "Users", icon: Users },
    { path: "/admin/approvals", label: "Approvals", icon: BookCheck },
  ];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground mt-2">Manage users and book approvals</p>
      </header>

      {/* Navigation */}
      <nav className="mb-8 flex gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Content */}
      <Card className="p-6">
        <Outlet />
      </Card>
    </div>
  );
}
