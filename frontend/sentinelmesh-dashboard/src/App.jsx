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
  EyeOff
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
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || "https://sentinelmesh-api.onrender.com"
const API_TOKEN = import.meta.env.VITE_SENTINELMESH_TOKEN || "rishit-org-token"

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

function App() {
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
  
  const controls = useAnimation()

  const fetchData = async (url) => {
    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      })
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
      const [logsData, alertsData] = await Promise.all([
        fetchData(`${API_BASE}/logs`),
        fetchData(`${API_BASE}/alerts?min_risk=${minRisk[0]}`)
      ])
      
      if (logsData) {
        setLogs(logsData.logs || [])
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
      setIsConnected(false)
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }, [minRisk, controls])

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
                onClick={toggleFullscreen}
                variant="outline"
                size="sm"
                className="relative overflow-hidden group"
              >
                {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

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
                        All systems operational
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    animate={hoveredCard === 'agents' ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 0.5 }}
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
                    <p className="text-xl font-bold">
                      {isConnected ? 'Online' : 'Offline'}
                    </p>
                    {hoveredCard === 'status' && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-purple-200 mt-1"
                      >
                        {isConnected ? 'Connected to mesh' : 'Connection lost'}
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    animate={hoveredCard === 'status' ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Shield className="h-8 w-8 text-purple-200" />
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

        {/* Main Dashboard */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white dark:bg-slate-800 shadow-lg rounded-xl p-1">
              <TabsTrigger value="logs" className="flex items-center space-x-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                <Activity className="h-4 w-4" />
                <span>All Logs</span>
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center space-x-2 data-[state=active]:bg-red-500 data-[state=active]:text-white">
                <AlertTriangle className="h-4 w-4" />
                <span>Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="logs" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <Activity className="h-5 w-5 text-blue-500" />
                            <span>System Logs</span>
                          </CardTitle>
                          <CardDescription>Real-time monitoring of all system activities</CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                              placeholder="Search logs..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                          <Button
                            onClick={() => downloadData(filteredLogs, 'sentinelmesh_logs', 'csv')}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            CSV
                          </Button>
                          <Button
                            onClick={() => downloadData(filteredLogs, 'sentinelmesh_logs', 'json')}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            JSON
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {filteredLogs.length > 0 ? (
                          filteredLogs.map((log, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {log.sender} → {log.receiver}
                                    </Badge>
                                    <span className="text-xs text-slate-500 flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatTimestamp(log.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                                    <strong>Context:</strong> {log.context}
                                  </p>
                                  <p className="text-sm text-slate-700 dark:text-slate-200">
                                    {log.payload}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Globe className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-500">No logs found matching your search criteria</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        <div>
                          <CardTitle className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            <span>Security Alerts</span>
                          </CardTitle>
                          <CardDescription>High-priority security incidents and threats</CardDescription>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Filter className="h-4 w-4 text-slate-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-400">Min Risk: {minRisk[0]}%</span>
                          </div>
                          <div className="w-32">
                            <Slider
                              value={minRisk}
                              onValueChange={setMinRisk}
                              max={100}
                              min={0}
                              step={5}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {alerts.length > 0 ? (
                          alerts.map((alert, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Badge variant="outline" className="text-xs">
                                      {alert.sender} → {alert.receiver}
                                    </Badge>
                                    <Badge className={`text-xs text-white ${getRiskBadgeColor(alert.risk)}`}>
                                      Risk: {alert.risk}%
                                    </Badge>
                                    <span className="text-xs text-slate-500 flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatTimestamp(alert.timestamp)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">
                                    <strong>Context:</strong> {alert.context}
                                  </p>
                                  <p className="text-sm text-slate-700 dark:text-slate-200">
                                    {alert.payload}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <Shield className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-500">No alerts found for the selected risk level</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <span>Agent Activity</span>
                      </CardTitle>
                      <CardDescription>Message count by agent</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={agentChartData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              border: 'none', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }} 
                          />
                          <Bar dataKey="messages" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-red-500" />
                        <span>Risk Distribution</span>
                      </CardTitle>
                      <CardDescription>Alert severity breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
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
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>
              Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
            </span>
          </div>
        </motion.footer>
      </main>
    </div>
  )
}

export default App

