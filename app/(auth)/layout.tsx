import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session-server";
import Navbar from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "StudyHub AI - Landing",
  description: "Your AI-powered study companion",
};

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session.isLoggedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={session.isLoggedIn} userName={session.name} pathname="/login" />
      <main className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-12">
        {children}
      </main>
    </div>
  );
}