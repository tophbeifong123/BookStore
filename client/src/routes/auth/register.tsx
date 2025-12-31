// ===========================================
// Register Page
// ===========================================

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRegister } from "@/hooks";
import { BookOpen, Loader2, Mail, Lock, User, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({
      email,
      username,
      password,
      displayName: displayName || undefined,
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <BookOpen className="text-primary h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Join us and start reading today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {register.error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                {register.error.message}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <div className="relative">
                <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="johndoe"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength={3}
                />
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Display Name <span className="text-muted-foreground">(optional)</span>
              </label>
              <div className="relative">
                <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="John Doe"
                  className="pl-10"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <p className="text-muted-foreground text-xs">Must be at least 6 characters</p>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-muted-foreground mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
