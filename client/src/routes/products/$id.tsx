import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Sample product data (in real app, this would come from an API/loader)
const productsData: Record<
  string,
  {
    id: string;
    title: string;
    author: string;
    price: number;
    category: string;
    description: string;
    isbn: string;
    pages: number;
    published: string;
  }
> = {
  "1": {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 299,
    category: "Classic Literature",
    description:
      "A classic American novel set in the Jazz Age that explores themes of decadence, idealism, resistance to change, and excess. It tells the story of the mysterious millionaire Jay Gatsby and his obsession with the beautiful former debutante Daisy Buchanan.",
    isbn: "978-0-7432-7356-5",
    pages: 180,
    published: "1925",
  },
  "2": {
    id: "2",
    title: "1984",
    author: "George Orwell",
    price: 349,
    category: "Science Fiction",
    description:
      "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism. The story takes place in an imagined future in the year 1984 when much of the world has fallen victim to perpetual war, omnipresent government surveillance, and propaganda.",
    isbn: "978-0-452-28423-4",
    pages: 328,
    published: "1949",
  },
  "3": {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 279,
    category: "Classic Literature",
    description:
      "A novel about the serious issues of rape and racial inequality told through the eyes of young Scout Finch. The story is set in the fictional town of Maycomb, Alabama, during the Great Depression.",
    isbn: "978-0-06-112008-4",
    pages: 324,
    published: "1960",
  },
  "4": {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 259,
    category: "Romance",
    description:
      "A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet, who learns the error of making hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
    isbn: "978-0-14-143951-8",
    pages: 432,
    published: "1813",
  },
  "5": {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 399,
    category: "Fantasy",
    description:
      "A fantasy novel that follows the quest of home-loving Bilbo Baggins, the hobbit, to win a share of the treasure guarded by a dragon, Smaug. The story is a prelude to The Lord of the Rings.",
    isbn: "978-0-547-92822-7",
    pages: 310,
    published: "1937",
  },
  "6": {
    id: "6",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    price: 450,
    category: "Fantasy",
    description:
      "The first novel in the Harry Potter series follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.",
    isbn: "978-0-7475-3269-9",
    pages: 223,
    published: "1997",
  },
};

export default function ProductDetailPage() {
  // Get the dynamic :id parameter from the URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Get the product data based on the id
  const product = id ? productsData[id] : null;

  // If product not found, show error
  if (!product) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <CardHeader className="pt-12">
          <div className="text-6xl mb-4">📚</div>
          <CardTitle className="text-3xl">Product Not Found</CardTitle>
          <CardDescription>
            Sorry, the product with ID "<strong>{id}</strong>" doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center gap-3 pb-12">
          <Button onClick={() => navigate(-1)} variant="outline">
            ← Go Back
          </Button>
          <Link to="/products">
            <Button>Browse All Products</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <article className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground flex items-center gap-2">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          to="/products"
          className="hover:text-foreground transition-colors"
        >
          Products
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} size="sm">
        ← Back to Products
      </Button>

      {/* Product Details */}
      <Card className="overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 space-y-3 pb-6">
          <span className="inline-block text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full w-fit">
            {product.category}
          </span>
          <CardTitle className="text-4xl">{product.title}</CardTitle>
          <CardDescription className="text-lg">
            by {product.author}
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-8 pt-6">
          {/* Price and Actions */}
          <div className="flex items-center justify-between pb-6 border-b border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Price</p>
              <p className="text-3xl font-bold text-primary">
                ฿{product.price}
              </p>
            </div>
            <div className="flex gap-3">
              <Button size="lg">Add to Cart</Button>
              <Button variant="outline" size="lg">
                Add to Wishlist
              </Button>
            </div>
          </div>

          {/* Description */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </section>

          {/* Product Details */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Product Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-lg p-4 space-y-1">
                <p className="text-sm text-muted-foreground">ISBN</p>
                <p className="font-medium">{product.isbn}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-1">
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="font-medium">{product.pages} pages</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-1">
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="font-medium">{product.published}</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{product.category}</p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      {/* Dynamic Route Info */}
      <Card className="bg-secondary/30 border-secondary">
        <CardContent className="pt-6 space-y-2">
          <p className="text-sm font-semibold text-primary flex items-center gap-2">
            <span>🎯</span> Dynamic Route Demo
          </p>
          <p className="text-sm text-muted-foreground">
            This page uses dynamic routing. The URL parameter{" "}
            <code className="bg-muted px-2 py-0.5 rounded text-xs">:id</code> is
            captured using{" "}
            <code className="bg-muted px-2 py-0.5 rounded text-xs">
              useParams()
            </code>{" "}
            hook. Current ID: <strong>{id}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Navigation Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Try Other Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.keys(productsData).map((productId) => (
              <Link key={productId} to={`/products/${productId}`}>
                <Button
                  variant={productId === id ? "default" : "outline"}
                  size="sm"
                >
                  Product {productId}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}
