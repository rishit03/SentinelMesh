import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
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
  User
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
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts'
import AnimatedCounter from './components/AnimatedCounter.jsx'
import StatusIndicator from './components/StatusIndicator.jsx'
import MobileHeader from './components/MobileHeader.jsx'
import ResponsiveContainer from './components/ResponsiveContainer.jsx'
import DashboardGrid from './DashboardGrid_with_persistence.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import { AuthProvider, useAuth } from './AuthContext.jsx'
import './App.css'

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

function Dashboard() {
  const { user, logout, authenticatedFetch, API_BASE } = useAuth()
  const [logs, setLogs] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sentinelmesh-dark-mode')
      if (saved !== null) return JSON.parse(saved)
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })
  const [minRisk, setMinRisk] = useState([80])
  const [searchTerm, setSearchTerm] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isConnected, setIsConnected] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [timeRange, setTimeRange] = useState('24h')
  const [wsStatus, setWsStatus] = useState('Connecting...') 
  const [isMobile, setIsMobile] = useState(false)
  
  const controls = useAnimation()

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('sentinelmesh-dark-mode', JSON.stringify(darkMode))
  }, [darkMode])

  const fetchData = async (url) => {
    try {
      const response = await authenticatedFetch(url)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch from ${url}:`, error)
      return null
    }
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // Fetch BOTH logs and alerts via HTTP on initial load
      const [logsData, alertsData] = await Promise.all([
        fetchData(`${API_BASE}/logs`),
        fetchData(`${API_BASE}/alerts?min_risk=${minRisk[0]}`)
      ])
      
      if (logsData) {
        setLogs(logsData.logs || []) // Load historical logs
        setIsConnected(true)
      }
      if (alertsData) {
        setAlerts(alertsData.alerts || [])
      }
      setLastUpdated(new Date())
      
      // Trigger success animation
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 }
      })
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }, [minRisk, controls, authenticatedFetch, API_BASE])

  useEffect(() => {
    // WebSocket connection setup
    const websocketUrl = API_BASE.replace('http', 'ws') + '/ws/logs';
    const ws = new WebSocket(websocketUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsStatus('Connected');
      setIsConnected(true); // Update overall connection status
    };

    ws.onmessage = (event) => {
      try {
        const newLog = JSON.parse(event.data);
        console.log('New log received:', newLog);
        setLogs((prevLogs) => {
          // Check if this log already exists to avoid duplicates
          const exists = prevLogs.some(log => log.id === newLog.id);
          if (exists) return prevLogs;
          return [newLog, ...prevLogs]; // Add new log to the top
        });
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsStatus('Disconnected');
      setIsConnected(false); // Update overall connection status
      // Optional: Implement reconnect logic here
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsStatus('Error');
      setIsConnected(false); // Update overall connection status
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, [API_BASE]); // Empty dependency array means this runs once on mount

  useEffect(() => {
    loadData()
    let interval
    if (autoRefresh) {
      interval = setInterval(loadData, 30000) // Auto-refresh every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [loadData, autoRefresh])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const filteredLogs = logs.filter(log => 
    !searchTerm || 
    log.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.receiver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.context?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const agentStats = logs.reduce((acc, log) => {
    if (!acc[log.sender]) {
      acc[log.sender] = { name: log.sender, count: 0, lastSeen: log.timestamp }
    }
    acc[log.sender].count++
    if (new Date(log.timestamp) > new Date(acc[log.sender].lastSeen)) {
      acc[log.sender].lastSeen = log.timestamp
    }
    return acc
  }, {})

  const agentChartData = Object.values(agentStats).map(agent => ({
    name: agent.name,
    messages: agent.count
  }))

  const riskDistribution = alerts.reduce((acc, alert) => {
    const riskLevel = alert.risk >= 90 ? 'Critical' : 
                     alert.risk >= 70 ? 'High' : 
                     alert.risk >= 50 ? 'Medium' : 'Low'
    acc[riskLevel] = (acc[riskLevel] || 0) + 1
    return acc
  }, {})

  const riskChartData = Object.entries(riskDistribution).map(([level, count]) => ({
    name: level,
    value: count
  }))

  const downloadData = (data, filename, type = 'json') => {
    const content = type === 'csv' ? 
      [Object.keys(data[0]).join(','), ...data.map(row => Object.values(row).join(','))].join('\n') :
      JSON.stringify(data, null, 2)
    
    const blob = new Blob([content], { type: type === 'csv' ? 'text/csv' : 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.${type}`
    a.click()
    URL.revokeObjectURL(url)
    
    // Show success notification
    if (notifications) {
      // In a real app, you'd use a toast library
      console.log(`Downloaded ${filename}.${type}`)
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const getRiskBadgeColor = (risk) => {
    if (risk >= 90) return 'bg-red-500 hover:bg-red-600'
    if (risk >= 70) return 'bg-orange-500 hover:bg-orange-600'
    if (risk >= 50) return 'bg-yellow-500 hover:bg-yellow-600'
    return 'bg-green-500 hover:bg-green-600'
  }

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
    if (!fullscreen) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  const getSystemStatus = () => {
    if (!isConnected) return 'offline'
    if (alerts.length > 0) return 'warning'
    return 'online'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      {/* Mobile Header */}
      {isMobile && (
        <MobileHeader
          user={user}
          isConnected={isConnected}
          systemStatus={getSystemStatus()}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          notifications={notifications}
          setNotifications={setNotifications}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          onRefresh={loadData}
          onLogout={logout}
          loading={loading}
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 shadow-lg"
        >
          <ResponsiveContainer padding="sm">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                animate={controls}
              >
                <div className="relative">
                  <Satellite className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div className="absolute -top-1 -right-1">
                    <StatusIndicator status={getSystemStatus()} size="sm" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SentinelMesh
                  </h1>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Remote Dashboard</p>
                    {isConnected ? (
                      <Wifi className="h-3 w-3 text-green-500" />
                    ) : (
                      <WifiOff className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
                  <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user?.username}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {user?.org}
                  </Badge>
                </div>

                {/* Settings Panel */}
                <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Bell className={`h-4 w-4 ${notifications ? 'text-blue-500' : 'text-slate-400'}`} />
                    <Switch 
                      checked={notifications} 
                      onCheckedChange={setNotifications}
                      size="sm"
                    />
                  </motion.div>
                  
                  <div className="w-px h-4 bg-slate-300 dark:bg-slate-600" />
                  
                  <motion.div 
                    className="flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'text-green-500' : 'text-slate-400'}`} />
                    <Switch 
                      checked={autoRefresh} 
                      onCheckedChange={setAutoRefresh}
                      size="sm"
                    />
                  </motion.div>
                </div>

                {/* Theme Toggle */}
                <motion.div 
                  className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sun className="h-4 w-4" />
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                  <Moon className="h-4 w-4" />
                </motion.div>
                
                {/* Action Buttons */}
                <Button
                  onClick={loadData}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="relative overflow-hidden group"
                >
                  <motion.div
                    animate={loading ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                  </motion.div>
                  Refresh
                </Button>

                {/* Logout Button */}
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </ResponsiveContainer>
        </motion.header>
      )}

      {/* Main Content */}
      <ResponsiveContainer maxWidth="7xl" padding="responsive">
        {/* Mobile Tabs */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard" className="text-xs">Dashboard</TabsTrigger>
                <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
                <TabsTrigger value="alerts" className="text-xs">Alerts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="mt-6">
                <DashboardGrid
                  logs={logs}
                  alerts={alerts}
                  agentStats={agentStats}
                  agentChartData={agentChartData}
                  riskChartData={riskChartData}
                  lastUpdated={lastUpdated}
                  downloadData={downloadData}
                  showDetails={showDetails}
                  minRisk={minRisk[0]}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  user={user}
                />
              </TabsContent>
              
              <TabsContent value="logs" className="mt-6">
                {/* Mobile-optimized logs view */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Logs
                    </CardTitle>
                    <CardDescription>
                      Real-time log stream from your AI agents
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Search */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search logs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    {/* Logs List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {filteredLogs.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 text-slate-500 dark:text-slate-400"
                          >
                            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No logs available</p>
                            <p className="text-sm">Logs will appear here in real-time</p>
                          </motion.div>
                        ) : (
                          filteredLogs.map((log, index) => (
                            <motion.div
                              key={log.id || index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                            >
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {log.sender}
                                    </Badge>
                                    {log.receiver && (
                                      <>
                                        <span className="text-slate-400">→</span>
                                        <Badge variant="outline" className="text-xs">
                                          {log.receiver}
                                        </Badge>
                                      </>
                                    )}
                                  </div>
                                  {log.risk !== undefined && (
                                    <Badge className={`${getRiskBadgeColor(log.risk)} text-white text-xs`}>
                                      {log.risk}%
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  {log.payload || log.context || 'No message content'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatTimestamp(log.timestamp)}
                                </p>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="alerts" className="mt-6">
                {/* Mobile-optimized alerts view */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Security Alerts
                    </CardTitle>
                    <CardDescription>
                      High-risk events requiring attention (Risk ≥ {minRisk[0]}%)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Risk Threshold */}
                    <div className="mb-4">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Minimum Risk Level: {minRisk[0]}%
                      </label>
                      <Slider
                        value={minRisk}
                        onValueChange={setMinRisk}
                        max={100}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    
                    {/* Alerts List */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      <AnimatePresence>
                        {alerts.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 text-slate-500 dark:text-slate-400"
                          >
                            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No active alerts</p>
                            <p className="text-sm">Your system is secure</p>
                          </motion.div>
                        ) : (
                          alerts.map((alert, index) => (
                            <motion.div
                              key={alert.id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                            >
                              <div className="flex flex-col space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-red-500" />
                                    <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                                      {alert.sender}
                                    </Badge>
                                  </div>
                                  <Badge className={`${getRiskBadgeColor(alert.risk)} text-white text-xs`}>
                                    {alert.risk}%
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                  {alert.payload || alert.context || 'High-risk activity detected'}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatTimestamp(alert.timestamp)}
                                </p>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Desktop Dashboard */}
        {!isMobile && (
          <DashboardGrid
            logs={logs}
            alerts={alerts}
            agentStats={agentStats}
            agentChartData={agentChartData}
            riskChartData={riskChartData}
            lastUpdated={lastUpdated}
            downloadData={downloadData}
            showDetails={showDetails}
            minRisk={minRisk[0]}
            hoveredCard={hoveredCard}
            setHoveredCard={setHoveredCard}
            user={user}
          />
        )}
      </ResponsiveContainer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

function AppContent() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Loading SentinelMesh
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Initializing your security dashboard...
          </p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return <Dashboard />
}

export default App

