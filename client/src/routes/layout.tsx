import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RootLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Bar - Modern Teen Style */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-gradient-to-r from-card via-card to-secondary/20 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 shadow-sm">
        <nav className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <img
                  src="/logo.svg"
                  alt="BookStore Logo"
                  className="h-12 w-12 drop-shadow-md"
                />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary to-blue-600 bg-clip-text text-transparent">
                BookStore
              </span>
            </Link>

            {/* Navigation Links - Modern Style */}
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button
                  variant={isActive("/") ? "default" : "ghost"}
                  size="sm"
                  className="font-medium rounded-full px-6 hover:scale-105 transition-all"
                >
                  Home
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant={isActive("/about") ? "default" : "ghost"}
                  size="sm"
                  className="font-medium rounded-full px-6 hover:scale-105 transition-all"
                >
                  About
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  variant={isActive("/products") ? "default" : "ghost"}
                  size="sm"
                  className="font-medium rounded-full px-6 hover:scale-105 transition-all"
                >
                  Products
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <Outlet />
      </main>

      {/* Footer - Modern Style */}
      <footer className="border-t border-border/40 bg-gradient-to-r from-card via-secondary/10 to-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-4">
            <img
              src="/logo.svg"
              alt="BookStore"
              className="h-10 w-10 opacity-60"
            />
            <p className="text-sm text-muted-foreground">
              © 2025 BookStore. Built with React Router v7 + Tailwind CSS v4
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
