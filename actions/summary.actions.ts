"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session-server"

async function getOwnedNote(noteId: string, userId: string) {
  return prisma.note.findFirst({
    where: {
      id: noteId,
      userId,
    },
    select: {
      id: true,
      filePath: true,
    },
  })
}

export async function getSummaryForNote(noteId: string) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return null
  }

  const note = await getOwnedNote(noteId, session.userId)
  if (!note) {
    return null
  }

  try {
    return await prisma.summary.findUnique({
      where: { noteId: note.id },
      select: {
        content: true,
        createdAt: true,
      },
    })
  } catch (error) {
    console.error("getSummaryForNote error:", error)
    return null
  }
}

export async function generateSummary(noteId: string) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return { success: false, error: "Not authenticated" }
  }

  const note = await getOwnedNote(noteId, session.userId)
  if (!note) {
    return { success: false, error: "Note not found" }
  }

  if (!note.filePath) {
    return { success: false, error: "Upload a PDF to generate a summary" }
  }

  try {
    const { extractPdfText } = await import("@/lib/ai/extract-text")
    const { summarizeText } = await import("@/lib/ai/summarize")

    const text = await extractPdfText(note.filePath)
    const content = await summarizeText(text)

    await prisma.summary.upsert({
      where: { noteId: note.id },
      create: {
        noteId: note.id,
        content,
      },
      update: {
        content,
      },
    })

    return { success: true, content }
  } catch (error) {
    console.error("Summary generation error:", error)
    const message =
      error instanceof Error ? error.message : "Failed to generate summary"
    return { success: false, error: message }
  }
}
