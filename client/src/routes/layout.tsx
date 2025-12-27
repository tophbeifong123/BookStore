import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, BookOpen } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function RootLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col font-sans transition-colors duration-300">
      {/* Minimal Header */}
      <header className="bg-background/80 sticky top-5 z-50 mx-auto w-full max-w-1/2 rounded-full shadow-sm backdrop-blur-md transition-colors duration-300">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="bg-primary text-primary-foreground rounded-lg p-1.5">
              <BookOpen className="h-5 w-5" />
            </span>
            <span>AniRead</span>
          </Link>

          {/* Search Bar (Fake) */}
          <div className="relative hidden max-w-md flex-1 md:flex">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search manga, novels..."
              className="bg-secondary/50 focus:ring-ring/20 h-10 w-full rounded-full border pr-4 pl-10 text-sm transition-all focus:ring-2 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/products">
              <Button variant="ghost" size="sm">
                Browse
              </Button>
            </Link>
            <Button size="sm" className="rounded-full px-6">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Simple Footer */}
      <footer className="text-muted-foreground border-t py-8 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>© 2025 AniRead. Read Free Manga & Novels.</p>
        </div>
      </footer>
    </div>
  );
}
