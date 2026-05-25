import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { getSession } from "@/lib/session-server";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={session.isLoggedIn} userName={session.name} pathname="/" />

      <main className="flex-1">
        <section className="flex flex-col items-center justify-center px-4 py-16 text-center sm:py-20 md:py-24">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your AI-Powered <br />
            <span className="text-primary">Study Companion</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Upload, organize, and get AI summaries of your study notes.
            Everything you need to ace your exams in one place.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">Get Started Free</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-muted/50 px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">How It Works</h2>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 md:grid-cols-3 md:gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">📤</div>
                  <h3 className="text-xl font-semibold">Upload Notes</h3>
                  <p className="mt-2 text-muted-foreground">
                    Upload your PDF study notes. Easy and fast.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold">Search & Organize</h3>
                  <p className="mt-2 text-muted-foreground">
                    Find any note instantly with powerful search.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-4xl mb-4">🤖</div>
                  <h3 className="text-xl font-semibold">AI Summaries</h3>
                  <p className="mt-2 text-muted-foreground">
                    Get instant AI-powered summaries of your notes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to Study Smarter?</h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Join thousands of students who use StudyHub AI.
            </p>
            <Link href="/register" className="mt-8 inline-block">
              <Button size="lg">Create Free Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © 2026 StudyHub AI. All rights reserved.
      </footer>
    </div>
  );
}
