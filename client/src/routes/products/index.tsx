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

// Sample product data
const products = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 299,
    category: "Classic Literature",
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    price: 349,
    category: "Science Fiction",
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 279,
    category: "Classic Literature",
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 259,
    category: "Romance",
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 399,
    category: "Fantasy",
  },
  {
    id: "6",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    price: 450,
    category: "Fantasy",
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Our Products</h1>
        <p className="text-lg text-muted-foreground">
          Browse our collection of books. Click on any book to view details.
        </p>
      </header>

      {/* Info Box */}
      <Card className="bg-secondary/30 border-secondary">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dynamic Routing Demo:</strong> Click on any product to see
            dynamic routing in action (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/products/1</code>,{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">/products/2</code>)
          </p>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="group transition-transform hover:scale-[1.02]"
          >
            <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">
                    {product.category}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    ฿{product.price}
                  </span>
                </div>
                <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
                  {product.title}
                </CardTitle>
                <CardDescription>by {product.author}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" className="w-full" size="sm">
                  View Details →
                </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </section>

      {/* Empty State Example */}
      {products.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground text-lg mb-4">No products found</p>
            <Link to="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
