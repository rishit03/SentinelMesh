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
  Brain, // Added for Advanced Analytics
  Target // Added for Advanced Analytics
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
import AdvancedAnalytics from './AdvancedAnalytics.jsx' // Import AdvancedAnalytics

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

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => handleMenuItemClick('dashboard')}>
                    <Satellite className="h-4 w-4 mr-2" /> Dashboard
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => handleMenuItemClick('logs')}>
                    <Activity className="h-4 w-4 mr-2" /> Logs
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => handleMenuItemClick('alerts')}>
                    <AlertTriangle className="h-4 w-4 mr-2" /> Alerts
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => handleMenuItemClick('agents')}>
                    <Users className="h-4 w-4 mr-2" /> Agents
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => handleMenuItemClick('risk')}>
                    <Shield className="h-4 w-4 mr-2" /> Risk
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => handleMenuItemClick('analytics')}>
                    <BarChart3 className="h-4 w-4 mr-2" /> Analytics
                  </Button>
                </nav>

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
  const [timeRange, setTimeRange] = useState('all');
  const [senderFilter, setSenderFilter] = useState('all');
  const [contextFilter, setContextFilter] = useState('all');
  const [sortOption, setSortOption] = useState('timestamp_desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const allSenders = useMemo(() => [...new Set(logs.map(log => log.sender))].sort(), [logs]);
  const allContexts = useMemo(() => [...new Set(logs.map(log => log.context))].sort(), [logs]);

  const filteredLogs = useMemo(() => {
    let currentLogs = logs;

    // Apply time range filter
    const now = new Date();
    currentLogs = currentLogs.filter(log => {
      const logTime = new Date(log.timestamp || log.received_at);
      switch (timeRange) {
        case 'last_hour': return logTime > new Date(now.getTime() - 60 * 60 * 1000);
        case 'last_6_hours': return logTime > new Date(now.getTime() - 6 * 60 * 60 * 1000);
        case 'last_24_hours': return logTime > new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case 'last_7_days': return logTime > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'all':
        default: return true;
      }
    });

    // Apply search term filter
    if (searchTerm) {
      currentLogs = currentLogs.filter(log =>
        log.payload?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.context?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.log_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply risk filter
    currentLogs = currentLogs.filter(log => (log.risk || 0) >= riskFilter[0]);

    // Apply sender filter
    if (senderFilter !== 'all') {
      currentLogs = currentLogs.filter(log => log.sender === senderFilter);
    }

    // Apply context filter
    if (contextFilter !== 'all') {
      currentLogs = currentLogs.filter(log => log.context === contextFilter);
    }

    // Apply sorting
    currentLogs.sort((a, b) => {
      const aVal = a[sortOption.split('_')[0]];
      const bVal = b[sortOption.split('_')[0]];
      if (sortOption.endsWith('_desc')) {
        return bVal - aVal;
      } else {
        return aVal - bVal;
      }
    });

    return currentLogs;
  }, [logs, searchTerm, riskFilter, timeRange, senderFilter, contextFilter, sortOption]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setRiskFilter([0]);
    setTimeRange('all');
    setSenderFilter('all');
    setContextFilter('all');
    setSortOption('timestamp_desc');
  };

  const handlePreset = (presetType) => {
    handleClearFilters(); // Clear all first
    switch (presetType) {
      case 'high_risk':
        setRiskFilter([80]);
        break;
      case 'recent':
        setTimeRange('last_hour');
        break;
      case 'critical':
        setRiskFilter([80]);
        setTimeRange('last_24_hours');
        break;
      case 'security':
        setContextFilter('security');
        break;
      default:
        break;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">All Logs</CardTitle>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Search and Filter Controls */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {/* Risk Range */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Min Risk: {riskFilter[0]}%</label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={riskFilter}
                  onValueChange={setRiskFilter}
                  className="w-full"
                />
              </div>

              {/* Time Range */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="last_hour">Last Hour</SelectItem>
                    <SelectItem value="last_6_hours">Last 6 Hours</SelectItem>
                    <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sender Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Sender</label>
                <Select value={senderFilter} onValueChange={setSenderFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by sender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Senders</SelectItem>
                    {allSenders.map(sender => (
                      <SelectItem key={sender} value={sender}>{sender}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Context Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Context</label>
                <Select value={contextFilter} onValueChange={setContextFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contexts</SelectItem>
                    {allContexts.map(context => (
                      <SelectItem key={context} value={context}>{context}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Option */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort logs" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timestamp_desc">Timestamp (Newest First)</SelectItem>
                    <SelectItem value="timestamp_asc">Timestamp (Oldest First)</SelectItem>
                    <SelectItem value="risk_desc">Risk (High to Low)</SelectItem>
                    <SelectItem value="risk_asc">Risk (Low to High)</SelectItem>
                    <SelectItem value="sender_asc">Sender (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1 col-span-full lg:col-span-1">
                <label className="text-sm font-medium">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handlePreset('high_risk')}>High Risk</Button>
                  <Button variant="outline" size="sm" onClick={() => handlePreset('recent')}>Recent</Button>
                  <Button variant="outline" size="sm" onClick={() => handlePreset('critical')}>Critical</Button>
                  <Button variant="outline" size="sm" onClick={() => handlePreset('security')}>Security</Button>
                  <Button variant="secondary" size="sm" onClick={handleClearFilters}>Clear All</Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No logs found matching your criteria.
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payload</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log, index) => (
                  <tr key={log.log_id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {new Date(log.timestamp || log.received_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {log.sender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <Badge variant="outline">{log.context}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={log.risk >= 80 ? "destructive" : log.risk >= 40 ? "warning" : "success"}>
                        {log.risk}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <span className="truncate max-w-xs block">{log.payload}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DetailedAlertsWidget = ({ alerts = [], loading = false, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState([0]);
  const [timeRange, setTimeRange] = useState('all');
  const [senderFilter, setSenderFilter] = useState('all');
  const [contextFilter, setContextFilter] = useState('all');
  const [sortOption, setSortOption] = useState('timestamp_desc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const allSenders = useMemo(() => [...new Set(alerts.map(alert => alert.sender))].sort(), [alerts]);
  const allContexts = useMemo(() => [...new Set(alerts.map(alert => alert.context))].sort(), [alerts]);

  const filteredAlerts = useMemo(() => {
    let currentAlerts = alerts;

    // Apply time range filter
    const now = new Date();
    currentAlerts = currentAlerts.filter(alert => {
      const alertTime = new Date(alert.timestamp || alert.received_at);
      switch (timeRange) {
        case 'last_hour': return alertTime > new Date(now.getTime() - 60 * 60 * 1000);
        case 'last_6_hours': return alertTime > new Date(now.getTime() - 6 * 60 * 60 * 1000);
        case 'last_24_hours': return alertTime > new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case 'last_7_days': return alertTime > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'all':
        default: return true;
      }
    });

    // Apply search term filter
    if (searchTerm) {
      currentAlerts = currentAlerts.filter(alert =>
        alert.payload?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.sender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.context?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.alert_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply risk filter
    currentAlerts = currentAlerts.filter(alert => (alert.risk || 0) >= riskFilter[0]);

    // Apply sender filter
    if (senderFilter !== 'all') {
      currentAlerts = currentAlerts.filter(alert => alert.sender === senderFilter);
    }

    // Apply context filter
    if (contextFilter !== 'all') {
      currentAlerts = currentAlerts.filter(alert => alert.context === contextFilter);
    }

    // Apply sorting
    currentAlerts.sort((a, b) => {
      const aVal = a[sortOption.split('_')[0]];
      const bVal = b[sortOption.split('_')[0]];
      if (sortOption.endsWith('_desc')) {
        return bVal - aVal;
      } else {
        return aVal - bVal;
      }
    });

    return currentAlerts;
  }, [alerts, searchTerm, riskFilter, timeRange, senderFilter, contextFilter, sortOption]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setRiskFilter([0]);
    setTimeRange('all');
    setSenderFilter('all');
    setContextFilter('all');
    setSortOption('timestamp_desc');
  };

  const handlePreset = (presetType) => {
    handleClearFilters(); // Clear all first
    switch (presetType) {
      case 'high_risk':
        setRiskFilter([80]);
        break;
      case 'recent':
        setTimeRange('last_hour');
        break;
      case 'critical':
        setRiskFilter([80]);
        setTimeRange('last_24_hours');
        break;
      case 'security':
        setContextFilter('security');
        break;
      default:
        break;
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">All Alerts</CardTitle>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Search and Filter Controls */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {/* Risk Range */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Min Risk: {riskFilter[0]}%</label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={riskFilter}
                  onValueChange={setRiskFilter}
                  className="w-full"
                />
              </div>

              {/* Time Range */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="last_hour">Last Hour</SelectItem>
                    <SelectItem value="last_6_hours">Last 6 Hours</SelectItem>
                    <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
                    <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sender Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Sender</label>
                <Select value={senderFilter} onValueChange={setSenderFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by sender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Senders</SelectItem>
                    {allSenders.map(sender => (
                      <SelectItem key={sender} value={sender}>{sender}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Context Filter */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Context</label>
                <Select value={contextFilter} onValueChange={setContextFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by context" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contexts</SelectItem>
                    {allContexts.map(context => (
                      <SelectItem key={context} value={context}>{context}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Option */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort alerts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timestamp_desc">Timestamp (Newest First)</SelectItem>
                    <SelectItem value="timestamp_asc">Timestamp (Oldest First)</SelectItem>
                    <SelectItem value="risk_desc">Risk (High to Low)</SelectItem>
                    <SelectItem value="risk_asc">Risk (Low to High)</SelectItem>
                    <SelectItem value="sender_asc">Sender (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1 col-span-full lg:col-span-1">
                <label className="text-sm font-medium">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handlePreset('high_risk')}>High Risk</Button>
                  <Button variant="outline" size="sm" onClick={() => handlePreset('recent')}>Recent</Button>
                  <Button variant="outline" size="sm" onClick={() => handlePreset('critical')}>Critical</Button>
                  <Button variant="outline" size="sm" onClick={() => handlePreset('security')}>Security</Button>
                  <Button variant="secondary" size="sm" onClick={handleClearFilters}>Clear All</Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAlerts.length} of {alerts.length} alerts
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No alerts found matching your criteria.
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payload</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAlerts.map((alert, index) => (
                  <tr key={alert.alert_id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {new Date(alert.timestamp || alert.received_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {alert.sender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <Badge variant="outline">{alert.context}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={alert.risk >= 80 ? "destructive" : alert.risk >= 40 ? "warning" : "success"}>
                        {alert.risk}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <span className="truncate max-w-xs block">{alert.payload}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DetailedAgentsWidget = ({ agents = [], loading = false, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name_asc');

  const filteredAgents = useMemo(() => {
    let currentAgents = agents;

    if (searchTerm) {
      currentAgents = currentAgents.filter(agent =>
        agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.version?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    currentAgents.sort((a, b) => {
      const [field, order] = sortOption.split('_');
      const aVal = a[field];
      const bVal = b[field];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });

    return currentAgents;
  }, [agents, searchTerm, sortOption]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">All Agents</CardTitle>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="mb-4 flex items-center space-x-2">
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort agents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
              <SelectItem value="status_asc">Status (A-Z)</SelectItem>
              <SelectItem value="status_desc">Status (Z-A)</SelectItem>
              <SelectItem value="last_seen_desc">Last Seen (Newest First)</SelectItem>
              <SelectItem value="last_seen_asc">Last Seen (Oldest First)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredAgents.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No agents found matching your criteria.
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connected</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAgents.map((agent, index) => (
                  <tr key={agent.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      {agent.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      <Badge variant={agent.status === 'active' ? 'success' : 'secondary'}>
                        {agent.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {agent.version}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {new Date(agent.last_seen).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {agent.connected ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DetailedRiskWidget = ({ logs = [], loading = false, onExport }) => {
  const [timeRange, setTimeRange] = useState('all');
  const [sortOption, setSortOption] = useState('risk_desc');

  const riskData = useMemo(() => {
    const now = new Date();
    let filteredLogs = logs;

    // Apply time range filter
    filteredLogs = filteredLogs.filter(log => {
      const logTime = new Date(log.timestamp || log.received_at);
      switch (timeRange) {
        case 'last_hour': return logTime > new Date(now.getTime() - 60 * 60 * 1000);
        case 'last_6_hours': return logTime > new Date(now.getTime() - 6 * 60 * 60 * 1000);
        case 'last_24_hours': return logTime > new Date(now.getTime() - 24 * 60 * 60 * 1000);
        case 'last_7_days': return logTime > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'all':
        default: return true;
      }
    });

    // Aggregate risk by context
    const contextRisk = {};
    filteredLogs.forEach(log => {
      if (!contextRisk[log.context]) {
        contextRisk[log.context] = { totalRisk: 0, count: 0 };
      }
      contextRisk[log.context].totalRisk += log.risk || 0;
      contextRisk[log.context].count++;
    });

    const data = Object.entries(contextRisk).map(([context, stats]) => ({
      name: context,
      risk: Math.round(stats.totalRisk / stats.count),
      count: stats.count,
    }));

    // Sort data
    data.sort((a, b) => {
      const [field, order] = sortOption.split('_');
      const aVal = a[field];
      const bVal = b[field];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        return order === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });

    return data;
  }, [logs, timeRange, sortOption]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Risk Overview</CardTitle>
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" /> Export
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="mb-4 flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="last_hour">Last Hour</SelectItem>
              <SelectItem value="last_6_hours">Last 6 Hours</SelectItem>
              <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="risk_desc">Risk (High to Low)</SelectItem>
              <SelectItem value="risk_asc">Risk (Low to High)</SelectItem>
              <SelectItem value="name_asc">Context (A-Z)</SelectItem>
              <SelectItem value="name_desc">Context (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : riskData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No risk data available for the selected time range.
          </div>
        ) : (
          <div className="overflow-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Risk</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Log Count</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {riskData.map((item, index) => (
                  <tr key={item.name || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Badge variant={item.risk >= 80 ? "destructive" : item.risk >= 40 ? "warning" : "success"}>
                        {item.risk}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const App = () => {
  const { user, token, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [logs, setLogs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [systemStatus, setSystemStatus] = useState('offline'); // 'online', 'offline', 'degraded'
  const [isConnected, setIsConnected] = useState(false);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://sentinelmesh-api.onrender.com';

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout(); // Token expired or invalid
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLogs(data);
      setIsConnected(true);
      setSystemStatus('online');
    } catch (e) {
      console.error("Failed to fetch logs:", e);
      setError(e.message);
      setIsConnected(false);
      setSystemStatus('degraded');
    } finally {
      setLoading(false);
    }
  }, [token, logout, API_BASE_URL]);

  const fetchAgents = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/agents`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          logout();
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAgents(data);
      setIsConnected(true);
      setSystemStatus('online');
    } catch (e) {
      console.error("Failed to fetch agents:", e);
      setError(e.message);
      setIsConnected(false);
      setSystemStatus('degraded');
    } finally {
      setLoading(false);
    }
  }, [token, logout, API_BASE_URL]);

  const handleRefresh = useCallback(() => {
    fetchLogs();
    fetchAgents();
  }, [fetchLogs, fetchAgents]);

  useEffect(() => {
    handleRefresh();
    if (autoRefresh) {
      const interval = setInterval(handleRefresh, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [handleRefresh, autoRefresh]);

  // Calculate summary statistics for dashboard
  const totalLogs = logs.length;
  const totalAgents = agents.length;
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const highRiskLogs = logs.filter(log => log.risk >= 80).length;
  const averageRisk = totalLogs > 0 ? (logs.reduce((sum, log) => sum + log.risk, 0) / totalLogs).toFixed(1) : 0;

  const alerts = useMemo(() => logs.filter(log => log.risk >= 70), [logs]);

  // Grid layout for dashboard
  const dashboardLayouts = {
    lg: [
      { i: 'totalLogs', x: 0, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
      { i: 'totalAgents', x: 2, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
      { i: 'activeAgents', x: 4, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
      { i: 'highRiskLogs', x: 0, y: 1, w: 3, h: 1, minW: 3, minH: 1 },
      { i: 'averageRisk', x: 3, y: 1, w: 3, h: 1, minW: 3, minH: 1 },
      { i: 'logChart', x: 0, y: 2, w: 6, h: 2, minW: 3, minH: 2 },
      { i: 'agentStatusChart', x: 0, y: 4, w: 6, h: 2, minW: 3, minH: 2 },
    ],
    md: [
      { i: 'totalLogs', x: 0, y: 0, w: 3, h: 1 },
      { i: 'totalAgents', x: 3, y: 0, w: 3, h: 1 },
      { i: 'activeAgents', x: 0, y: 1, w: 3, h: 1 },
      { i: 'highRiskLogs', x: 3, y: 1, w: 3, h: 1 },
      { i: 'averageRisk', x: 0, y: 2, w: 6, h: 1 },
      { i: 'logChart', x: 0, y: 3, w: 6, h: 2 },
      { i: 'agentStatusChart', x: 0, y: 5, w: 6, h: 2 },
    ],
    sm: [
      { i: 'totalLogs', x: 0, y: 0, w: 4, h: 1 },
      { i: 'totalAgents', x: 0, y: 1, w: 4, h: 1 },
      { i: 'activeAgents', x: 0, y: 2, w: 4, h: 1 },
      { i: 'highRiskLogs', x: 0, y: 3, w: 4, h: 1 },
      { i: 'averageRisk', x: 0, y: 4, w: 4, h: 1 },
      { i: 'logChart', x: 0, y: 5, w: 4, h: 2 },
      { i: 'agentStatusChart', x: 0, y: 7, w: 4, h: 2 },
    ],
  };

  // Data for charts
  const logChartData = useMemo(() => {
    const data = {};
    logs.forEach(log => {
      const date = new Date(log.timestamp || log.received_at).toLocaleDateString();
      if (!data[date]) {
        data[date] = { date, count: 0, risk: 0 };
      }
      data[date].count++;
      data[date].risk += log.risk || 0;
    });
    return Object.values(data).map(item => ({
      ...item,
      risk: Math.round(item.risk / item.count) // Average risk per day
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [logs]);

  const agentStatusData = useMemo(() => {
    const active = agents.filter(agent => agent.status === 'active').length;
    const inactive = agents.filter(agent => agent.status === 'inactive').length;
    const disconnected = agents.filter(agent => agent.status === 'disconnected').length;
    return [
      { name: 'Active', value: active, color: '#10b981' },
      { name: 'Inactive', value: inactive, color: '#f59e0b' },
      { name: 'Disconnected', value: disconnected, color: '#ef4444' },
    ];
  }, [agents]);

  const handleExport = (data, filename) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = filename;
    link.click();
  };

  if (!token) {
    return (
      <AuthProvider>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Login />
            </TabsContent>
            <TabsContent value="register">
              <Register />
            </TabsContent>
          </Tabs>
        </div>
      </AuthProvider>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <MobileHeader
        user={user}
        isConnected={isConnected}
        systemStatus={systemStatus}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        notifications={notifications}
        setNotifications={setNotifications}
        autoRefresh={autoRefresh}
        setAutoRefresh={setAutoRefresh}
        onRefresh={handleRefresh}
        onLogout={logout}
        loading={loading}
        onTabChange={setActiveTab} // Pass setActiveTab to MobileHeader
      />

      <div className="flex">
        {/* Sidebar for larger screens */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Satellite className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                <div className="absolute -top-1 -right-1">
                  <StatusIndicator status={systemStatus} />
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
          </div>

          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
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

          <nav className="flex-1 p-4 space-y-2">
            <Button
              variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('dashboard')}
              className="w-full justify-start"
            >
              <Satellite className="h-4 w-4 mr-2" /> Dashboard
            </Button>
            <Button
              variant={activeTab === 'logs' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('logs')}
              className="w-full justify-start"
            >
              <Activity className="h-4 w-4 mr-2" /> Logs
            </Button>
            <Button
              variant={activeTab === 'alerts' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('alerts')}
              className="w-full justify-start"
            >
              <AlertTriangle className="h-4 w-4 mr-2" /> Alerts
            </Button>
            <Button
              variant={activeTab === 'agents' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('agents')}
              className="w-full justify-start"
            >
              <Users className="h-4 w-4 mr-2" /> Agents
            </Button>
            <Button
              variant={activeTab === 'risk' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('risk')}
              className="w-full justify-start"
            >
              <Shield className="h-4 w-4 mr-2" /> Risk
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'secondary' : 'ghost'}
              onClick={() => setActiveTab('analytics')}
              className="w-full justify-start"
            >
              <BarChart3 className="h-4 w-4 mr-2" /> Analytics
            </Button>
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
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
            <Button
              onClick={handleRefresh}
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
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </motion.div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
            <TabsList className="hidden lg:flex mb-4 grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="risk">Risk</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="flex-1 flex flex-col">
              <ResponsiveGridLayout
                className="layout"
                layouts={dashboardLayouts}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 6, md: 6, sm: 4, xs: 4, xxs: 2 }}
                rowHeight={150}
                isDraggable={false}
                isResizable={false}
              >
                <div key="totalLogs">
                  <SummaryStatsWidget
                    title="Total Logs"
                    value={totalLogs}
                    icon={Activity}
                    color="blue"
                    subtitle="All messages received"
                    loading={loading}
                    onClick={() => setActiveTab('logs')}
                  />
                </div>
                <div key="totalAgents">
                  <SummaryStatsWidget
                    title="Total Agents"
                    value={totalAgents}
                    icon={Users}
                    color="purple"
                    subtitle="Registered agents"
                    loading={loading}
                    onClick={() => setActiveTab('agents')}
                  />
                </div>
                <div key="activeAgents">
                  <SummaryStatsWidget
                    title="Active Agents"
                    value={activeAgents}
                    icon={CheckCircle}
                    color="green"
                    subtitle="Currently online"
                    loading={loading}
                    onClick={() => setActiveTab('agents')}
                  />
                </div>
                <div key="highRiskLogs">
                  <SummaryStatsWidget
                    title="High Risk Logs"
                    value={highRiskLogs}
                    icon={AlertTriangle}
                    color="red"
                    subtitle="Risk score >= 80%"
                    loading={loading}
                    onClick={() => setActiveTab('alerts')}
                  />
                </div>
                <div key="averageRisk">
                  <SummaryStatsWidget
                    title="Average Risk Score"
                    value={averageRisk}
                    icon={Shield}
                    color="orange"
                    subtitle="Across all logs"
                    loading={loading}
                    onClick={() => setActiveTab('risk')}
                  />
                </div>
                <div key="logChart">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Logs & Risk Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex items-center justify-center h-[200px]">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                      ) : logChartData.length === 0 ? (
                        <div className="text-center text-gray-500 h-[200px] flex items-center justify-center">
                          No log data available for chart.
                        </div>
                      ) : (
                        <RechartsResponsiveContainer width="100%" height={200}>
                          <AreaChart
                            data={logChartData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Area yAxisId="left" type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Log Count" />
                            <Line yAxisId="right" type="monotone" dataKey="risk" stroke="#82ca9d" name="Avg Risk" />
                          </AreaChart>
                        </RechartsResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div key="agentStatusChart">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Agent Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="flex items-center justify-center h-[200px]">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                      ) : agentStatusData.length === 0 ? (
                        <div className="text-center text-gray-500 h-[200px] flex items-center justify-center">
                          No agent status data available for chart.
                        </div>
                      ) : (
                        <RechartsResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={agentStatusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {agentStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </RechartsResponsiveContainer>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </ResponsiveGridLayout>
            </TabsContent>

            <TabsContent value="logs" className="flex-1 flex flex-col">
              <DetailedLogsWidget logs={logs} loading={loading} onExport={() => handleExport(logs, 'sentinelmesh_logs.json')} />
            </TabsContent>

            <TabsContent value="alerts" className="flex-1 flex flex-col">
              <DetailedAlertsWidget alerts={alerts} loading={loading} onExport={() => handleExport(alerts, 'sentinelmesh_alerts.json')} />
            </TabsContent>

            <TabsContent value="agents" className="flex-1 flex flex-col">
              <DetailedAgentsWidget agents={agents} loading={loading} onExport={() => handleExport(agents, 'sentinelmesh_agents.json')} />
            </TabsContent>

            <TabsContent value="risk" className="flex-1 flex flex-col">
              <DetailedRiskWidget logs={logs} loading={loading} onExport={() => handleExport(logs, 'sentinelmesh_risk_data.json')} />
            </TabsContent>

            <TabsContent value="analytics" className="flex-1 flex flex-col">
              <AdvancedAnalytics logs={logs} agents={agents} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default App;


