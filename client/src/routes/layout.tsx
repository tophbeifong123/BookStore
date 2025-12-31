// ===========================================
// Root Layout
// ===========================================

import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";

export default function RootLayout() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col font-sans transition-colors duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-muted-foreground border-t py-8 text-center text-sm">
        <div className="container mx-auto px-4">
          <p>© 2025 BookStore. Read Free Manga & Novels.</p>
        </div>
      </footer>
    </div>
  );
}
