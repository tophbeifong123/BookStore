import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PRODUCTS } from "@/constants/products";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-10">
      <header className="mb-10 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Library</h1>
        <p className="text-muted-foreground">Browse our collection of manga, manhwa, and novels.</p>
      </header>

      <section className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {PRODUCTS.map((product) => (
          <Link key={product.id} to={`/products/${product.id}`}>
            <Card className="group h-full overflow-hidden border-0 bg-transparent shadow-none">
              <CardContent className="relative p-0">
                <div className="bg-secondary aspect-[2/3] overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-md">
                  <img
                    src={product.cover}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={
                        product.status === "Completed"
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col items-start gap-1 p-2 pt-3">
                <h3 className="group-hover:text-primary line-clamp-2 leading-snug font-semibold transition-colors">
                  {product.title}
                </h3>
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded px-1.5 py-0.5 text-[10px]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
