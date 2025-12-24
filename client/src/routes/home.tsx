import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-16 max-w-6xl mx-auto">
      {/* Hero Section - Modern Teen Style */}
      <section className="text-center space-y-6 py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl -z-10"></div>
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent">
            Welcome to
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-primary to-blue-500 bg-clip-text text-transparent">
            BookStore
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          📚 Discover your next favorite book. Browse our amazing collection! ✨
        </p>
      </section>

      {/* Features Grid - Modern Cards */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-card to-secondary/20 border-2 hover:border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="text-3xl">🏠</span> Home Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              You're currently on the home page. This demonstrates the main
              landing page.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-card to-secondary/20 border-2 hover:border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="text-3xl">ℹ️</span> About Page
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Learn more about our bookstore.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/about" className="w-full">
              <Button
                variant="outline"
                className="w-full rounded-full hover:scale-105 transition-transform"
              >
                Go to About →
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-card to-secondary/20 border-2 hover:border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="text-3xl">📚</span> Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Browse our collection with dynamic routing.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/products" className="w-full">
              <Button
                variant="outline"
                className="w-full rounded-full hover:scale-105 transition-transform"
              >
                View Products →
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
