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
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader className="space-y-4 pt-12">
          <div className="text-8xl font-bold text-primary/20 mb-4">404</div>
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
          <CardDescription className="text-base">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate(-1)} variant="outline" size="lg">
              ← Go Back
            </Button>
            <Link to="/">
              <Button size="lg">Go to Home</Button>
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex-col space-y-3 border-t pt-6 pb-12">
          <p className="text-sm text-muted-foreground">
            You might be interested in:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/products">
              <Button variant="ghost" size="sm">
                Browse Products
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" size="sm">
                About Us
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
