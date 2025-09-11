import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from './AuthContext'
import Login from './Login'
import Register from './Register'
import {
  Satellite,
  Shield,
  Activity,
  AlertTriangle,
  Download,
  RefreshCw,
  BarChart3,
  Clock,
  Filter,
  Search,
  Moon,
  Sun,
  TrendingUp,
  Zap,
  Globe,
  Wifi,
  WifiOff,
  Bell,
  Settings,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Upload,
  RotateCcw,
  Save,
  ChevronRight,
  ExternalLink,
  Brain,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Slider } from '@/components/ui/slider.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Toaster } from '@/components/ui/sonner.jsx'
import { toast } from 'sonner'

import './App.css'

// Simple Analytics Component (placeholder)
const AdvancedAnalytics = ({ logs, agents }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">
            AI-powered insights and predictive analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium mb-2">Threat Pattern Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  AI has detected unusual activity patterns in the last 24 hours. 
                  Risk levels have increased by 15% compared to the previous week.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="font-medium mb-2">System Health</h4>
                <p className="text-sm text-muted-foreground">
                  All agents are performing within normal parameters. 
                  No anomalies detected in system behavior.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Predictive Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <h4 className="font-medium mb-2">Potential Risk Spike</h4>
                <p className="text-sm text-muted-foreground">
                  Based on current trends, there's a 70% probability of increased 
                  security events in the next 6 hours.
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <h4 className="font-medium mb-2">Resource Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  Consider scaling agent deployment in the US-East region 
                  to handle predicted load increase.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Main App Content Component
const MainDashboard = () => {
  const [logs, setLogs] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState([0, 100])
  const [senderFilter, setSenderFilter] = useState('all')
  const [contextFilter, setContextFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('https://sentinelmesh-api.onrender.com/logs')

      if (response.ok) {
        const data = await response.json()
        setLogs(Array.isArray(data.logs) ? data.logs : [])
        
        // Generate mock agents data from logs
        const uniqueSenders = [...new Set((data.logs || []).map(log => log.sender))]
        const mockAgents = uniqueSenders.map(sender => ({
          id: sender,
          name: sender,
          status: Math.random() > 0.2 ? 'online' : 'offline',
          lastSeen: new Date(Date.now() - Math.random() * 3600000).toISOString(),
          version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
          location: ['US-East', 'EU-West', 'Asia-Pacific'][Math.floor(Math.random() * 3)],
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100),
          network: Math.floor(Math.random() * 100)
        }))
        setAgents(Array.isArray(mockAgents) ? mockAgents : [])
      } else {
        console.error('Failed to fetch data')
        setLogs([])
        setAgents([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setLogs([])
      setAgents([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Auto-refresh effect
  useEffect(() => {
    fetchData()
    
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [fetchData, autoRefresh])

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Filter logs based on current filters
  const filteredLogs = useMemo(() => {
    if (!Array.isArray(logs)) return []
    
    return logs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.payload?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.context?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRisk = log.risk >= riskFilter[0] && log.risk <= riskFilter[1]
      const matchesSender = senderFilter === 'all' || log.sender === senderFilter
      const matchesContext = contextFilter === 'all' || log.context === contextFilter
      
      return matchesSearch && matchesRisk && matchesSender && matchesContext
    })
  }, [logs, searchTerm, riskFilter, senderFilter, contextFilter])

  // Get unique senders and contexts for filters
  const uniqueSenders = useMemo(() => {
    if (!Array.isArray(logs)) return []
    return [...new Set(logs.map(log => log.sender).filter(Boolean))]
  }, [logs])

  const uniqueContexts = useMemo(() => {
    if (!Array.isArray(logs)) return []
    return [...new Set(logs.map(log => log.context).filter(Boolean))]
  }, [logs])

  // Calculate stats
  const stats = useMemo(() => {
    if (!Array.isArray(logs) || !Array.isArray(agents)) {
      return {
        totalLogs: 0,
        highRiskLogs: 0,
        activeAgents: 0,
        avgRiskScore: 0
      }
    }

    const totalLogs = logs.length
    const highRiskLogs = logs.filter(log => log.risk > 70).length
    const activeAgents = agents.filter(agent => agent.status === 'online').length
    const avgRiskScore = logs.length > 0 
      ? Math.round(logs.reduce((sum, log) => sum + log.risk, 0) / logs.length)
      : 0

    return {
      totalLogs,
      highRiskLogs,
      activeAgents,
      avgRiskScore
    }
  }, [logs, agents])

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!Array.isArray(logs)) return []
    
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const recentLogs = logs.filter(log => new Date(log.timestamp) > last24Hours)
    
    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(Date.now() - (23 - i) * 60 * 60 * 1000).getHours()
      const hourLogs = recentLogs.filter(log => 
        new Date(log.timestamp).getHours() === hour
      )
      
      return {
        hour: `${hour}:00`,
        logs: hourLogs.length,
        risk: hourLogs.length > 0 
          ? Math.round(hourLogs.reduce((sum, log) => sum + log.risk, 0) / hourLogs.length)
          : 0
      }
    })
    
    return hourlyData
  }, [logs])

  const riskDistribution = useMemo(() => {
    if (!Array.isArray(logs)) return []
    
    const ranges = [
      { name: 'Low (0-30)', min: 0, max: 30, color: '#10b981' },
      { name: 'Medium (31-60)', min: 31, max: 60, color: '#f59e0b' },
      { name: 'High (61-80)', min: 61, max: 80, color: '#f97316' },
      { name: 'Critical (81-100)', min: 81, max: 100, color: '#ef4444' }
    ]
    
    return ranges.map(range => ({
      name: range.name,
      value: logs.filter(log => log.risk >= range.min && log.risk <= range.max).length,
      color: range.color
    }))
  }, [logs])

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and analytics for your AI agent mesh
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogs.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highRiskLogs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalLogs > 0 ? Math.round((stats.highRiskLogs / stats.totalLogs) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeAgents}</div>
            <p className="text-xs text-muted-foreground">
              {agents.length} total agents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRiskScore}</div>
            <p className="text-xs text-muted-foreground">
              -5% from yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>
              Logs and risk levels over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="logs" fill="#3b82f6" name="Logs" />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#ef4444" 
                  name="Avg Risk" 
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>
              Breakdown of events by risk level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // Agents Component
  const Agents = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Agent Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          placeholder="Search agents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
          icon={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        <Select value={senderFilter} onValueChange={setSenderFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
        <Select value={contextFilter} onValueChange={setContextFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="US-East">US-East</SelectItem>
            <SelectItem value="EU-West">EU-West</SelectItem>
            <SelectItem value="Asia-Pacific">Asia-Pacific</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agent List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map(agent => (
          <Card key={agent.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Satellite className="h-4 w-4" />
                {agent.name}
              </CardTitle>
              <Badge variant={agent.status === 'online' ? 'default' : 'destructive'}>
                {agent.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">Version: {agent.version}</p>
              <p className="text-xs text-muted-foreground">Location: {agent.location}</p>
              <p className="text-xs text-muted-foreground">Last Seen: {new Date(agent.lastSeen).toLocaleString()}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BarChart3 className="h-3 w-3" /> CPU: {agent.cpu}%
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3" /> Memory: {agent.memory}%
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Globe className="h-3 w-3" /> Network: {agent.network}%
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // Logs Component
  const Logs = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Logs</h1>
          <p className="text-muted-foreground">
            Detailed log entries from all agents
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Log Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
          icon={<Search className="h-4 w-4 text-muted-foreground" />}
        />
        <Select value={senderFilter} onValueChange={setSenderFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Sender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Senders</SelectItem>
            {uniqueSenders.map(sender => (
              <SelectItem key={sender} value={sender}>{sender}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={contextFilter} onValueChange={setContextFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Context" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contexts</SelectItem>
            {uniqueContexts.map(context => (
              <SelectItem key={context} value={context}>{context}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Label htmlFor="risk-filter">Risk Score:</Label>
          <Slider
            id="risk-filter"
            min={0}
            max={100}
            step={1}
            value={riskFilter}
            onValueChange={setRiskFilter}
            className="w-[200px]"
          />
          <span className="text-sm text-muted-foreground">{riskFilter[0]} - {riskFilter[1]}</span>
        </div>
      </div>

      {/* Log List */}
      <ScrollArea className="h-[600px] w-full rounded-md border p-4">
        <div className="space-y-4">
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <Card key={log.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {new Date(log.timestamp).toLocaleString()}
                  </CardTitle>
                  <Badge variant={log.risk > 70 ? 'destructive' : log.risk > 30 ? 'warning' : 'default'}>
                    Risk: {log.risk}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Sender: {log.sender}</p>
                  <p className="text-sm text-muted-foreground">Receiver: {log.receiver}</p>
                  <p className="text-sm text-muted-foreground">Context: {log.context}</p>
                  <p className="text-sm">Payload: {log.payload}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground">No logs found matching your criteria.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  )

  return (
    <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center px-4">
          <div className="mr-4 hidden md:flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">SentinelMesh</span>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
              <TabsList>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground"
              thumbClassName="data-[state=checked]:bg-primary-foreground data-[state=unchecked]:bg-background"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Moon className="h-4 w-4 text-primary-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
            </Switch>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
              className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-foreground"
              thumbClassName="data-[state=checked]:bg-primary-foreground data-[state=unchecked]:bg-background"
              aria-label="Toggle auto-refresh"
            >
              <RefreshCw className="h-4 w-4 text-primary-foreground" />
            </Switch>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                    className="mr-2"
                  />
                  Enable Notifications
                </DropdownMenuItem>
                <DropdownMenuItem>New high-risk event detected.</DropdownMenuItem>
                <DropdownMenuItem>Agent 'alpha-01' went offline.</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>API Keys</DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.reload()}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-background border-b border-border/40 p-4"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
              <TabsList className="flex flex-col space-y-2">
                <TabsTrigger value="dashboard" className="w-full">Dashboard</TabsTrigger>
                <TabsTrigger value="agents" className="w-full">Agents</TabsTrigger>
                <TabsTrigger value="logs" className="w-full">Logs</TabsTrigger>
                <TabsTrigger value="analytics" className="w-full">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 container py-8 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>
            <TabsContent value="agents">
              <Agents />
            </TabsContent>
            <TabsContent value="logs">
              <Logs />
            </TabsContent>
            <TabsContent value="analytics">
              <AdvancedAnalytics logs={logs} agents={agents} />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} SentinelMesh. All rights reserved.
      </footer>
    </div>
  )
}

// Main App Component with Authentication
const App = () => {
  const { isAuthenticated, isLoading, logout } = useAuth()
  const [authMode, setAuthMode] = useState('login')

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Satellite className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading SentinelMesh...</p>
        </div>
      </div>
    )
  }

  // Show login/register screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-surface relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="glass-card backdrop-blur-xl">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-primary-glow"
                >
                  <Satellite className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <h1 className="text-4xl font-display font-bold mb-2 gradient-text">SentinelMesh</h1>
                <p className="text-muted-foreground">AI Agent Security Monitor</p>
              </div>
              
              {authMode === 'login' ? (
                <Login onSwitchToRegister={() => setAuthMode('register')} />
              ) : (
                <Register onSwitchToLogin={() => setAuthMode('login')} />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Show main dashboard if authenticated
  return <MainDashboard />
}

export default App;