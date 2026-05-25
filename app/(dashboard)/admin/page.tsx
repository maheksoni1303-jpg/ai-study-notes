import { getSession } from "@/lib/session-server"
import { getAdminStats, getAdminUsers, getAdminNotes } from "@/actions/admin.actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonIcon, FileTextIcon, BookmarkIcon } from "@radix-ui/react-icons"
import UsersTable from "@/components/admin/users-table"
import NotesTable from "@/components/admin/note-owns-table"

export default async function AdminPage() {
  const session = await getSession()

  if (!session.isLoggedIn || !session.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You do not have permission to access this page. Only administrators can view this section.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const [stats, users, notes] = await Promise.all([
    getAdminStats(),
    getAdminUsers(),
    getAdminNotes(),
  ])

  const statCards = [
    { label: "Total Users", value: stats.userCount, icon: PersonIcon },
    { label: "Total Notes", value: stats.noteCount, icon: FileTextIcon },
    { label: "Total Bookmarks", value: stats.bookmarkCount, icon: BookmarkIcon },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage users, notes, and platform data</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <NotesTable notes={notes} />
        </CardContent>
      </Card>
    </div>
  )
}
