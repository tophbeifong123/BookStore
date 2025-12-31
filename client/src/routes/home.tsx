import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AppPagination } from "@/components/common/AppPagination";
import { PRODUCTS } from "@/constants/products";
import { ArrowRight, Clock } from "lucide-react";

const ITEMS_PER_PAGE = 4;

export default function HomePage() {
  const featured = PRODUCTS[0];
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination
  const totalPages = Math.ceil(PRODUCTS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = PRODUCTS.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="bg-secondary/30 px-4 py-20">
        <article className="container mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            <Badge variant="secondary" className="mb-2">
              Featured This Week
            </Badge>
            <h1 className="text-5xl leading-[0.9] font-black tracking-tighter md:text-7xl">
              READ <br />
              <span className="from-primary bg-linear-to-r to-purple-600 bg-clip-text text-transparent">
                {featured.title.toUpperCase()}
              </span>
            </h1>
            <p className="text-muted-foreground line-clamp-3 max-w-xl text-lg">
              {featured.description}
            </p>
            <div className="flex gap-3 pt-2">
              <Link to={`/products/${featured.id}`}>
                <Button size="lg" className="h-12 rounded-full px-8 text-base">
                  Read Now
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="lg" className="h-12 rounded-full px-6">
                  View Library
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <figure className="group relative hidden md:block">
            <div className="bg-primary/10 absolute inset-0 scale-95 rotate-6 rounded-xl transition-transform group-hover:rotate-3" />
            <img
              src={featured.cover}
              alt={featured.title}
              className="relative aspect-[2/3] w-full rotate-[-3deg] rounded-xl object-cover shadow-2xl transition-transform group-hover:rotate-0"
            />
          </figure>
        </article>
      </section>

      {/* Latest Updates Section */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <header className="mb-8 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <Clock className="h-5 w-5" /> Latest Updates
          </h2>
          <Link
            to="/products"
            className="flex items-center gap-1 text-sm font-medium hover:underline"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {paginatedProducts.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`}>
              <Card className="group h-full overflow-hidden border-0 bg-transparent shadow-none">
                <CardContent className="relative p-0">
                  <div className="bg-secondary aspect-[2/3] overflow-hidden rounded-lg">
                    <img
                      src={product.cover}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-background/80 font-bold backdrop-blur-md"
                    >
                      {product.type}
                    </Badge>
                  </div>
                  <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-xs font-medium">Ch. {product.latestChapter}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-1 p-2">
                  <h3 className="group-hover:text-primary line-clamp-1 text-base leading-tight font-bold transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {product.status} • {product.rating} ★
                  </p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <AppPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          className="mt-8"
        />
      </section>
    </div>
  );
}
