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
  const [darkMode, setDarkMode] = useState(false)
  const [minRisk, setMinRisk] = useState([80])
  const [searchTerm, setSearchTerm] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [activeTab, setActiveTab] = useState('logs')
  const [isConnected, setIsConnected] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [timeRange, setTimeRange] = useState('24h')
  const [wsStatus, setWsStatus] = useState('Connecting...') 
  
  const controls = useAnimation()

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
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700 shadow-lg"
      >
        <div className="container mx-auto px-6 py-4">
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
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            onHoverStart={() => setHoveredCard('logs')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Logs</p>
                    <p className="text-3xl font-bold">
                      <AnimatedCounter value={logs.length} />
                    </p>
                    {hoveredCard === 'logs' && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-blue-200 mt-1"
                      >
                        +{Math.floor(Math.random() * 10)} in last hour
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    animate={hoveredCard === 'logs' ? { rotate: 360 } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Activity className="h-8 w-8 text-blue-200" />
                  </motion.div>
                </div>
                <motion.div 
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="cardHover"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            onHoverStart={() => setHoveredCard('alerts')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-red-500 to-red-600 text-white cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-medium">Active Alerts</p>
                    <p className="text-3xl font-bold">
                      <AnimatedCounter value={alerts.length} />
                    </p>
                    {hoveredCard === 'alerts' && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-200 mt-1"
                      >
                        {alerts.length > 0 ? 'Requires attention' : 'All clear'}
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    animate={hoveredCard === 'alerts' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <AlertTriangle className="h-8 w-8 text-red-200" />
                  </motion.div>
                </div>
                <motion.div 
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="cardHover"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            onHoverStart={() => setHoveredCard('agents')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-500 to-green-600 text-white cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Agents</p>
                    <p className="text-3xl font-bold">
                      <AnimatedCounter value={Object.keys(agentStats).length} />
                    </p>
                    {hoveredCard === 'agents' && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-green-200 mt-1"
                      >
                        Across {user?.org}
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    animate={hoveredCard === 'agents' ? { y: [-2, 2, -2] } : {}}
                    transition={{ duration: 1, repeat: hoveredCard === 'agents' ? Infinity : 0 }}
                  >
                    <Users className="h-8 w-8 text-green-200" />
                  </motion.div>
                </div>
                <motion.div 
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="cardHover"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            onHoverStart={() => setHoveredCard('status')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">System Status</p>
                    <p className="text-lg font-bold capitalize">
                      {getSystemStatus()}
                    </p>
                    <p className="text-xs text-purple-200 mt-1">
                      WebSocket: {wsStatus}
                    </p>
                  </div>
                  <motion.div
                    animate={hoveredCard === 'status' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <StatusIndicator status={getSystemStatus()} size="lg" />
                  </motion.div>
                </div>
                <motion.div 
                  className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  layoutId="cardHover"
                />
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Main Dashboard Content */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-3 lg:grid-cols-4">
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Logs
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Agents
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-slate-500" />
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>
                
                {activeTab === 'alerts' && (
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-500" />
                    <div className="w-32">
                      <Slider
                        value={minRisk}
                        onValueChange={setMinRisk}
                        max={100}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-400 min-w-fit">
                      Risk ≥ {minRisk[0]}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            <TabsContent value="logs" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Recent Logs
                    </CardTitle>
                    <CardDescription>
                      Real-time log stream from your AI agents
                      {lastUpdated && (
                        <span className="ml-2 text-xs">
                          Last updated: {formatTimestamp(lastUpdated)}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => downloadData(filteredLogs, 'logs', 'json')}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button
                      onClick={() => downloadData(filteredLogs, 'logs', 'csv')}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
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
                            className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
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
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatTimestamp(log.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                {log.payload || log.context || 'No message content'}
                              </p>
                              {showDetails && log.context && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Context: {log.context}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {log.risk !== undefined && (
                                <Badge className={`${getRiskBadgeColor(log.risk)} text-white`}>
                                  Risk: {log.risk}%
                                </Badge>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Security Alerts
                    </CardTitle>
                    <CardDescription>
                      High-risk events requiring attention (Risk ≥ {minRisk[0]}%)
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => downloadData(alerts, 'alerts', 'json')}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
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
                            className="flex items-start justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                                  {alert.sender}
                                </Badge>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {formatTimestamp(alert.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                                {alert.payload || alert.context || 'High-risk activity detected'}
                              </p>
                              {showDetails && alert.context && (
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Context: {alert.context}
                                </p>
                              )}
                            </div>
                            <Badge className={`${getRiskBadgeColor(alert.risk)} text-white ml-4`}>
                              {alert.risk}%
                            </Badge>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Agent Activity
                    </CardTitle>
                    <CardDescription>
                      Message volume by agent
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={agentChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="messages" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Risk Distribution
                    </CardTitle>
                    <CardDescription>
                      Alert severity breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={riskChartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {riskChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="agents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Agent Status
                  </CardTitle>
                  <CardDescription>
                    Overview of all active agents in your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(agentStats).length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No agents detected</p>
                        <p className="text-sm">Agents will appear here once they start sending logs</p>
                      </div>
                    ) : (
                      Object.values(agentStats).map((agent, index) => (
                        <motion.div
                          key={agent.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {agent.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">
                                {agent.name}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Last seen: {formatTimestamp(agent.lastSeen)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {agent.count} messages
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Total activity
                              </p>
                            </div>
                            <StatusIndicator status="online" size="sm" />
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}

function AuthWrapper() {
  const { isAuthenticated, isLoading } = useAuth()
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'
  const { login, register } = useAuth()
  const [authLoading, setAuthLoading] = useState(false)

  const handleLogin = async (username, password) => {
    setAuthLoading(true)
    try {
      await login(username, password)
    } finally {
      setAuthLoading(false)
    }
  }

  const handleRegister = async (username, password, org) => {
    setAuthLoading(true)
    try {
      await register(username, password, org)
    } finally {
      setAuthLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading SentinelMesh...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (authMode === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthMode('register')}
          isLoading={authLoading}
        />
      )
    } else {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthMode('login')}
          isLoading={authLoading}
        />
      )
    }
  }

  return <Dashboard />
}

function App() {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  )
}

export default App

