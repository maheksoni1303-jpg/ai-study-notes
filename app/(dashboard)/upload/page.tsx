"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { uploadNote } from "@/actions/upload.actions"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const initialState = {
  success: false,
  error: "",
}

export default function UploadPage() {
  const [state, formAction] = useActionState(uploadNote, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      router.push("/notes")
    }
  }, [state.success, router])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Upload Notes</h1>
        <Link href="/notes">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      {state.error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {state.error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Study Notes</CardTitle>
          <CardDescription>
            Upload PDF files with title and description (max 200KB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter note title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                placeholder="e.g., Mathematics, Physics"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add a description for your note"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">PDF File (Optional, max 200KB)</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept=".pdf,application/pdf"
              />
            </div>

            <Button type="submit">Upload Note</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            You can also create notes without uploading a file. Just fill in the title and subject, and leave the file field empty.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
