"use client"

import { useTransition, useState } from "react"
import Link from "next/link"
import { deleteNoteAsAdmin } from "@/actions/admin.actions"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"

interface Note {
  id: string
  title: string
  subject: string
  createdAt: Date
  user: { id: string; name: string; email: string }
  _count: { bookmarks: number }
}

export default function NotesTable({ notes }: { notes: Note[] }) {
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState("")

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteNoteAsAdmin(deleteId)
      if (!result.success) {
        setError(result.error || "Failed to delete")
      }
      setDeleteId(null)
    })
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No notes found
      </div>
    )
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Bookmarks</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.map((note) => (
            <TableRow key={note.id}>
              <TableCell className="font-medium">
                <Link href={`/notes/${note.id}`} className="hover:underline">
                  {note.title}
                </Link>
              </TableCell>
              <TableCell>{note.subject}</TableCell>
              <TableCell>{note.user.name}</TableCell>
              <TableCell>{note._count.bookmarks}</TableCell>
              <TableCell>{new Date(note.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => setDeleteId(note.id)}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Note</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{note.title}"?
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                      <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                        {isPending ? "Deleting..." : "Delete"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
