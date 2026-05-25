import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session-server"
import { logoutUser } from "@/actions/auth.actions"
import { Button } from "@/components/ui/button"
import {
  FileTextIcon,
  BookmarkIcon,
  UploadIcon,
  ExitIcon,
} from "@radix-ui/react-icons"

export default async function DashboardPage() {
  const session = await getSession()

  const [noteCount, bookmarkCount] = await Promise.all([
    prisma.note.count({ where: { userId: session.userId } }),
    prisma.bookmark.count({ where: { userId: session.userId } }),
  ])

  const statCards = [
    { label: "Total Notes", value: noteCount, icon: FileTextIcon },
    { label: "Bookmarks", value: bookmarkCount, icon: BookmarkIcon },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {session.name}!</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s an overview of your study materials</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/notes" className="group">
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
              <FileTextIcon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold group-hover:text-primary transition-colors">My Notes</h3>
              <p className="text-sm text-muted-foreground mt-1">View and manage your study notes</p>
            </div>
          </Link>

          <Link href="/upload" className="group">
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
              <UploadIcon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold group-hover:text-primary transition-colors">Upload</h3>
              <p className="text-sm text-muted-foreground mt-1">Upload new PDF study materials</p>
            </div>
          </Link>

          <Link href="/bookmarks" className="group">
            <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
              <BookmarkIcon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold group-hover:text-primary transition-colors">Bookmarks</h3>
              <p className="text-sm text-muted-foreground mt-1">Access your saved bookmarks</p>
            </div>
          </Link>
        </div>
      </div>

      {session.isAdmin && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-orange-800">Admin Panel</h3>
              <p className="text-sm text-orange-600 mt-1">Manage users, notes, and platform settings</p>
            </div>
            <Link href="/admin">
              <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-100">
                Go to Admin
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <form action={logoutUser}>
          <Button variant="outline" type="submit" className="gap-2">
            <ExitIcon className="h-4 w-4" />
            Logout
          </Button>
        </form>
      </div>
    </div>
  )
}
