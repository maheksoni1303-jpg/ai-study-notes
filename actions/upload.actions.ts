"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session-server"
import { saveFile, validateFile } from "@/lib/upload"
import { revalidatePath } from "next/cache"

export async function uploadNote(_prevState: { success: boolean; error: string }, formData: FormData) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return { success: false, error: "Not authenticated" }
  }

  const title = formData.get("title") as string
  const subject = formData.get("subject") as string
  const description = formData.get("description") as string
  const file = formData.get("file") as File

  if (!title || !subject) {
    return { success: false, error: "Title and subject are required" }
  }

  let fileData = { filePath: "", originalFileName: "", fileSize: 0 }

  if (file && file.size > 0) {
    const validationError = validateFile(file)
    if (validationError) return { success: false, error: validationError }

    const result = await saveFile(file)
    if (!result.success || !result.filePath) {
      return { success: false, error: result.error || "Failed to upload file" }
    }

    fileData = {
      filePath: result.filePath,
      originalFileName: result.originalFileName || file.name,
      fileSize: result.fileSize || 0,
    }
  }

  try {
    await prisma.note.create({
      data: {
        title,
        subject,
        description: description || "",
        userId: session.userId,
        filePath: fileData.filePath || null,
        originalFileName: fileData.originalFileName || null,
        fileSize: fileData.fileSize || null,
      },
    })

    revalidatePath("/notes")
    return { success: true, error: "" }
  } catch (error) {
    console.error("Database error:", error)
    return { success: false, error: "Failed to save to database" }
  }
}

export async function getBookmarks() {
  const session = await getSession()
  if (!session.isLoggedIn) return []

  return await prisma.bookmark.findMany({
    where: { userId: session.userId },
    include: {
      note: { include: { user: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function toggleBookmark(noteId: string) {
  const session = await getSession()
  if (!session.isLoggedIn) return { success: false, error: "Not authenticated" }

  const existing = await prisma.bookmark.findFirst({ where: { userId: session.userId, noteId } })

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } })
    return { success: true, bookmarked: false }
  } else {
    await prisma.bookmark.create({ data: { userId: session.userId, noteId } })
    return { success: true, bookmarked: true }
  }
}

export async function getBookmarksCount() {
  const session = await getSession()
  if (!session.isLoggedIn) return 0
  return await prisma.bookmark.count({ where: { userId: session.userId } })
}
