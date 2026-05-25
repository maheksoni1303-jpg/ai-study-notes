"use client"

import { useTransition, useState } from "react"
import Link from "next/link"
import { getBookmarks } from "@/actions/upload.actions"
import { toggleBookmark } from "@/actions/upload.actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface BookmarkWithNote {
  id: string
  noteId: string
  createdAt: Date
  note: {
    id: string
    title: string
    subject: string
    description: string
    filePath: string | null
    originalFileName: string | null
    fileSize: number | null
    createdAt: Date
    user: {
      name: string
    }
  }
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkWithNote[]>([])
  const [isPending, startTransition] = useTransition()
  const [loaded, setLoaded] = useState(false)

  async function loadBookmarks() {
    const data = await getBookmarks()
    setBookmarks(data as BookmarkWithNote[])
    setLoaded(true)
  }

  if (!loaded) {
    loadBookmarks()
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <p className="text-muted-foreground">Loading bookmarks...</p>
      </div>
    )
  }

  async function handleToggle(noteId: string) {
    startTransition(async () => {
      await toggleBookmark(noteId)
      await loadBookmarks()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookmarks</h1>
        <Link href="/upload">
          <Button>Add New Note</Button>
        </Link>
      </div>

      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No bookmarks yet</p>
            <p className="text-sm text-muted-foreground">
              Bookmark notes to save them for later
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1">{bookmark.note.title}</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggle(bookmark.noteId)}
                    disabled={isPending}
                  >
                    🔖
                  </Button>
                </div>
                <Badge variant="secondary">{bookmark.note.subject}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {bookmark.note.description || "No description"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {new Date(bookmark.note.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/notes/${bookmark.noteId}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}