"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session-server"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { unlink } from "fs/promises"
import path from "path"

export type NotesSort = "newest" | "oldest"

export interface NotesFilters {
  title?: string
  subject?: string
  tag?: string
  sort?: NotesSort
}

export async function createNote(formData: FormData) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return { success: false, error: "Not authenticated" }
  }

  const title = formData.get("title") as string
  const subject = formData.get("subject") as string
  const description = formData.get("description") as string

  if (!title || !subject) {
    return { success: false, error: "Title and subject are required" }
  }

  await prisma.note.create({
    data: {
      title,
      subject,
      description: description || "",
      userId: session.userId,
    },
  })

  revalidatePath("/notes")
  redirect("/notes")
}

export async function getNotes(filters?: string | NotesFilters) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return []
  }

  const normalizedFilters =
    typeof filters === "string" ? { title: filters } : filters || {}

  const title = normalizedFilters.title?.trim()
  const subject = normalizedFilters.subject?.trim()
  const tag = normalizedFilters.tag?.trim()
  const sort = normalizedFilters.sort === "oldest" ? "asc" : "desc"

  const where: Prisma.NoteWhereInput = { userId: session.userId }

  if (title) {
    where.title = { contains: title }
  }

  if (subject) {
    where.subject = subject
  }

  if (tag) {
    where.tags = { contains: tag }
  }

  const notes = await prisma.note.findMany({
    where,
    orderBy: { createdAt: sort },
    include: {
      _count: {
        select: { bookmarks: true },
      },
    },
  })

  return notes
}

export async function getNoteSearchOptions() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return { subjects: [], tags: [] }
  }

  const notes = await prisma.note.findMany({
    where: { userId: session.userId },
    select: {
      subject: true,
      tags: true,
    },
    orderBy: { subject: "asc" },
  })

  const subjects = Array.from(
    new Set(notes.map((note) => note.subject).filter(Boolean))
  ).sort()

  const tags = Array.from(
    new Set(
      notes.flatMap((note) =>
        (note.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      )
    )
  ).sort()

  return { subjects, tags }
}

export async function getNoteById(id: string) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return null
  }

  const note = await prisma.note.findFirst({
    where: {
      id,
      userId: session.userId,
    },
    include: {
      bookmarks: {
        where: { userId: session.userId },
      },
    },
  })

  return note
}

export async function updateNote(id: string, formData: FormData) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return { success: false, error: "Not authenticated" }
  }

  const title = formData.get("title") as string
  const subject = formData.get("subject") as string
  const description = formData.get("description") as string

  if (!title || !subject) {
    return { success: false, error: "Title and subject are required" }
  }

  await prisma.note.update({
    where: { id },
    data: {
      title,
      subject,
      description: description || "",
    },
  })

  revalidatePath("/notes")
  revalidatePath(`/notes/${id}`)
  return { success: true }
}

export async function deleteNote(id: string) {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return { success: false, error: "Not authenticated" }
  }

  const note = await prisma.note.findUnique({
    where: { id },
    select: { filePath: true },
  })

  if (note?.filePath) {
    try {
      const fullPath = path.join(process.cwd(), note.filePath.replace(/^\//, ""))
      await unlink(fullPath)
    } catch (error) {
      console.error("Failed to delete file:", error)
    }
  }

  await prisma.note.delete({
    where: { id },
  })

  revalidatePath("/notes")
  redirect("/notes")
}

export async function getUserNotesCount() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return 0
  }

  return await prisma.note.count({
    where: { userId: session.userId },
  })
}

export async function getUserBookmarksCount() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return 0
  }

  return await prisma.bookmark.count({
    where: { userId: session.userId },
  })
}
