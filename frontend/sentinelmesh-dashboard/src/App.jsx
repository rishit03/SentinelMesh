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
  ExternalLink,
  Brain, // Added Brain icon
  Target // Added Target icon
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
import AdvancedAnalytics from './AdvancedAnalytics.jsx' // Added AdvancedAnalytics import
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
  loading = false,
  activeTab,
  navigateToTab
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detailed Logs ({filteredLogs.length})</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onExport('json', filteredLogs)}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={() => onExport('csv', filteredLogs)}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap">Min Risk:</Label>
            <Slider
              value={riskFilter}
              onValueChange={setRiskFilter}
              max={100}
              step={1}
              className="w-24"
            />
            <span className="font-medium">{riskFilter[0]}%</span>
          </div>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-slate-500" />
              <p className="text-slate-500">Loading logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No logs match your current filters</p>
            </div>
          ) : (
            filteredLogs.map((log, index) => (
              <div key={log.id || index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      (log.risk || 0) >= 80 ? 'destructive' :
                      (log.risk || 0) >= 40 ? 'default' : 'secondary'
                    }>
                      Risk: {log.risk || 0}%
                    </Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {log.sender} → {log.receiver || 'System'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(log.timestamp || log.received_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-900 dark:text-white mb-2">{log.payload}</p>
                {log.context && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Context: {log.context}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DetailedAlertsWidget = ({ alerts = [], loading = false, onExport }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>High-Risk Alerts ({alerts.length})</span>
          <Button variant="outline" size="sm" onClick={() => onExport('json', alerts)}>
            <Download className="h-4 w-4 mr-2" />
            Export Alerts
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-slate-500" />
              <p className="text-slate-500">Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p>No high-risk alerts at this time</p>
            </div>
          ) : (
            alerts.map((log, index) => (
              <div key={log.id || index} className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <Badge variant="destructive">
                      {log.risk || 0}% Risk
                    </Badge>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {log.sender}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(log.timestamp || log.received_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-900 dark:text-white">{log.payload}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DetailedAgentsWidget = ({ agents = [], loading = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-slate-500" />
              <p className="text-slate-500">Loading agents...</p>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No agents available</p>
            </div>
          ) : (
            agents.map((agent, index) => (
              <div key={agent.id || index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{agent.name}</p>
                    <p className="text-xs text-slate-500">
                      Last seen: {new Date(agent.lastSeen).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{agent.messageCount} messages</p>
                  <Badge variant={
                    agent.avgRisk >= 80 ? 'destructive' :
                    agent.avgRisk >= 40 ? 'default' : 'secondary'
                  }>
                    {agent.avgRisk}% avg risk
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DetailedRiskWidget = ({ logs = [], loading = false }) => {
  const riskDistribution = useMemo(() => {
    const low = logs.filter(log => (log.risk || 0) < 40).length;
    const medium = logs.filter(log => (log.risk || 0) >= 40 && (log.risk || 0) < 80).length;
    const high = logs.filter(log => (log.risk || 0) >= 80).length;
    const total = low + medium + high;

    return [
      { name: 'Low (0-39%)', value: low, fill: '#10b981' },
      { name: 'Medium (40-79%)', value: medium, fill: '#f59e0b' },
      { name: 'High (80-100%)', value: high, fill: '#ef4444' }
    ].map(entry => ({ ...entry, percent: total > 0 ? (entry.value / total) : 0 }));
  }, [logs]);

  const riskTimelineData = useMemo(() => {
    // Group logs by hour for the last 24 hours
    const now = new Date();
    const data = {};
    for (let i = 0; i < 24; i++) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourKey = hour.getHours();
      data[hourKey] = { hour: `${hourKey}:00`, count: 0, totalRisk: 0 };
    }

    logs.forEach(log => {
      const logDate = new Date(log.timestamp || log.received_at);
      const hourKey = logDate.getHours();
      if (data[hourKey]) {
        data[hourKey].count++;
        data[hourKey].totalRisk += (log.risk || 0);
      }
    });

    return Object.values(data).sort((a, b) => {
      const hourA = parseInt(a.hour.split(':')[0]);
      const hourB = parseInt(b.hour.split(':')[0]);
      return (hourA - hourB + 24) % 24; // Sort chronologically for 24 hours
    }).map(item => ({ ...item, avgRisk: item.count > 0 ? Math.round(item.totalRisk / item.count) : 0 }));
  }, [logs]);

  const topRiskEvents = useMemo(() => {
    return logs
      .filter(log => (log.risk || 0) > 0)
      .sort((a, b) => (b.risk || 0) - (a.risk || 0))
      .slice(0, 10);
  }, [logs]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-slate-500" />
                    <p className="text-slate-500">Loading risk data...</p>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No risk data available</p>
                    </div>
                  </div>
                ) : (
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </RechartsResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Timeline (Last 24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-slate-500" />
                    <p className="text-slate-500">Loading risk data...</p>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No data available</p>
                    </div>
                  </div>
                ) : (
                  <RechartsResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskTimelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="avgRisk" stroke="#ef4444" strokeWidth={2} name="Avg Risk" />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Log Count" />
                    </LineChart>
                  </RechartsResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Risk Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-slate-500" />
                  <p className="text-slate-500">Loading top risk events...</p>
                </div>
              ) : topRiskEvents.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p>No high-risk events detected</p>
                </div>
              ) : (
                topRiskEvents.map((log, index) => (
                  <div key={log.id || index} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive">
                          {log.risk || 0}%
                        </Badge>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {log.sender}
                        </span>
                      </div>
                      <p className="text-sm text-slate-900 dark:text-white truncate">
                        {log.payload}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 ml-4">
                      {new Date(log.timestamp || log.received_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

// Main App Component
const App = () => {
  const { user, logout } = useAuth();
  const [logs, setLogs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isConnected, setIsConnected] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);

  // Mobile state
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://sentinelmesh-api.onrender.com'}/logs`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLogs(data.logs || []);
      
      // Extract unique agents from logs
      const uniqueAgents = [...new Set((data.logs || []).map(log => log.sender))].map(sender => ({
        id: sender,
        name: sender,
        status: 'active',
        lastSeen: new Date().toISOString(),
        messageCount: (data.logs || []).filter(log => log.sender === sender).length,
        avgRisk: Math.round((data.logs || []).filter(log => log.sender === sender).reduce((sum, log) => sum + (log.risk || 0), 0) / (data.logs || []).filter(log => log.sender === sender).length) || 0
      }));
      
      setAgents(uniqueAgents);
      setIsConnected(true);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchData();
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefresh]);

  // Handle tab navigation from dashboard widgets
  const navigateToTab = useCallback((tab) => {
    setActiveTab(tab);
    setShowMobileMenu(false);
  }, []);

  // Export data utility
  const exportData = useCallback((format, data, filename = 'export') => {
    if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      if (data.length === 0) return;
      const headers = Object.keys(data[0]);
      const csvContent = [headers.join(','), ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <Login />
      </div>
    );
  }

  const systemStatus = isConnected ? 'connected' : 'disconnected';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <ResponsiveContainer>
        {/* Header */}
        <MobileHeader
          user={user}
          isConnected={isConnected}
          systemStatus={systemStatus}
          darkMode={isDarkMode}
          setDarkMode={setIsDarkMode}
          notifications={notifications}
          setNotifications={setNotifications}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          onRefresh={fetchData}
          onLogout={logout}
          loading={isLoading}
          activeTab={activeTab}
          navigateToTab={navigateToTab}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            {/* Desktop Tab Navigation */}
            {!isMobile && (
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Logs
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="agents" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Agents
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="risk" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Risk
                </TabsTrigger>
              </TabsList>
            )}

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
                  <p className="text-gray-600 dark:text-gray-400">Real-time monitoring and system status</p>
                </div>
                <Button onClick={fetchData} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryStatsWidget
                  title="Total Logs"
                  value={logs.length}
                  icon={Activity}
                  color="blue"
                  subtitle="Click to view details"
                  loading={isLoading}
                  onClick={() => navigateToTab('logs')}
                />

                <SummaryStatsWidget
                  title="Active Alerts"
                  value={logs.filter(log => (log.risk || 0) >= 80).length}
                  icon={AlertTriangle}
                  color="red"
                  subtitle="High risk events"
                  loading={isLoading}
                  onClick={() => navigateToTab('alerts')}
                />

                <SummaryStatsWidget
                  title="Active Agents"
                  value={agents.length}
                  icon={Users}
                  color="green"
                  subtitle="Currently monitoring"
                  loading={isLoading}
                  onClick={() => navigateToTab('agents')}
                />

                <SummaryStatsWidget
                  title="System Status"
                  value={logs.length > 0 ? Math.round(logs.reduce((sum, log) => sum + (log.risk || 0), 0) / logs.length) : 0}
                  icon={Shield}
                  color="purple"
                  subtitle="Average risk level"
                  loading={isLoading}
                  onClick={() => navigateToTab('risk')}
                />
              </div>

              {/* Quick Overview Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SummaryContentWidget
                  title="Recent Logs"
                  icon={Activity}
                  color="blue"
                  count={logs.slice(0, 5).length}
                  subtitle="Latest activities"
                  loading={isLoading}
                  onClick={() => navigateToTab('logs')}
                />

                <SummaryContentWidget
                  title="Agent Activity"
                  icon={Users}
                  color="green"
                  count={agents.length}
                  subtitle="Active agents"
                  loading={isLoading}
                  onClick={() => navigateToTab('agents')}
                />
              </div>
            </TabsContent>

            {/* Advanced Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <AdvancedAnalytics logs={logs} agents={agents} />
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs" className="space-y-6">
              <DetailedLogsWidget 
                logs={logs}
                loading={isLoading}
                onExport={exportData}
              />
            </TabsContent>

            {/* Alerts Tab */}
            <TabsContent value="alerts" className="space-y-6">
              <DetailedAlertsWidget 
                alerts={logs.filter(log => (log.risk || 0) >= 80)}
                loading={isLoading}
                onExport={exportData}
              />
            </TabsContent>

            {/* Agents Tab */}
            <TabsContent value="agents" className="space-y-6">
              <DetailedAgentsWidget 
                agents={agents}
                loading={isLoading}
              />
            </TabsContent>

            {/* Risk Tab */}
            <TabsContent value="risk" className="space-y-6">
              <DetailedRiskWidget 
                logs={logs}
                loading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </main>
      </ResponsiveContainer>
    </div>
  );
};

// Wrap App with AuthProvider
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWithAuth;