import type { ComponentType } from "react"

interface StatCardProps {
  label: string
  value: number | string
  icon: ComponentType<{ className?: string }>
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
