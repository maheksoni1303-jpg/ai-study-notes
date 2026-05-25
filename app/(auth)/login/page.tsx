"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/actions/auth.actions";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await loginUser(formData);
      if (result && !result.success) {
        setError(result.error || "Login failed");
      }
    });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}