import Link from "next/link"
import { getNotes, getNoteSearchOptions, type NotesSort } from "@/actions/note.actions"
import { AdvancedNoteSearch } from "@/components/notes/advanced-note-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface NotesPageProps {
  searchParams: Promise<{
    title?: string
    subject?: string
    tag?: string
    sort?: NotesSort
  }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const params = await searchParams
  const filters = {
    title: params.title || "",
    subject: params.subject || "",
    tag: params.tag || "",
    sort: params.sort === "oldest" ? "oldest" : "newest",
  } satisfies {
    title: string
    subject: string
    tag: string
    sort: NotesSort
  }

  const [notes, searchOptions] = await Promise.all([
    getNotes(filters),
    getNoteSearchOptions(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Link href="/upload">
          <Button>Add New Note</Button>
        </Link>
      </div>

      <AdvancedNoteSearch
        filters={filters}
        subjects={searchOptions.subjects}
        tags={searchOptions.tags}
      />

      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No notes found</p>
            <Link href="/upload">
              <Button variant="outline">Upload your first note</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note: { id: string; title: string; subject: string; tags: string | null; description: string; filePath: string | null; createdAt: Date }) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1">{note.title}</CardTitle>
                  {note.filePath && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      PDF
                    </span>
                  )}
                </div>
                <Badge variant="secondary">{note.subject}</Badge>
                {note.tags && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {note.tags}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {note.description || "No description"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/notes/${note.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    <Link href={`/notes/${note.id}/edit`}>
                      <Button size="sm" variant="ghost">Edit</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
