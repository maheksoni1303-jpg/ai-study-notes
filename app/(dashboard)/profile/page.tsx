import Link from "next/link"
import { redirect } from "next/navigation"
import { getProfileData } from "@/actions/profile.actions"
import StatCard from "@/components/dashboard/stat-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookmarkIcon, FileTextIcon } from "@radix-ui/react-icons"

export default async function ProfilePage() {
  const profile = await getProfileData()

  if (!profile) {
    redirect("/login")
  }

  const statCards = [
    { label: "Uploaded Notes", value: profile._count.notes, icon: FileTextIcon },
    { label: "Bookmarks", value: profile._count.bookmarks, icon: BookmarkIcon },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Your account overview and recent activity</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{profile.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{profile.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="font-medium">
              {new Date(profile.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recently Uploaded Notes</CardTitle>
          <Link href="/notes" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {profile.notes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notes uploaded yet.</p>
          ) : (
            <ul className="space-y-3">
              {profile.notes.map((note) => (
                <li
                  key={note.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/notes/${note.id}`}
                      className="font-medium hover:text-primary transition-colors line-clamp-1"
                    >
                      {note.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="secondary">{note.subject}</Badge>
                      {note.filePath && (
                        <span className="text-xs text-primary">PDF</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
