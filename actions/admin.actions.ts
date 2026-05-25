"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session-server"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await getSession()
  if (!session.isLoggedIn || !session.isAdmin) {
    throw new Error("Unauthorized")
  }
  return session
}

export async function getAdminStats() {
  await requireAdmin()

  const [userCount, noteCount, bookmarkCount] = await Promise.all([
    prisma.user.count(),
    prisma.note.count(),
    prisma.bookmark.count(),
  ])

  return { userCount, noteCount, bookmarkCount }
}

export async function getAdminUsers() {
  await requireAdmin()

  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      createdAt: true,
      _count: { select: { notes: true, bookmarks: true } },
    },
  })
}

export async function getAdminNotes() {
  await requireAdmin()

  return await prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { bookmarks: true } },
    },
  })
}

export async function deleteUserAsAdmin(userId: string) {
  const session = await requireAdmin()

  if (session.userId === userId) {
    return { success: false, error: "Cannot delete yourself" }
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { isAdmin: true },
  })

  if (targetUser?.isAdmin) {
    return { success: false, error: "Cannot delete another admin" }
  }

  try {
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Delete user error:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export async function deleteNoteAsAdmin(noteId: string) {
  await requireAdmin()

  try {
    await prisma.note.delete({ where: { id: noteId } })
    revalidatePath("/admin")
    return { success: true }
  } catch (error) {
    console.error("Delete note error:", error)
    return { success: false, error: "Failed to delete note" }
  }
}
