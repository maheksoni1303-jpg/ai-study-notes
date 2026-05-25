import Link from "next/link"
import { redirect } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import { Toaster } from "@/components/ui/toaster"
import { getSession } from "@/lib/session-server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session.isLoggedIn) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <Navbar isLoggedIn={session.isLoggedIn} userName={session.name} pathname="/dashboard" />
      
      <div className="flex min-w-0 flex-1">
        <aside className="w-64 border-r bg-muted/30 p-4 hidden md:block">
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/notes"
              className="block px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              My Notes
            </Link>
            <Link
              href="/upload"
              className="block px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              Upload
            </Link>
            <Link
              href="/bookmarks"
              className="block px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              Bookmarks
            </Link>
            <Link
              href="/profile"
              className="block px-4 py-2 rounded-lg hover:bg-accent transition-colors"
            >
              Profile
            </Link>
            {session.isAdmin && (
              <Link
                href="/admin"
                className="block px-4 py-2 rounded-lg hover:bg-accent transition-colors text-orange-600 font-medium"
              >
                Admin
              </Link>
            )}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  )
}
