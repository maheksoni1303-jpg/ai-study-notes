"use client"

import { useEffect, useTransition, useState } from "react"
import { generateSummary, getSummaryForNote } from "@/actions/summary.actions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface NoteSummary {
  content: string
  createdAt: Date
}

interface NoteSummarySectionProps {
  noteId: string
}

export default function NoteSummarySection({ noteId }: NoteSummarySectionProps) {
  const [summary, setSummary] = useState<NoteSummary | null>(null)
  const [summaryLoaded, setSummaryLoaded] = useState(false)
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let cancelled = false

    getSummaryForNote(noteId).then((data) => {
      if (!cancelled) {
        setSummary(data)
        setSummaryLoaded(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [noteId])

  function handleGenerate() {
    setError("")
    startTransition(async () => {
      const result = await generateSummary(noteId)
      if (result.success && result.content) {
        setSummary({ content: result.content, createdAt: new Date() })
      } else {
        setError(result.error || "Failed to generate summary")
      }
    })
  }

  if (!summaryLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading summary...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Summary</CardTitle>
        <CardDescription>
          Generated locally from your PDF content. No API keys required.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary ? (
          <>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{summary.content}</p>
            <p className="text-xs text-muted-foreground">
              Generated {new Date(summary.createdAt).toLocaleString()}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleGenerate}
              disabled={isPending}
            >
              {isPending ? "Regenerating..." : "Regenerate Summary"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Generate a summary from the uploaded PDF. The first run may take a
              minute while the local model downloads.
            </p>
            <Button type="button" onClick={handleGenerate} disabled={isPending}>
              {isPending ? "Generating..." : "Generate Summary"}
            </Button>
          </>
        )}

        {isPending && (
          <p className="text-sm text-muted-foreground">
            Running local AI summarization. Please wait...
          </p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}
