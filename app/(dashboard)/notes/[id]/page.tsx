"use client"

import dynamic from "next/dynamic"
import { notFound } from "next/navigation"
import Link from "next/link"
import { useTransition, useState, useEffect } from "react"
import { getNoteById } from "@/actions/note.actions"
import { toggleBookmark } from "@/actions/upload.actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const NoteSummarySection = dynamic(
  () => import("@/components/notes/note-summary-section"),
  {
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground">Loading AI summary...</p>
        </CardContent>
      </Card>
    ),
  }
)

interface PageProps {
  params: Promise<{ id: string }>
}

export default function NoteDetailPage({ params }: PageProps) {
  const [isPending, startTransition] = useTransition()
  const [note, setNote] = useState<Awaited<ReturnType<typeof getNoteById>>>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    params.then(({ id }) => {
      getNoteById(id).then((data) => {
        setNote(data)
        setIsLoaded(true)
      })
    })
  }, [params])

  function handleToggleBookmark() {
    if (!note) return
    startTransition(async () => {
      await toggleBookmark(note.id)
      const { id } = await params
      const updated = await getNoteById(id)
      setNote(updated)
    })
  }

  if (!isLoaded) return <div className="p-8">Loading...</div>
  if (!note) notFound()

  const isBookmarked = note.bookmarks.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Note Details</h1>
        <div className="flex gap-2">
          <Button
            variant={isBookmarked ? "default" : "outline"}
            size="sm"
            onClick={handleToggleBookmark}
            disabled={isPending}
          >
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Link href={`/notes/${note.id}/edit`}>
            <Button size="sm" variant="outline">
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-2xl">{note.title}</CardTitle>
            {note.filePath && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded shrink-0">
                PDF
              </span>
            )}
          </div>
          <Badge variant="secondary">{note.subject}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {note.description && (
            <p className="text-muted-foreground whitespace-pre-wrap">{note.description}</p>
          )}

          {note.filePath && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{note.originalFileName || "PDF File"}</p>
                {note.fileSize && (
                  <p className="text-sm text-muted-foreground">
                    {(note.fileSize / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              <a href={note.filePath} download={note.originalFileName || "download.pdf"}>
                <Button size="sm">Download PDF</Button>
              </a>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {note.filePath && <NoteSummarySection noteId={note.id} />}
    </div>
  )
}
