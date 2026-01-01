// ===========================================
// Admin Dashboard Page
// ===========================================

import { useBooks, useAuth } from "@/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BookCheck, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services";

export default function AdminDashboard() {
  const { user } = useAuth();

  // Fetch all books stats
  const { data: booksData } = useBooks({ page: 1, limit: 1 });

  // Fetch users count
  const { data: usersData } = useQuery<unknown[]>({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      return await apiClient.get<unknown[]>("/users");
    },
  });

  // Fetch pending books count
  const { data: pendingBooksData } = useQuery<{ data: unknown[]; meta: { total: number } }>({
    queryKey: ["admin", "pending-books"],
    queryFn: async () => {
      return await apiClient.get<{ data: unknown[]; meta: { total: number } }>("/books/pending");
    },
  });

  const stats = [
    {
      title: "Total Users",
      value: Array.isArray(usersData) ? usersData.length : 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Total Books",
      value: booksData?.meta?.total ?? 0,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "Pending Approvals",
      value: pendingBooksData?.meta?.total ?? 0,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
    {
      title: "Approved Books",
      value: (booksData?.meta?.total ?? 0) - (pendingBooksData?.meta?.total ?? 0),
      icon: BookCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h2 className="text-2xl font-bold">Welcome back, {user?.displayName || user?.username}!</h2>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your bookstore today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`${stat.bgColor} rounded-full p-2`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">
            Use the navigation above to manage users or approve pending books.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
