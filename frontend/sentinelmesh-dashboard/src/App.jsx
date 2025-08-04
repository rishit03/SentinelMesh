import React, { useState, useEffect, useCallback, useMemo } from 'react'
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

const ResponsiveGridLayout = WidthProvider(Responsive)

// INLINED MobileHeader Component
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
  loading = false
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

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

// INLINED ResponsiveContainer Component
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

// Summary Widget Components (for Dashboard tab)
const SummaryStatsWidget = ({ title, value, icon: Icon, color = 'blue', trend, subtitle, loading = false, onClick }) => {
  return (
    <Card 
      className="h-full overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
              <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
              {title}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            {trend && (
              <Badge variant={trend > 0 ? "default" : "secondary"} className="text-xs">
                {trend > 0 ? '+' : ''}{trend}%
              </Badge>
            )}
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            {loading ? (
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-8 w-16 rounded" />
            ) : (
              <AnimatedCounter value={value} />
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-end mt-2">
          <span className="text-xs text-slate-400 flex items-center">
            View Details <ExternalLink className="h-3 w-3 ml-1" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const SummaryContentWidget = ({ title, icon: Icon, color = 'blue', count, subtitle, loading = false, onClick }) => {
  return (
    <Card 
      className="h-full overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
              <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
              {title}
            </h3>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          {loading ? (
            <div className="space-y-2">
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-full rounded" />
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-4 w-3/4 rounded" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {count} items
              </div>
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-end mt-2">
          <span className="text-xs text-slate-400 flex items-center">
            View All <ExternalLink className="h-3 w-3 ml-1" />
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

// Detailed Widget Components (for individual tabs)
const DetailedLogsWidget = ({ logs = [], loading = false, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState([0]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = !searchTerm || 
        log.payload?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.sender?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = log.risk >= riskFilter[0];
      return matchesSearch && matchesRisk;
    });
  }, [logs, searchTerm, riskFilter]);

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Invalid time';
    }
  };

  const getRiskColor = (risk) => {
    if (risk >= 80) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    if (risk >= 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Logs</h2>
          <p className="text-slate-600 dark:text-slate-400">Real-time log stream from your AI agents</p>
        </div>
        <div className="flex items-center space-x-2">
          {onExport && (
            <>
              <Button variant="outline" onClick={() => onExport('json')}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => onExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search logs by content or sender..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Min Risk:</span>
              <Slider
                value={riskFilter}
                onValueChange={setRiskFilter}
                max={100}
                step={10}
                className="w-24"
              />
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100 w-8">
                {riskFilter[0]}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{logs.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Logs</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{filteredLogs.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Filtered Results</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {logs.filter(log => log.risk >= 80).length}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">High Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {new Set(logs.map(log => log.sender)).size}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Unique Agents</p>
          </CardContent>
        </Card>
      </div>

      {/* Logs List */}
      <Card>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-slate-200 dark:bg-slate-700 h-20 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No logs match your filters</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredLogs.map((log, index) => (
                  <motion.div
                    key={log.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {log.sender}
                        </span>
                        <span className="text-sm text-slate-400">→</span>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {log.receiver || 'SentinelMesh-Dashboard'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {formatTime(log.timestamp)}
                        </span>
                        <Badge className={`text-xs ${getRiskColor(log.risk || 0)}`}>
                          Risk: {log.risk || 0}%
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-700 dark:text-slate-200 mb-2">
                      {log.payload}
                    </p>
                    
                    {log.context && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Context: {log.context}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DetailedAlertsWidget = ({ alerts = [], loading = false, onExport }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-slate-200 dark:bg-slate-700 h-8 w-48 rounded mb-2" />
          <div className="bg-slate-200 dark:bg-slate-700 h-4 w-96 rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-200 dark:bg-slate-700 h-24 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Security Alerts</h2>
          <p className="text-slate-600 dark:text-slate-400">High-risk events requiring attention (Risk ≥ 80%)</p>
        </div>
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Alerts
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{alerts.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Active Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {alerts.length > 0 ? Math.round(alerts.reduce((sum, alert) => sum + (alert.risk || 0), 0) / alerts.length) : 0}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Average Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {new Set(alerts.map(alert => alert.sender)).size}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Affected Agents</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardContent className="p-0">
          {alerts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-1">No active alerts</p>
                <p className="text-xs">Your system is secure</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                          {alert.sender}
                        </span>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          Risk: {alert.risk}%
                        </Badge>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                        {alert.payload}
                      </p>
                      {alert.context && (
                        <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                          Context: {alert.context}
                        </p>
                      )}
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const DetailedAgentsWidget = ({ logs = [], loading = false }) => {
  const agentData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    
    // Group logs by sender (agent)
    const agentMap = {};
    logs.forEach(log => {
      if (!agentMap[log.sender]) {
        agentMap[log.sender] = {
          name: log.sender,
          count: 0,
          lastSeen: log.timestamp,
          avgRisk: 0,
          totalRisk: 0,
          logs: []
        };
      }
      agentMap[log.sender].count++;
      agentMap[log.sender].totalRisk += (log.risk || 0);
      agentMap[log.sender].logs.push(log);
      if (new Date(log.timestamp) > new Date(agentMap[log.sender].lastSeen)) {
        agentMap[log.sender].lastSeen = log.timestamp;
      }
    });

    // Calculate average risk and convert to array
    return Object.values(agentMap).map(agent => ({
      ...agent,
      avgRisk: agent.count > 0 ? Math.round(agent.totalRisk / agent.count) : 0
    })).sort((a, b) => b.count - a.count);
  }, [logs]);

  const chartData = useMemo(() => {
    return agentData.slice(0, 10).map(agent => ({
      name: agent.name.length > 15 ? agent.name.substring(0, 15) + '...' : agent.name,
      value: agent.count
    }));
  }, [agentData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Agent Activity</h2>
          <p className="text-slate-600 dark:text-slate-400">Message volume and activity by agent</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{agentData.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Active Agents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{logs.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Total Messages</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {agentData.length > 0 ? Math.round(logs.length / agentData.length) : 0}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Avg per Agent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {agentData.length > 0 ? Math.round(agentData.reduce((sum, agent) => sum + agent.avgRisk, 0) / agentData.length) : 0}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Avg Risk Level</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Message Volume by Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {loading ? (
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-full rounded" />
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No data available</p>
                </div>
              </div>
            ) : (
              <RechartsResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </RechartsResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agent List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agent Details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-700 h-16 rounded" />
                </div>
              ))}
            </div>
          ) : agentData.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No agent activity</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {agentData.map((agent, index) => (
                <div
                  key={agent.name}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-slate-100">
                          {agent.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Last seen: {new Date(agent.lastSeen).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {agent.count} messages
                        </div>
                        <Badge 
                          className={`text-xs ${
                            agent.avgRisk >= 80 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                            agent.avgRisk >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}
                        >
                          Avg Risk: {agent.avgRisk}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const DetailedRiskWidget = ({ logs = [], loading = false }) => {
  const riskData = useMemo(() => {
    if (!logs || logs.length === 0) return {
      distribution: [],
      timeline: [],
      topRisks: []
    };
    
    // Risk distribution
    const riskRanges = {
      'Low (0-30)': 0,
      'Medium (31-70)': 0,
      'High (71-100)': 0
    };
    
    logs.forEach(log => {
      const risk = log.risk || 0;
      if (risk <= 30) riskRanges['Low (0-30)']++;
      else if (risk <= 70) riskRanges['Medium (31-70)']++;
      else riskRanges['High (71-100)']++;
    });
    
    const distribution = Object.entries(riskRanges).map(([name, value]) => ({ name, value }));
    
    // Risk timeline (last 24 hours)
    const now = new Date();
    const timeline = [];
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourLogs = logs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime.getHours() === hour.getHours() && 
               logTime.getDate() === hour.getDate();
      });
      
      const avgRisk = hourLogs.length > 0 
        ? hourLogs.reduce((sum, log) => sum + (log.risk || 0), 0) / hourLogs.length 
        : 0;
      
      timeline.push({
        name: hour.getHours().toString().padStart(2, '0') + ':00',
        value: Math.round(avgRisk)
      });
    }
    
    // Top risk events
    const topRisks = logs
      .filter(log => log.risk >= 70)
      .sort((a, b) => (b.risk || 0) - (a.risk || 0))
      .slice(0, 10);
    
    return { distribution, timeline, topRisks };
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Risk Analysis</h2>
          <p className="text-slate-600 dark:text-slate-400">Security risk distribution and trends</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {riskData.topRisks.length}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">High Risk Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {logs.length > 0 ? Math.round(logs.reduce((sum, log) => sum + (log.risk || 0), 0) / logs.length) : 0}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Average Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {Math.max(...logs.map(log => log.risk || 0), 0)}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Peak Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {Math.round((riskData.distribution.find(d => d.name === 'Low (0-30)')?.value || 0) / logs.length * 100) || 0}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Low Risk</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-full rounded" />
              ) : riskData.distribution.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                  <div className="text-center">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No data available</p>
                  </div>
                </div>
              ) : (
                <RechartsResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskData.distribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {riskData.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={
                          entry.name.includes('Low') ? '#10b981' :
                          entry.name.includes('Medium') ? '#f59e0b' : '#ef4444'
                        } />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </RechartsResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Timeline (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {loading ? (
                <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-full rounded" />
              ) : riskData.timeline.length === 0 ? (
                <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No data available</p>
                  </div>
                </div>
              ) : (
                <RechartsResponsiveContainer width="100%" height="100%">
                  <LineChart data={riskData.timeline}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </RechartsResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Risk Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Risk Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-700 h-16 rounded" />
                </div>
              ))}
            </div>
          ) : riskData.topRisks.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No high-risk events</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {riskData.topRisks.map((event, index) => (
                <div
                  key={event.id || index}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {event.sender}
                        </span>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          Risk: {event.risk}%
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 mb-1">
                        {event.payload}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Main Dashboard Component with Tab Navigation
const Dashboard = () => {
  const { user, authenticatedFetch, logout } = useAuth()
  const [logs, setLogs] = useState([])
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sentinelmesh-dark-mode') === 'true' ||
             (!localStorage.getItem('sentinelmesh-dark-mode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })
  const [notifications, setNotifications] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('sentinelmesh-dark-mode', darkMode.toString())
  }, [darkMode])

  // WebSocket connection
  useEffect(() => {
    if (!user) return

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const wsUrl = `${wsProtocol}//sentinelmesh-api.onrender.com/ws/logs`
    
    let ws
    let reconnectTimeout

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl)
        
        ws.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected(true)
        }
        
        ws.onmessage = (event) => {
          try {
            const newLog = JSON.parse(event.data)
            setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]) // Keep last 100 logs
            
            // Add to alerts if high risk
            if (newLog.risk >= 80) {
              setAlerts(prevAlerts => [newLog, ...prevAlerts.slice(0, 49)]) // Keep last 50 alerts
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error)
          }
        }
        
        ws.onclose = () => {
          console.log('WebSocket disconnected')
          setIsConnected(false)
          
          // Attempt to reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000)
        }
        
        ws.onerror = (error) => {
          console.log('WebSocket error:', error)
          setIsConnected(false)
        }
      } catch (error) {
        console.error('Error creating WebSocket connection:', error)
        setIsConnected(false)
        reconnectTimeout = setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      if (ws) {
        ws.close()
      }
    }
  }, [user])

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [logsResponse, alertsResponse] = await Promise.all([
        authenticatedFetch('https://sentinelmesh-api.onrender.com/logs'),
        authenticatedFetch('https://sentinelmesh-api.onrender.com/alerts?min_risk=80')
      ])

      if (logsResponse.ok) {
        const logsData = await logsResponse.json()
        setLogs(logsData.logs || [])
      }

      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData.alerts || [])
      }

      // Mock stats for now
      setStats({
        systemStatus: 'Operational',
        activeAgents: 2,
        totalLogs: logs.length,
        activeAlerts: alerts.length
      })

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [user, authenticatedFetch, logs.length, alerts.length])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [user])

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [autoRefresh, fetchData])

  const handleRefresh = () => {
    fetchData()
  }

  const handleLogout = () => {
    logout()
  }

  // Navigation handlers
  const handleNavigateToTab = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Mobile Header */}
      {isMobile && (
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
          onRefresh={handleRefresh}
          onLogout={handleLogout}
          loading={loading}
        />
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-700 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Status */}
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <Satellite className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <motion.div
                    className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
                    transition={{ repeat: isConnected ? Infinity : 0, duration: 2 }}
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    SentinelMesh
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Remote Dashboard • {user?.org}
                  </p>
                </div>
              </motion.div>

              {/* User Info and Controls */}
              <div className="flex items-center space-x-4">
                {/* Connection Status */}
                <div className="flex items-center space-x-2">
                  {isConnected ? (
                    <Wifi className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2">
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
                    onClick={() => setNotifications(!notifications)}
                  >
                    <Bell className={`h-4 w-4 ${notifications ? 'text-blue-600' : 'text-slate-400'}`} />
                  </Button>
                  
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {user?.username}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user?.org}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.header>
      )}

      {/* Main Content with Tabs */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Logs</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="agents" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Agents</span>
            </TabsTrigger>
            <TabsTrigger value="risk" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Risk</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Dashboard Overview</h2>
              <p className="text-slate-600 dark:text-slate-400">Quick overview of your SentinelMesh system status</p>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <SummaryStatsWidget
                title="System Status"
                value={stats.systemStatus || 'NaN'}
                icon={Shield}
                color="purple"
                loading={loading}
                onClick={() => handleNavigateToTab('risk')}
              />
              
              <SummaryStatsWidget
                title="Total Logs"
                value={logs?.length || 0}
                icon={Activity}
                color="blue"
                trend={5}
                loading={loading}
                onClick={() => handleNavigateToTab('logs')}
              />
              
              <SummaryStatsWidget
                title="Active Alerts"
                value={alerts?.length || 0}
                icon={AlertTriangle}
                color="red"
                loading={loading}
                onClick={() => handleNavigateToTab('alerts')}
              />
              
              <SummaryStatsWidget
                title="Active Agents"
                value={stats.activeAgents || 2}
                icon={Users}
                color="green"
                loading={loading}
                onClick={() => handleNavigateToTab('agents')}
              />
            </div>

            {/* Summary Content Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SummaryContentWidget
                title="Recent Logs"
                icon={Activity}
                color="blue"
                count={logs?.length || 0}
                subtitle="Real-time log stream from your AI agents"
                loading={loading}
                onClick={() => handleNavigateToTab('logs')}
              />
              
              <SummaryContentWidget
                title="Security Alerts"
                icon={AlertTriangle}
                color="red"
                count={alerts?.length || 0}
                subtitle="High-risk events requiring attention"
                loading={loading}
                onClick={() => handleNavigateToTab('alerts')}
              />
              
              <SummaryContentWidget
                title="Agent Activity"
                icon={Users}
                color="purple"
                count={new Set(logs.map(log => log.sender)).size}
                subtitle="Message volume by agent"
                loading={loading}
                onClick={() => handleNavigateToTab('agents')}
              />
              
              <SummaryContentWidget
                title="Risk Analysis"
                icon={Shield}
                color="orange"
                count={logs.filter(log => log.risk >= 80).length}
                subtitle="Security risk distribution and trends"
                loading={loading}
                onClick={() => handleNavigateToTab('risk')}
              />
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <DetailedLogsWidget
              logs={logs}
              loading={loading}
              onExport={(format) => {
                console.log(`Exporting logs as ${format}`);
                // Implement export logic here
              }}
            />
          </TabsContent>

          <TabsContent value="alerts">
            <DetailedAlertsWidget
              alerts={alerts}
              loading={loading}
              onExport={() => {
                console.log('Exporting alerts');
                // Implement export logic here
              }}
            />
          </TabsContent>

          <TabsContent value="agents">
            <DetailedAgentsWidget
              logs={logs}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="risk">
            <DetailedRiskWidget
              logs={logs}
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

