import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Target,
  Users,
  Server,
  Lock,
  Sparkles,
  Layers,
  Command,
  Cpu,
  Database,
  GitBranch,
  Hash,
  Layout,
  Terminal
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
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
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

// Import new components
import AnimatedBackground from '@/components/AnimatedBackground.jsx'
import FloatingActionButton from '@/components/FloatingActionButton.jsx'
import ParticleText from '@/components/ParticleText.jsx'
import CommandPalette from '@/components/CommandPalette.jsx'
import NotificationCenter from '@/components/NotificationCenter.jsx'

import './App.css'

// Modern Analytics Component with Premium Design
const AdvancedAnalytics = ({ logs, agents }) => {
  const chartData = [
    { name: 'Mon', threats: 4, resolved: 3, pending: 1 },
    { name: 'Tue', threats: 7, resolved: 5, pending: 2 },
    { name: 'Wed', threats: 3, resolved: 3, pending: 0 },
    { name: 'Thu', threats: 8, resolved: 6, pending: 2 },
    { name: 'Fri', threats: 5, resolved: 4, pending: 1 },
    { name: 'Sat', threats: 2, resolved: 2, pending: 0 },
    { name: 'Sun', threats: 4, resolved: 3, pending: 1 }
  ]

  const pieData = [
    { name: 'Low Risk', value: 45, color: '#14F195' },
    { name: 'Medium Risk', value: 30, color: '#FFB800' },
    { name: 'High Risk', value: 20, color: '#FF6B6B' },
    { name: 'Critical', value: 5, color: '#9945FF' }
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-vibrant p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Advanced Analytics</h1>
          <p className="text-white/80 text-lg">AI-powered insights and predictive analysis</p>
        </div>
        <Sparkles className="absolute -right-8 -top-8 h-48 w-48 text-white/10" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Threats', value: '1,234', change: '+12%', icon: Shield, color: 'from-purple-500 to-pink-500' },
          { label: 'Active Agents', value: '89', change: '+5%', icon: Users, color: 'from-blue-500 to-cyan-500' },
          { label: 'Response Time', value: '1.2s', change: '-8%', icon: Zap, color: 'from-green-500 to-emerald-500' },
          { label: 'Success Rate', value: '99.8%', change: '+2%', icon: CheckCircle, color: 'from-orange-500 to-yellow-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-card border-0 overflow-hidden group hover:shadow-neon transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="badge-glass">
                    {stat.change}
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold gradient-text-premium">{stat.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Threat Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9945FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#9945FF" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14F195" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#14F195" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Area type="monotone" dataKey="threats" stroke="#9945FF" fillOpacity={1} fill="url(#colorThreats)" />
                <Area type="monotone" dataKey="resolved" stroke="#14F195" fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="card-premium border-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-primary/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    Threat Pattern Analysis
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    AI has detected unusual activity patterns in the last 24 hours. 
                    Risk levels have increased by 15% compared to the previous week.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    System Health
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    All agents are performing within normal parameters. 
                    No anomalies detected in system behavior.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="card-premium border-0 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Predictive Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    Potential Risk Spike
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Based on current trends, there's a 70% probability of increased 
                    security events in the next 6 hours.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-500" />
                    Resource Optimization
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Consider scaling agent deployment in the US-East region 
                    to handle predicted load increase.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Main App Content Component with Premium Design
const MainDashboard = () => {
  const [logs, setLogs] = useState([])
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [riskFilter, setRiskFilter] = useState([0, 100])
  const [senderFilter, setSenderFilter] = useState('all')
  const [contextFilter, setContextFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('24h')
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false)
  const [backgroundVariant, setBackgroundVariant] = useState('particles')

  // Command palette shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('https://sentinelmesh-api.onrender.com/logs')

      if (response.ok) {
        const data = await response.json()
        setLogs(Array.isArray(data.logs) ? data.logs : [])
        
        // Generate mock agents data from logs
        const uniqueSenders = [...new Set((data.logs || []).map(log => log.sender))]
        const mockAgents = uniqueSenders.map((sender, index) => ({
          id: index + 1,
          name: sender,
          status: Math.random() > 0.2 ? 'online' : 'offline',
          logs: (data.logs || []).filter(log => log.sender === sender).length,
          lastSeen: new Date().toISOString()
        }))
        setAgents(mockAgents)
      } else {
        console.error('Failed to fetch logs')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh logic
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh, fetchData])

  // Filter logs based on search and filters
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.context?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRisk = log.risk_score >= riskFilter[0] && log.risk_score <= riskFilter[1]
      const matchesSender = senderFilter === 'all' || log.sender === senderFilter
      const matchesContext = contextFilter === 'all' || log.context === contextFilter
      
      return matchesSearch && matchesRisk && matchesSender && matchesContext
    })
  }, [logs, searchTerm, riskFilter, senderFilter, contextFilter])

  // Get unique senders and contexts for filters
  const uniqueSenders = [...new Set(logs.map(log => log.sender))]
  const uniqueContexts = [...new Set(logs.map(log => log.context))]

  // Tab items for navigation
  const tabItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Premium Navigation Bar */}
      <nav className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 rounded-xl bg-gradient-primary shadow-neon"
              >
                <Satellite className="h-6 w-6 text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold gradient-text-premium">SentinelMesh</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {tabItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  className={`px-4 py-2 transition-all duration-300 ${
                    activeTab === item.id 
                      ? 'bg-gradient-primary text-white shadow-lg' 
                      : 'hover:bg-white/10'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Bar */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 bg-white/10 border-white/20 focus:bg-white/20 transition-colors"
                  />
                </div>
              </div>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-white/10"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                {notificationsEnabled ? (
                  <Bell className="h-5 w-5" />
                ) : (
                  <BellOff className="h-5 w-5" />
                )}
                {notificationsEnabled && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </Button>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-white/10"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-white/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-b border-white/10"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                {tabItems.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={`justify-start ${
                      activeTab === item.id 
                        ? 'bg-gradient-primary text-white' 
                        : 'hover:bg-white/10'
                    }`}
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileMenuOpen(false)
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Welcome Section */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-white">
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold mb-4">Welcome to SentinelMesh</h2>
                  <p className="text-xl text-white/80 mb-6">
                    Monitor your AI agents in real-time with advanced security analytics
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button className="btn-glass" onClick={fetchData}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                    <Button className="btn-glass">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
                <Layers className="absolute -right-12 -bottom-12 h-64 w-64 text-white/10" />
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: 'Total Logs', 
                    value: logs.length.toLocaleString(), 
                    icon: Database, 
                    color: 'from-blue-500 to-cyan-500',
                    change: '+12%'
                  },
                  { 
                    title: 'Active Agents', 
                    value: agents.filter(a => a.status === 'online').length, 
                    icon: Users, 
                    color: 'from-green-500 to-emerald-500',
                    change: '+5%'
                  },
                  { 
                    title: 'Avg Risk Score', 
                    value: logs.length > 0 
                      ? (logs.reduce((acc, log) => acc + log.risk_score, 0) / logs.length).toFixed(1)
                      : '0', 
                    icon: Shield, 
                    color: 'from-purple-500 to-pink-500',
                    change: '-3%'
                  },
                  { 
                    title: 'High Risk', 
                    value: logs.filter(l => l.risk_score > 70).length, 
                    icon: AlertTriangle, 
                    color: 'from-red-500 to-orange-500',
                    change: '+8%'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card border-0 overflow-hidden group hover:shadow-neon transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                            <stat.icon className="h-6 w-6 text-white" />
                          </div>
                          <Badge className="badge-glass">
                            {stat.change}
                          </Badge>
                        </div>
                        <h3 className="text-3xl font-bold">{stat.value}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Recent Activity
                    </span>
                    <Badge variant="secondary" className="badge-glass">
                      Live
                      <span className="ml-1 h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {filteredLogs.slice(0, 10).map((log, index) => (
                      <motion.div
                        key={log.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="mb-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={`badge-glass ${
                                log.risk_score > 70 ? 'text-red-500' : 
                                log.risk_score > 40 ? 'text-yellow-500' : 
                                'text-green-500'
                              }`}>
                                Risk: {log.risk_score}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm mb-1">{log.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {log.sender}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitBranch className="h-3 w-3" />
                                {log.context}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <AdvancedAnalytics logs={logs} agents={agents} />
            </motion.div>
          )}

          {/* Add other tab contents here */}
          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>All Logs</CardTitle>
                  <CardDescription>Complete log history and filtering</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Logs content coming soon...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Agent Management</CardTitle>
                  <CardDescription>Monitor and control your AI agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Agent management coming soon...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Alert Configuration</CardTitle>
                  <CardDescription>Set up custom alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Alert configuration coming soon...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>Configure your dashboard preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Toaster />
    </div>
  )
}

// Main App Component
const App = () => {
  // Show main dashboard directly without authentication
  return <MainDashboard />
}

export default App