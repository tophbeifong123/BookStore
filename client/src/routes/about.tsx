import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <article className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-foreground">About BookStore</h1>
        <p className="text-lg text-muted-foreground">
          Learn more about our mission and values
        </p>
      </header>

      {/* Content Sections */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              BookStore was founded with a simple mission: to connect readers
              with the books they love. We believe in the power of stories to
              inspire, educate, and transform lives. Our carefully curated
              collection features titles across all genres, from timeless
              classics to contemporary bestsellers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>📖</span> Vast Collection
                </h3>
                <p className="text-muted-foreground text-sm">
                  Thousands of titles across all genres and categories
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>🚚</span> Fast Delivery
                </h3>
                <p className="text-muted-foreground text-sm">
                  Quick and reliable shipping to your doorstep
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>💰</span> Best Prices
                </h3>
                <p className="text-muted-foreground text-sm">
                  Competitive pricing with regular special offers
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <span>⭐</span> Expert Reviews
                </h3>
                <p className="text-muted-foreground text-sm">
                  Curated recommendations from book enthusiasts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/30">
          <CardHeader>
            <CardTitle>Navigation Demo</CardTitle>
            <CardDescription>
              Programmatic navigation using{" "}
              <code className="bg-muted px-2 py-0.5 rounded text-xs">
                useNavigate
              </code>{" "}
              hook
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/")}>Go to Home</Button>
              <Button variant="outline" onClick={() => navigate("/products")}>
                Browse Products
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>
                ← Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="bg-primary text-primary-foreground border-primary">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-primary-foreground">
            Ready to Start Reading?
          </CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Explore our collection and find your next great read today!
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate("/products")}
          >
            Browse Books
          </Button>
        </CardFooter>
      </Card>
    </article>
  );
}
