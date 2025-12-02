import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Server,
  Activity,
  Zap,
  Clock,
  TrendingUp,
  MoreHorizontal,
  Play,
  Pencil,
  Trash2,
} from "lucide-react"

const stats = [
  {
    title: "总 Providers",
    value: "6",
    change: "+2",
    changeType: "positive" as const,
    icon: Server,
  },
  {
    title: "在线 Providers",
    value: "5",
    change: "+1",
    changeType: "positive" as const,
    icon: Activity,
  },
  {
    title: "今日请求",
    value: "1,234",
    change: "+24%",
    changeType: "positive" as const,
    icon: Zap,
  },
  {
    title: "平均延迟",
    value: "245ms",
    change: "-12%",
    changeType: "positive" as const,
    icon: Clock,
  },
]

const recentProviders = [
  {
    id: 1,
    name: "OpenAI GPT-4",
    type: "openai",
    status: "online",
    priority: 10,
    requests: 523,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Anthropic Claude",
    type: "anthropic",
    status: "online",
    priority: 8,
    requests: 312,
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "智谱 AI",
    type: "zhipu",
    status: "offline",
    priority: 6,
    requests: 156,
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "阿里云通义",
    type: "aliyun",
    status: "online",
    priority: 5,
    requests: 89,
    createdAt: "2024-01-12",
  },
]

export function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="仪表板" description="LLM Link 多 Provider AI 网关概览" />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span
                    className={
                      stat.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>{" "}
                  较上周
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-7">
          {/* Providers Table */}
          <Card className="md:col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>最近的 Providers</CardTitle>
                  <CardDescription>
                    管理您的 AI 服务提供商
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  查看全部
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名称</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">请求数</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell className="font-medium">
                        {provider.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{provider.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            provider.status === "online"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {provider.status === "online" ? "在线" : "离线"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {provider.requests}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
              <CardDescription>常用功能快捷入口</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Play className="mr-2 h-4 w-4" />
                测试所有 Providers
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                批量编辑配置
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                查看性能报告
              </Button>
              <Button
                className="w-full justify-start"
                variant="outline"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                清理无效 Providers
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>系统状态</CardTitle>
            <CardDescription>实时监控系统运行状态</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">API 网关</p>
                  <p className="text-xs text-muted-foreground">运行正常</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <div>
                  <p className="text-sm font-medium">数据库</p>
                  <p className="text-xs text-muted-foreground">连接正常</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div>
                  <p className="text-sm font-medium">缓存服务</p>
                  <p className="text-xs text-muted-foreground">负载较高</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
