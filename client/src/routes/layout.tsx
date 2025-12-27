import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Info, ShoppingBag } from "lucide-react";

// Navigation links configuration
const navLinks = [
  { path: "/", label: "Home", icon: Home },
  { path: "/about", label: "About", icon: Info },
  { path: "/products", label: "Products", icon: ShoppingBag },
] as const;

export default function RootLayout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* Navigation Bar - Modern Teen Style */}
      <header className="bg-background from-card/40 to-secondary/20 sticky top-0 z-50 mx-auto my-4 flex w-full max-w-1/2 rounded-full border border-white/40 bg-gradient-to-r shadow-sm backdrop-blur-xl">
        {" "}
        <nav className="container mx-auto px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105"
            >
              <div className="relative">
                <img src="/logo.svg" alt="BookStore Logo" className="h-12 w-12 drop-shadow-md" />
                <div className="bg-primary/20 absolute inset-0 rounded-full opacity-0 blur-xl transition-all group-hover:opacity-100 group-hover:blur-2xl"></div>
              </div>
              <span className="from-primary via-primary bg-gradient-to-r to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                BookStore
              </span>
            </Link>

            {/* Navigation Links - Modern Style */}
            <div className="flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path}>
                    <Button
                      variant={isActive(link.path) ? "default" : "ghost"}
                      size="sm"
                      className="cursor-pointer rounded-full px-6 font-medium transition-all hover:scale-105"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Page Content */}
      <main className="container mx-auto flex-1 px-6 py-12">
        <Outlet />
      </main>

      {/* Footer - Modern Style */}
      <footer className="border-border/40 from-card via-secondary/10 to-card border-t bg-gradient-to-r">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center gap-4">
            <img src="/logo.svg" alt="BookStore" className="h-10 w-10 opacity-60" />
            <p className="text-muted-foreground text-sm">
              © 2025 BookStore. Built with React Router v7 + Tailwind CSS v4
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
