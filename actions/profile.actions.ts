"use server"

import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/session-server"

export async function getProfileData() {
  const session = await getSession()
  if (!session.isLoggedIn) {
    return null
  }

  return prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          notes: true,
          bookmarks: true,
        },
      },
      notes: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          subject: true,
          createdAt: true,
          filePath: true,
        },
      },
    },
  })
}
