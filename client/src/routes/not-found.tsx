import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4 pt-12">
          <div className="text-primary/20 mb-4 text-8xl font-bold">404</div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <CardDescription className="text-base">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={() => navigate(-1)} variant="outline" size="lg">
              ← Go Back
            </Button>
            <Link to="/">
              <Button size="lg">Go to Home</Button>
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex-col space-y-3 border-t pt-6 pb-12">
          <p className="text-muted-foreground text-sm">You might be interested in:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/products">
              <Button variant="ghost" size="sm">
                Browse Products
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
}
