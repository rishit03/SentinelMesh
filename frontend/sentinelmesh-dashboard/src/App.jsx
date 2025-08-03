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
  const [wsStatus, setWsStatus] = useState('Connecting...') 
  
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
  }, [minRisk, controls])

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
  }, []); // Empty dependency array means this runs once on mount

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
            onHoverStart={() => setHoveredCard('risk')}
            onHoverEnd={() => setHoveredCard(null)}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Avg. Risk Score</p>
                    <p className="text-3xl font-bold">
                      <AnimatedCounter value={logs.length > 0 ? (logs.reduce((sum, log) => sum + log.risk, 0) / logs.length).toFixed(1) : 0} />
                    </p>
                    {hoveredCard === 'risk' && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-purple-200 mt-1"
                      >
                        Overall system risk
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    animate={hoveredCard === 'risk' ? { rotate: -360 } : {}}
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

        {/* Main Content Tabs */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="logs" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 md:w-[400px] mx-auto mb-6 bg-slate-200 dark:bg-slate-800 rounded-lg shadow-inner">
              <TabsTrigger value="logs" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg">
                <Activity className="h-4 w-4 mr-2" /> Logs
              </TabsTrigger>
              <TabsTrigger value="alerts" className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg">
                <AlertTriangle className="h-4 w-4 mr-2" /> Alerts
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg">
                <BarChart3 className="h-4 w-4 mr-2" /> Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="logs">
              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">Recent Logs</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="text" 
                      placeholder="Search logs..." 
                      className="w-[200px] dark:bg-slate-800 dark:text-white dark:border-slate-700"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={() => downloadData(filteredLogs, 'logs', 'json')}> 
                      <Download className="h-4 w-4 mr-2" /> JSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadData(filteredLogs, 'logs', 'csv')}> 
                      <Download className="h-4 w-4 mr-2" /> CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamp</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sender</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Receiver</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Context</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payload</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alerts</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredLogs.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500 dark:text-slate-400">
                              {loading ? 'Loading logs...' : 'No logs found.'}
                            </td>
                          </tr>
                        ) : (
                          filteredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{formatTimestamp(log.timestamp)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{log.sender}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{log.receiver}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{log.context}</td>
                              <td className="px-6 py-4 text-sm text-slate-900 dark:text-white max-w-xs truncate">{log.payload}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={getRiskBadgeColor(log.risk)}>{log.risk}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                {log.alerts && log.alerts.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {log.alerts.map((alert, idx) => (
                                      <Badge key={idx} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                        {alert.rule_id}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">None</Badge>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {lastUpdated && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts">
              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">Active Alerts</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm text-slate-700 dark:text-slate-300">Min Risk: {minRisk[0]}</span>
                      <Slider
                        defaultValue={[80]}
                        max={100}
                        step={1}
                        onValueChange={setMinRisk}
                        className="w-[100px]"
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={() => downloadData(alerts, 'alerts', 'json')}> 
                      <Download className="h-4 w-4 mr-2" /> JSON
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadData(alerts, 'alerts', 'csv')}> 
                      <Download className="h-4 w-4 mr-2" /> CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Timestamp</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sender</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Context</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payload</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alerts</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700">
                        {alerts.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500 dark:text-slate-400">
                              No alerts found above risk {minRisk[0]}.
                            </td>
                          </tr>
                        ) : (
                          alerts.map((alert) => (
                            <tr key={alert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{formatTimestamp(alert.timestamp)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{alert.sender}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{alert.context}</td>
                              <td className="px-6 py-4 text-sm text-slate-900 dark:text-white max-w-xs truncate">{alert.payload}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={getRiskBadgeColor(alert.risk)}>{alert.risk}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">
                                {alert.alerts && alert.alerts.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {alert.alerts.map((a, idx) => (
                                      <Badge key={idx} variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                        {a.rule_id}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">None</Badge>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats">
              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">Agent Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={agentChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis dataKey="name" className="text-sm text-slate-500 dark:text-slate-400" />
                        <YAxis className="text-sm text-slate-500 dark:text-slate-400" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px' }}
                          itemStyle={{ color: darkMode ? '#fff' : '#000' }}
                          labelStyle={{ color: darkMode ? '#fff' : '#000' }}
                        />
                        <Bar dataKey="messages" fill="#8884d8" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg rounded-lg mt-6">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 dark:text-white">Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {riskChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px' }}
                          itemStyle={{ color: darkMode ? '#fff' : '#000' }}
                          labelStyle={{ color: darkMode ? '#fff' : '#000' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-4 text-center text-slate-600 dark:text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} SentinelMesh. All rights reserved.</p>
        <p>Powered by AI</p>
      </footer>
    </div>
  )
}

export default App


