"use client"

import { useTransition, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateNote, deleteNote } from "@/actions/note.actions"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EditNotePage({ params }: PageProps) {
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError("")
    const { id } = await params
    startTransition(async () => {
      const result = await updateNote(id, formData)
      if (result && !result.success) {
        setError(result.error || "Update failed")
      }
    })
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this note?")) {
      const { id } = await params
      startTransition(async () => {
        await deleteNote(id)
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Note</h1>
        <Link href="/notes">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Note Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter note title"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="e.g., Mathematics, Physics"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add a description for your note"
                rows={5}
                disabled={isPending}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <div className="flex gap-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                Delete Note
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
