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
  ExternalLink
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
  ResponsiveContainer as RechartsResponsiveContainer,
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
import { Responsive, WidthProvider } from 'react-grid-layout'
import './App.css'

// Import the new page components
import LogsPage from './pages/LogsPage.jsx'
import AlertsPage from './pages/AlertsPage.jsx'
import AgentsPage from './pages/AgentsPage.jsx'
import RiskPage from './pages/RiskPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

// Import custom hooks
import useLogsData from './hooks/useLogsData.js'
import useTheme from './hooks/useTheme.js'
import useMobileDetection from './hooks/useMobileDetection.js'
import useNotificationsToggle from './hooks/useNotificationsToggle.js'
import useAutoRefreshToggle from './hooks/useAutoRefreshToggle.js'

const ResponsiveGridLayout = WidthProvider(Responsive)

// INLINED MobileHeader Component (as it was in your original App.jsx)
const MobileHeader = ({
  user,
  isConnected,
  systemStatus,
  darkMode,
  setDarkMode,
  notifications,
  setNotifications,
  autoRefresh,
  setAutoRefresh,
  onRefresh,
  onLogout,
  loading = false,
  onTabChange // Added for mobile menu tab navigation
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleMenuItemClick = (tab) => {
    onTabChange(tab);
    closeMenu();
  };

  return (
    <>
      {/* Mobile Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-700 shadow-lg lg:hidden"
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Status */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Satellite className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1">
                  <StatusIndicator status={systemStatus} size="sm" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SentinelMesh
                </h1>
                <div className="flex items-center space-x-1">
                  <p className="text-xs text-slate-600 dark:text-slate-400">Dashboard</p>
                  {isConnected ? (
                    <Wifi className="h-3 w-3 text-green-500" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-red-500" />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Mobile Menu Button */}
            <Button
              onClick={toggleMenu}
            
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <motion.div
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.div>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeMenu}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Menu
                  </h2>
                  <Button
                    onClick={closeMenu}
                    variant="ghost"
                    size="sm"
                    className="p-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {user?.username}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {user?.org}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="flex-1 p-4 space-y-6">
                  {/* Theme Toggle */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Appearance
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">Dark Mode</span>
                        <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Enable notifications
                      </span>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                  </div>

                  {/* Auto Refresh */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Auto Refresh
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        Auto refresh data
                      </span>
                      <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Actions
                    </h3>
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          onRefresh();
                          closeMenu();
                        }}
                        disabled={loading}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                      >
                        <motion.div
                          animate={loading ? { rotate: 360 } : {}}
                          transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
                          className="mr-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </motion.div>
                        Refresh Data
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    onClick={() => {
                      onLogout();
                      closeMenu();
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// INLINED ResponsiveContainer Component (as it was in your original App.jsx)
const ResponsiveContainer = ({
  children,
  className = "",
  maxWidth = "7xl",
  padding = "responsive"
}) => {
  const getPaddingClasses = () => {
    switch (padding) {
      case 'none':
        return '';
      case 'sm':
        return 'px-4 py-2 sm:px-6 sm:py-4';
      case 'md':
        return 'px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8';
      case 'lg':
        return 'px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12';
      case 'responsive':
      default:
        return 'px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8';
    }
  };

  const getMaxWidthClass = () => {
    const maxWidthMap = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
      'full': 'max-w-full',
      'none': ''
    };
    return maxWidthMap[maxWidth] || 'max-w-7xl';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        w-full 
        ${getMaxWidthClass()} 
        mx-auto 
        ${getPaddingClasses()} 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// Main Dashboard Component with Tab Navigation
const Dashboard = () => {
  const { user, logout } = useAuth()
  const { logs, alerts, loading, isConnected, fetchData } = useLogsData();
  const [stats, setStats] = useState({})
  const [darkMode, setDarkMode] = useTheme();
  const [notifications, setNotifications] = useNotificationsToggle();
  const [autoRefresh, setAutoRefresh] = useAutoRefreshToggle();
  const isMobile = useMobileDetection();
  const [activeTab, setActiveTab] = useState('dashboard')

  // Update stats whenever logs or alerts change
  useEffect(() => {
    setStats({
      systemStatus: isConnected ? 'Operational' : 'Disconnected',
      activeAgents: logs.filter(log => log.sender && log.timestamp && (Date.now() - new Date(log.timestamp).getTime() < 300000)).length, // Agents active in last 5 mins
      totalLogs: logs.length,
      highRiskLogs: logs.filter(log => log.risk >= 80).length,
      avgRisk: logs.length > 0 ? Math.round(logs.reduce((sum, log) => sum + (log.risk || 0), 0) / logs.length) : 0,
    });
  }, [logs, alerts, isConnected]);

  const handleExport = useCallback((format) => {
    console.log(`Exporting logs as ${format}`);
    // Implement export logic here, potentially using logs state
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <MobileHeader
        user={user}
        isConnected={isConnected}
        systemStatus={stats.systemStatus}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={notifications}
        setNotifications={setNotifications}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        onRefresh={fetchData}
        onLogout={logout}
        loading={loading}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col lg:flex-row">
          {/* Sidebar Navigation (Desktop) */}
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-lg p-4 mr-4"
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="relative">
                <Satellite className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1">
                  <StatusIndicator status={stats.systemStatus} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SentinelMesh
                </h1>
                <div className="flex items-center space-x-1">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Dashboard</p>
                  {isConnected ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {user?.username}
                  </p>
                  <Badge variant="outline" className="text-sm">
                    {user?.org}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              <TabsList className="flex flex-col h-auto p-0 bg-transparent">
                <TabsTrigger
                  value="dashboard"
                  onClick={() => setActiveTab('dashboard')}
                  className="w-full justify-start text-lg py-2 px-4 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                >
                  <Activity className="h-5 w-5 mr-3" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  onClick={() => setActiveTab('logs')}
                  className="w-full justify-start text-lg py-2 px-4 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                >
                  <Clock className="h-5 w-5 mr-3" />
                  Logs
                </TabsTrigger>
                <TabsTrigger
                  value="alerts"
                  onClick={() => setActiveTab('alerts')}
                  className="w-full justify-start text-lg py-2 px-4 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                >
                  <AlertTriangle className="h-5 w-5 mr-3" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger
                  value="agents"
                  onClick={() => setActiveTab('agents')}
                  className="w-full justify-start text-lg py-2 px-4 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                >
                  <Users className="h-5 w-5 mr-3" />
                  Agents
                </TabsTrigger>
                <TabsTrigger
                  value="risk"
                  onClick={() => setActiveTab('risk')}
                  className="w-full justify-start text-lg py-2 px-4 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400"
                >
                  <Shield className="h-5 w-5 mr-3" />
                  Risk
                </TabsTrigger>
              </TabsList>
            </nav>

            {/* Settings and Logout */}
            <div className="mt-auto space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Dark Mode</span>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Notifications</span>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700 dark:text-slate-300">Auto Refresh</span>
                  <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                </div>
              </div>
              <Button
                onClick={fetchData}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: loading ? Infinity : 0 }}
                  className="mr-2"
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                Refresh Data
              </Button>
              <Button
                onClick={logout}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </motion.aside>

          {/* Tab Content Area */}
          <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <TabsContent value="dashboard" className="flex-1">
              <DashboardPage 
                logs={logs} 
                alerts={alerts} 
                stats={stats} 
                loading={loading} 
                onNavigateToTab={setActiveTab} 
              />
            </TabsContent>

            <TabsContent value="logs" className="flex-1">
              <LogsPage 
                logs={logs} 
                loading={loading} 
                onExport={handleExport} 
              />
            </TabsContent>

            <TabsContent value="alerts" className="flex-1">
              <AlertsPage 
                alerts={alerts} 
                loading={loading} 
                onExport={handleExport} 
              />
            </TabsContent>

            <TabsContent value="agents" className="flex-1">
              <AgentsPage 
                logs={logs} 
                loading={loading} 
              />
            </TabsContent>

            <TabsContent value="risk" className="flex-1">
              <RiskPage 
                logs={logs} 
                loading={loading} 
              />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

// App Content Component
function AppContent() {
  const { user, isLoading, login, register } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">
            Please wait while initializing dashboard...
          </p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return showRegister ? (
      <Register
        onRegister={register}
        onSwitchToLogin={() => setShowRegister(false)}
        isLoading={isLoading}
      />
    ) : (
      <Login
        onLogin={login}
        onSwitchToRegister={() => setShowRegister(true)}
        isLoading={isLoading}
      />
    )
  }

  return <Dashboard />
}

// Main App Component
function App() {
  return (
    <AppContent />
  )
}

export default App


