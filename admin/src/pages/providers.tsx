import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Header } from "@/components/layout/header"
import {
  Plus,
  Search,
  Play,
  Pencil,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react"

const providers = [
  {
    id: 1,
    name: "OpenAI GPT-4",
    type: "openai",
    status: "online",
    enabled: true,
    priority: 10,
    models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
    requests: 523,
    avgLatency: 234,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Anthropic Claude",
    type: "anthropic",
    status: "online",
    enabled: true,
    priority: 8,
    models: ["claude-3-opus", "claude-3-sonnet"],
    requests: 312,
    avgLatency: 189,
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "智谱 AI",
    type: "zhipu",
    status: "offline",
    enabled: false,
    priority: 6,
    models: ["glm-4", "glm-3-turbo"],
    requests: 156,
    avgLatency: 456,
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "阿里云通义",
    type: "aliyun",
    status: "online",
    enabled: true,
    priority: 5,
    models: ["qwen-turbo", "qwen-plus"],
    requests: 89,
    avgLatency: 312,
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    name: "火山引擎",
    type: "volcengine",
    status: "online",
    enabled: true,
    priority: 4,
    models: ["doubao-pro", "doubao-lite"],
    requests: 67,
    avgLatency: 278,
    createdAt: "2024-01-11",
  },
  {
    id: 6,
    name: "腾讯混元",
    type: "tencent",
    status: "online",
    enabled: true,
    priority: 3,
    models: ["hunyuan-pro", "hunyuan-standard"],
    requests: 45,
    avgLatency: 345,
    createdAt: "2024-01-10",
  },
]

export function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col">
      <Header title="Providers" description="管理您的 AI 服务提供商" />

      <div className="flex-1 space-y-6 p-6">
        {/* Search and Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜索 Providers..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            添加 Provider
          </Button>
        </div>

        {/* Providers Table */}
        <Card>
          <CardHeader>
            <CardTitle>所有 Providers</CardTitle>
            <CardDescription>
              共 {filteredProviders.length} 个 Provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名称</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>模型数量</TableHead>
                  <TableHead>请求数</TableHead>
                  <TableHead>平均延迟</TableHead>
                  <TableHead className="w-[100px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            provider.status === "online"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span className="font-medium">{provider.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{provider.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          provider.status === "online" ? "success" : "destructive"
                        }
                      >
                        {provider.status === "online" ? "在线" : "离线"}
                      </Badge>
                    </TableCell>
                    <TableCell>{provider.priority}</TableCell>
                    <TableCell>{provider.models.length}</TableCell>
                    <TableCell>{provider.requests}</TableCell>
                    <TableCell>{provider.avgLatency}ms</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" title="测试">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="编辑">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title={provider.enabled ? "禁用" : "启用"}
                        >
                          {provider.enabled ? (
                            <PowerOff className="h-4 w-4" />
                          ) : (
                            <Power className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
