import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Satellite,
  Shield,
  Activity,
  AlertTriangle,
  Download,
  RefreshCw,
  Users,
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
  LogOut,
  User,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Upload,
  RotateCcw,
  Save,
  ChevronRight,
  ExternalLink,
  UserCog,
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

// Import user management pages
import UsersPage from './pages/UsersPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

// Import user utilities
import './App.css'

// Authentication Context
const AuthContext = React.createContext()

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser(payload)
      } catch (error) {
        console.error('Invalid token:', error)
        localStorage.removeItem('token')
        setToken(null)
      }
    }
  }, [token])

  const login = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Login Component
const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    org: '',
    role: 'user'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const formDataObj = new FormData()
        formDataObj.append('username', formData.username)
        formDataObj.append('password', formData.password)

        const response = await fetch('/api/token', {
          method: 'POST',
          body: formDataObj,
        })

        if (response.ok) {
          const data = await response.json()
          onLogin(data.access_token)
          toast.success('Login successful!')
        } else {
          const error = await response.json()
          toast.error(error.detail || 'Login failed')
        }
      } else {
        // Register
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('Registration successful! Please login.')
          setIsLogin(true)
          setFormData({ username: '', password: '', org: '', role: 'user' })
        } else {
          const error = await response.json()
          toast.error(error.detail || 'Registration failed')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Satellite className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">SentinelMesh</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="org">Organization</Label>
                  <Input
                    id="org"
                    type="text"
                    value={formData.org}
                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

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
const AppContent = () => {
  const { user, logout } = useAuth()
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

  // Check if user is admin
  const isAdmin = user?.role === 'admin'

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/logs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

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
    const highRiskLogs = logs.filter(log => log.risk >= 80).length
    const activeAgents = agents.filter(agent => agent.status === 'online').length
    const avgRiskScore = logs.length > 0 
      ? Math.round(logs.reduce((sum, log) => sum + (log.risk || 0), 0) / logs.length)
      : 0

    return {
      totalLogs,
      highRiskLogs,
      activeAgents,
      avgRiskScore
    }
  }, [logs, agents])

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'logs', label: 'Logs', icon: Activity },
    { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'agents', label: 'Agents', icon: Users },
    { id: 'risk', label: 'Risk Analysis', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: Brain },
    ...(isAdmin ? [{ id: 'users', label: 'User Management', icon: UserCog }] : []),
    { id: 'profile', label: 'Profile', icon: User },
  ]

  // Mobile navigation
  const MobileNav = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <motion.div className="fixed left-0 top-0 h-full w-64 bg-background border-r shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Satellite className="h-6 w-6 text-primary" />
                <span className="font-semibold">SentinelMesh</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MobileNav />
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Satellite className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">SentinelMesh</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <Bell className={`h-4 w-4 ${notificationsEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.sub}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.sub}</p>
                    <p className="text-xs text-muted-foreground">{user?.org}</p>
                    {user?.role && (
                      <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="w-fit">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTab('settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Navigation */}
          <TabsList className="hidden lg:grid w-full grid-cols-8 lg:grid-cols-8">
            {navigationItems.map((item) => (
              <TabsTrigger key={item.id} value={item.id} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span className="hidden xl:inline">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="dashboard">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Dashboard</h1>
                  <p className="text-muted-foreground">
                    Real-time security monitoring and analytics
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchData}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={autoRefresh}
                      onCheckedChange={setAutoRefresh}
                    />
                    <span className="text-sm text-muted-foreground">Auto-refresh</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                        <p className="text-2xl font-bold">{stats.totalLogs}</p>
                      </div>
                      <Activity className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                        <p className="text-2xl font-bold">{stats.highRiskLogs}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                        <p className="text-2xl font-bold">{stats.activeAgents}</p>
                      </div>
                      <Users className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Risk Score</p>
                        <p className="text-2xl font-bold">{stats.avgRiskScore}</p>
                      </div>
                      <Shield className="h-8 w-8 text-orange-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Security Logs</h1>
                  <p className="text-muted-foreground">
                    Monitor and analyze security events in real-time
                  </p>
                </div>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Search</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search logs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Sender</Label>
                      <Select value={senderFilter} onValueChange={setSenderFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Senders</SelectItem>
                          {uniqueSenders.map(sender => (
                            <SelectItem key={sender} value={sender}>{sender}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Context</Label>
                      <Select value={contextFilter} onValueChange={setContextFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Contexts</SelectItem>
                          {uniqueContexts.map(context => (
                            <SelectItem key={context} value={context}>{context}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Risk Range: {riskFilter[0]} - {riskFilter[1]}</Label>
                      <Slider
                        value={riskFilter}
                        onValueChange={setRiskFilter}
                        max={100}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Logs Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Logs ({filteredLogs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredLogs.length === 0 ? (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No logs found matching your filters</p>
                      </div>
                    ) : (
                      filteredLogs.slice(0, 50).map((log, index) => (
                        <div key={log.id || index} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant={log.risk >= 80 ? 'destructive' : log.risk >= 50 ? 'default' : 'secondary'}>
                                Risk: {log.risk}
                              </Badge>
                              <Badge variant="outline">{log.sender}</Badge>
                              <Badge variant="outline">{log.context}</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm">{log.payload}</p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Security Alerts</h1>
                  <p className="text-muted-foreground">
                    High-priority security events requiring attention
                  </p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredLogs.filter(log => log.risk >= 80).length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-muted-foreground">No active alerts</p>
                      </div>
                    ) : (
                      filteredLogs.filter(log => log.risk >= 80).map((log, index) => (
                        <div key={log.id || index} className="border border-red-200 rounded-lg p-4 space-y-2 bg-red-50 dark:bg-red-950/20">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                              <Badge variant="destructive">Critical</Badge>
                              <Badge variant="outline">{log.sender}</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium">{log.payload}</p>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="destructive">
                              Investigate
                            </Button>
                            <Button size="sm" variant="outline">
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Agent Management</h1>
                  <p className="text-muted-foreground">
                    Monitor and manage connected security agents
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <Card key={agent.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <Badge variant={agent.status === 'online' ? 'default' : 'secondary'}>
                          {agent.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>CPU Usage</span>
                          <span>{agent.cpu}%</span>
                        </div>
                        <Progress value={agent.cpu} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Memory Usage</span>
                          <span>{agent.memory}%</span>
                        </div>
                        <Progress value={agent.memory} />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Network Usage</span>
                          <span>{agent.network}%</span>
                        </div>
                        <Progress value={agent.network} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Version: {agent.version}</p>
                        <p>Location: {agent.location}</p>
                        <p>Last seen: {new Date(agent.lastSeen).toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Risk Analysis</h1>
                  <p className="text-muted-foreground">
                    Comprehensive risk assessment and threat analysis
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Low Risk (0-30)', value: filteredLogs.filter(log => log.risk <= 30).length, fill: '#10b981' },
                            { name: 'Medium Risk (31-70)', value: filteredLogs.filter(log => log.risk > 30 && log.risk <= 70).length, fill: '#f59e0b' },
                            { name: 'High Risk (71-100)', value: filteredLogs.filter(log => log.risk > 70).length, fill: '#ef4444' }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={filteredLogs.slice(-20).map((log, index) => ({
                        index: index + 1,
                        risk: log.risk,
                        timestamp: new Date(log.timestamp).toLocaleTimeString()
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="index" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="risk" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AdvancedAnalytics logs={logs} agents={agents} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users">
              <UsersPage />
            </TabsContent>
          )}

          <TabsContent value="profile">
            <ProfilePage />
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  )
}

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  )
}

// App Wrapper to handle authentication
const AppWrapper = () => {
  const { token, login } = useAuth()

  if (!token) {
    return <Login onLogin={login} />
  }

  return <AppContent />
}

export default App

