"use client"

import { useTransition, useState } from "react"
import { deleteUserAsAdmin } from "@/actions/admin.actions"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: Date
  _count: { notes: number; bookmarks: number }
}

export default function UsersTable({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState("")

  function handleDelete() {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteUserAsAdmin(deleteId)
      if (!result.success) {
        setError(result.error || "Failed to delete")
      }
      setDeleteId(null)
    })
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No users found
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
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant={user.isAdmin ? "default" : "secondary"}>
                  {user.isAdmin ? "ADMIN" : "USER"}
                </Badge>
              </TableCell>
              <TableCell>{user._count.notes}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => setDeleteId(user.id)}
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete User</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete {user.name} ({user.email})?
                        This will also delete all their notes and bookmarks. This action cannot be undone.
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
