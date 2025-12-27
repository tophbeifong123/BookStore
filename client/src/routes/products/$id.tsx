import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PRODUCTS, getProductById } from "@/constants/products";
import { Star, List, Share2 } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : null;

  if (!product) {
    return <div className="p-20 text-center">Not Found</div>;
  }

  return (
    <article className="container mx-auto max-w-5xl px-4 py-10">
      {/* Top Section: Info */}
      <section className="mb-16 grid gap-8 md:grid-cols-[280px_1fr]">
        {/* Cover */}
        <aside className="space-y-4">
          <div className="bg-secondary aspect-[2/3] overflow-hidden rounded-lg shadow-lg">
            <img src={product.cover} alt={product.title} className="h-full w-full object-cover" />
          </div>
          <Button className="h-12 w-full rounded-full text-lg font-semibold" size="lg">
            Read Chapter 1
          </Button>
        </aside>

        {/* Details */}
        <div className="space-y-6">
          <header>
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline" className="text-xs tracking-wider uppercase">
                {product.type}
              </Badge>
              <span className="text-muted-foreground flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {product.rating}
              </span>
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">{product.title}</h1>
            <p className="text-muted-foreground text-lg">by {product.author}</p>
          </header>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

          <div className="flex gap-4 border-t pt-4">
            <div className="px-4 text-center">
              <div className="text-xl font-bold">{product.latestChapter}</div>
              <div className="text-muted-foreground text-xs uppercase">Chapters</div>
            </div>
            <div className="border-l px-4 text-center">
              <div className="text-xl font-bold">{product.status}</div>
              <div className="text-muted-foreground text-xs uppercase">Status</div>
            </div>
            <div className="ml-auto">
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter List */}
      <section className="max-w-3xl">
        <Card className="overflow-hidden border-0 shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
              <List className="h-6 w-6" /> Chapters
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-card overflow-hidden rounded-xl border p-0">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="hover:bg-secondary/50 group flex cursor-pointer items-center justify-between border-b p-4 transition-colors last:border-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground w-8 font-mono text-sm">
                    #{product.latestChapter - i}
                  </span>
                  <span className="group-hover:text-primary font-medium transition-colors">
                    Chapter {product.latestChapter - i}
                  </span>
                </div>
                <span className="text-muted-foreground text-xs">2 days ago</span>
              </div>
            ))}
            <div className="bg-secondary/30 text-muted-foreground hover:text-foreground cursor-pointer p-4 text-center text-sm">
              Show all chapters
            </div>
          </CardContent>
        </Card>
      </section>
    </article>
  );
}
