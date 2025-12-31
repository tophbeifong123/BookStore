// ===========================================
// App Navbar Component
// ===========================================

import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth, useLogout } from "@/hooks";
import { BookOpen, Search, LogOut, Settings, Plus, Library, Loader2 } from "lucide-react";

export function Navbar() {
  const { user, isAuthenticated, isLoading, isAdmin } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <header className="bg-background/95 sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <span className="bg-primary text-primary-foreground rounded-lg p-1.5">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="hidden sm:inline">BookStore</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/">
            <Button variant="ghost" size="sm">
              Home
            </Button>
          </Link>
          <Link to="/books">
            <Button variant="ghost" size="sm">
              <Library className="mr-1.5 h-4 w-4" />
              Library
            </Button>
          </Link>
          {isAuthenticated && (
            <Link to="/my-books">
              <Button variant="ghost" size="sm">
                <BookOpen className="mr-1.5 h-4 w-4" />
                My Books
              </Button>
            </Link>
          )}
        </nav>

        {/* Search Bar */}
        <div className="relative hidden max-w-sm flex-1 lg:flex">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search manga, novels..."
            className="bg-secondary/50 border-input focus:ring-ring/20 h-10 w-full rounded-full border pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value;
                if (value) navigate(`/books?search=${encodeURIComponent(value)}`);
              }
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isLoading ? (
            <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
          ) : isAuthenticated && user ? (
            <>
              {/* Create Book Button */}
              <Link to="/books/create" className="hidden sm:block">
                <Button variant="outline" size="sm">
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Book
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="hidden sm:inline">{user.displayName || user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.displayName || user.username}</p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                    {isAdmin && (
                      <span className="bg-primary/10 text-primary mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/my-books" className="flex items-center">
                      <Library className="mr-2 h-4 w-4" />
                      My Books
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/books/create" className="flex items-center">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Book
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-full px-6">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
