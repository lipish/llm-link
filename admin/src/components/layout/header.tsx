import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          刷新
        </Button>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          添加 Provider
        </Button>
      </div>
    </header>
  )
}
