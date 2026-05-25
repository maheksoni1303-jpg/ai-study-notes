import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AdvancedNoteSearchProps {
  filters: {
    title: string
    subject: string
    tag: string
    sort: "newest" | "oldest"
  }
  subjects: string[]
  tags: string[]
}

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

export function AdvancedNoteSearch({
  filters,
  subjects,
  tags,
}: AdvancedNoteSearchProps) {
  return (
    <form action="/notes" className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <Input
          name="title"
          placeholder="Search title"
          defaultValue={filters.title}
          aria-label="Search notes by title"
        />

        <select
          name="subject"
          defaultValue={filters.subject}
          className={selectClassName}
          aria-label="Filter notes by subject"
        >
          <option value="">All subjects</option>
          {subjects.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>

        <select
          name="tag"
          defaultValue={filters.tag}
          className={selectClassName}
          aria-label="Filter notes by tag"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          name="sort"
          defaultValue={filters.sort}
          className={selectClassName}
          aria-label="Sort notes"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>

        <div className="flex gap-2">
          <Button type="submit" size="sm" className="h-9">
            Apply
          </Button>
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link href="/notes">Reset</Link>
          </Button>
        </div>
      </div>
    </form>
  )
}
