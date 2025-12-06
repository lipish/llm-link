import { useState, useEffect } from "react"
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

interface Provider {
  id: number
  name: string
  provider_type: string
  config: string
  enabled: boolean
  priority: number
  created_at: string
  updated_at: string
}

export function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch providers from API
  useEffect(() => {
    fetchProviders()
  }, [])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/providers')
      const result = await response.json()
      
      if (result.success) {
        setProviders(result.data || [])
        setError(null)
      } else {
        setError(result.message || 'Failed to fetch providers')
      }
    } catch (err) {
      setError('Network error: Failed to fetch providers')
      console.error('Error fetching providers:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleProvider = async (id: number) => {
    try {
      const response = await fetch(`/api/providers/${id}/toggle`, {
        method: 'POST'
      })
      const result = await response.json()
      
      if (result.success) {
        // Update the provider in the local state
        setProviders(providers.map(p => 
          p.id === id ? result.data : p
        ))
      } else {
        alert(result.message || 'Failed to toggle provider')
      }
    } catch (err) {
      alert('Network error: Failed to toggle provider')
      console.error('Error toggling provider:', err)
    }
  }

  const deleteProvider = async (id: number) => {
    if (!confirm('Are you sure you want to delete this provider?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      
      if (result.success) {
        // Remove the provider from local state
        setProviders(providers.filter(p => p.id !== id))
      } else {
        alert(result.message || 'Failed to delete provider')
      }
    } catch (err) {
      alert('Network error: Failed to delete provider')
      console.error('Error deleting provider:', err)
    }
  }

  const addProviderWith = async (providerData: {
    name: string
    provider_type: string
    config: string
    enabled: boolean
    priority: number
  }) => {
    try {
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(providerData)
      })
      const result = await response.json()
      
      if (result.success) {
        // Add the new provider to local state
        setProviders([result.data, ...providers])
        alert('Provider 添加成功！')
      } else {
        alert(result.message || 'Failed to add provider')
      }
    } catch (err) {
      alert('Network error: Failed to add provider')
      console.error('Error adding provider:', err)
    }
  }

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.provider_type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col">
      <Header title="Providers" description="管理您的 AI 服务提供商" />

      <div className="flex-1 space-y-6 p-6">
        {/* Loading and Error States */}
        {loading && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading providers...</div>
            </CardContent>
          </Card>
        )}
        
        {error && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-500">{error}</div>
              <div className="text-center mt-2">
                <Button onClick={fetchProviders}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Actions */}
        {!loading && !error && (
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
            <Button onClick={() => {
              const name = prompt('请输入 Provider 名称：')
              if (!name) return
              
              const type = prompt('请输入 Provider 类型 (openai/anthropic/zhipu/aliyun/baidu/tencent/volcengine)：')
              if (!type) return
              
              const apiKey = prompt('请输入 API Key：')
              if (!apiKey) return
              
              const model = prompt('请输入模型名称 (如 gpt-4)：')
              if (!model) return
              
              const priority = prompt('请输入优先级 (1-100)：') || '10'
              
              const newProvider = {
                name,
                provider_type: type,
                config: JSON.stringify({ api_key: apiKey, model }),
                enabled: true,
                priority: parseInt(priority) || 10
              }
              
              // Call addProvider function
              addProviderWith(newProvider)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              添加 Provider
            </Button>
          </div>
        )}

        {/* Providers Table */}
        {!loading && !error && (
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
                    <TableHead>创建时间</TableHead>
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
                              provider.enabled ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <span className="font-medium">{provider.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{provider.provider_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={provider.enabled ? "success" : "destructive"}
                        >
                          {provider.enabled ? "启用" : "禁用"}
                        </Badge>
                      </TableCell>
                      <TableCell>{provider.priority}</TableCell>
                      <TableCell>{new Date(provider.created_at).toLocaleDateString()}</TableCell>
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
                            onClick={() => toggleProvider(provider.id)}
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
                            onClick={() => deleteProvider(provider.id)}
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
        )}
      </div>
    </div>
  )
}
