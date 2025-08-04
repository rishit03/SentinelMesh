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
  Save
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

// INLINED useLayoutPersistence Hook
const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'total-logs', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'active-alerts', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'active-agents', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'system-status', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'recent-logs', x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'security-alerts', x: 6, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'agent-activity', x: 0, y: 6, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'risk-distribution', x: 6, y: 6, w: 6, h: 4, minW: 4, minH: 3 }
  ],
  md: [
    { i: 'total-logs', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'active-alerts', x: 4, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'active-agents', x: 0, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'system-status', x: 4, y: 2, w: 4, h: 2, minW: 3, minH: 2 },
    { i: 'recent-logs', x: 0, y: 4, w: 8, h: 4, minW: 6, minH: 3 },
    { i: 'security-alerts', x: 0, y: 8, w: 8, h: 4, minW: 6, minH: 3 },
    { i: 'agent-activity', x: 0, y: 12, w: 8, h: 4, minW: 6, minH: 3 },
    { i: 'risk-distribution', x: 0, y: 16, w: 8, h: 4, minW: 6, minH: 3 }
  ],
  sm: [
    { i: 'total-logs', x: 0, y: 0, w: 6, h: 2, minW: 4, minH: 2 },
    { i: 'active-alerts', x: 0, y: 2, w: 6, h: 2, minW: 4, minH: 2 },
    { i: 'active-agents', x: 0, y: 4, w: 6, h: 2, minW: 4, minH: 2 },
    { i: 'system-status', x: 0, y: 6, w: 6, h: 2, minW: 4, minH: 2 },
    { i: 'recent-logs', x: 0, y: 8, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'security-alerts', x: 0, y: 12, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'agent-activity', x: 0, y: 16, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'risk-distribution', x: 0, y: 20, w: 6, h: 4, minW: 4, minH: 3 }
  ],
  xs: [
    { i: 'total-logs', x: 0, y: 0, w: 4, h: 2, minW: 4, minH: 2 },
    { i: 'active-alerts', x: 0, y: 2, w: 4, h: 2, minW: 4, minH: 2 },
    { i: 'active-agents', x: 0, y: 4, w: 4, h: 2, minW: 4, minH: 2 },
    { i: 'system-status', x: 0, y: 6, w: 4, h: 2, minW: 4, minH: 2 },
    { i: 'recent-logs', x: 0, y: 8, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'security-alerts', x: 0, y: 12, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'agent-activity', x: 0, y: 16, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'risk-distribution', x: 0, y: 20, w: 4, h: 4, minW: 4, minH: 3 }
  ],
  xxs: [
    { i: 'total-logs', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'active-alerts', x: 0, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'active-agents', x: 0, y: 4, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'system-status', x: 0, y: 6, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'recent-logs', x: 0, y: 8, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'security-alerts', x: 0, y: 12, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'agent-activity', x: 0, y: 16, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'risk-distribution', x: 0, y: 20, w: 2, h: 4, minW: 2, minH: 3 }
  ]
};

const STORAGE_KEY = 'sentinelmesh-dashboard-layout';

const useLayoutPersistence = (userId) => {
  const [layouts, setLayouts] = useState(DEFAULT_LAYOUTS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Generate user-specific storage key
  const getUserStorageKey = useCallback((key) => {
    return userId ? `${key}-${userId}` : key;
  }, [userId]);

  // Load layouts from localStorage on mount
  useEffect(() => {
    const loadLayouts = () => {
      try {
        const userLayoutKey = getUserStorageKey(STORAGE_KEY);
        const savedLayouts = localStorage.getItem(userLayoutKey);
        
        if (savedLayouts) {
          const parsedLayouts = JSON.parse(savedLayouts);
          
          // Validate that the saved layouts have the required structure
          if (parsedLayouts && typeof parsedLayouts === 'object') {
            // Merge with default layouts to ensure all breakpoints exist
            const mergedLayouts = { ...DEFAULT_LAYOUTS, ...parsedLayouts };
            setLayouts(mergedLayouts);
            
            // Load last saved timestamp
            const savedTimestamp = localStorage.getItem(`${userLayoutKey}-timestamp`);
            if (savedTimestamp) {
              setLastSaved(new Date(savedTimestamp));
            }
          }
        }
      } catch (error) {
        console.error('Failed to load saved layouts:', error);
        // Fall back to default layouts
        setLayouts(DEFAULT_LAYOUTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadLayouts();
  }, [getUserStorageKey]);

  // Save layouts to localStorage
  const saveLayouts = useCallback(async (newLayouts) => {
    if (!userId) return;
    
    setSaveStatus('saving');
    try {
      const userLayoutKey = getUserStorageKey(STORAGE_KEY);
      const timestamp = new Date();
      
      localStorage.setItem(userLayoutKey, JSON.stringify(newLayouts));
      localStorage.setItem(`${userLayoutKey}-timestamp`, timestamp.toISOString());
      
      setLayouts(newLayouts);
      setLastSaved(timestamp);
      setHasUnsavedChanges(false);
      setSaveStatus('saved');
      
      // Reset save status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save layouts:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  }, [userId, getUserStorageKey]);

  // Update layouts and mark as unsaved
  const updateLayouts = useCallback((newLayouts) => {
    setLayouts(newLayouts);
    setHasUnsavedChanges(true);
  }, []);

  // Export layouts
  const exportLayouts = useCallback(() => {
    const dataToExport = {
      layouts,
      timestamp: new Date().toISOString(),
      username: userId,
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinelmesh-layouts-${userId}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [layouts, userId]);

  // Import layouts
  const importLayouts = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported.layouts) {
            saveLayouts(imported.layouts);
            resolve(imported);
          } else {
            reject(new Error('Invalid layout file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [saveLayouts]);

  return {
    layouts,
    isLoading,
    saveStatus,
    lastSaved,
    hasUnsavedChanges,
    saveLayouts,
    updateLayouts,
    exportLayouts,
    importLayouts
  };
};

// INLINED Widget Components with improved styling and overflow handling

// StatsWidget Component
const StatsWidget = ({ title, value, icon: Icon, color = 'blue', trend, subtitle, loading = false }) => {
  return (
    <Card className="h-full overflow-hidden">
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
          {trend && (
            <Badge variant={trend > 0 ? "default" : "secondary"} className="text-xs">
              {trend > 0 ? '+' : ''}{trend}%
            </Badge>
          )}
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
      </CardContent>
    </Card>
  );
};

// ChartWidget Component with improved responsive handling
const ChartWidget = ({ 
  title, 
  data, 
  type = 'bar', 
  color = '#8884d8', 
  subtitle,
  loading = false,
  height = 200
}) => {
  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-32 w-full rounded" />
        </div>
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No data available</p>
          </div>
        </div>
      );
    }

    const chartProps = {
      data,
      margin: { top: 5, right: 5, left: 5, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <RechartsResponsiveContainer width="100%" height="100%">
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} />
            </LineChart>
          </RechartsResponsiveContainer>
        );
      case 'area':
        return (
          <RechartsResponsiveContainer width="100%" height="100%">
            <AreaChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.3} />
            </AreaChart>
          </RechartsResponsiveContainer>
        );
      case 'pie':
        return (
          <RechartsResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill={color}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              />
              <Tooltip />
            </PieChart>
          </RechartsResponsiveContainer>
        );
      default:
        return (
          <RechartsResponsiveContainer width="100%" height="100%">
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill={color} />
            </BarChart>
          </RechartsResponsiveContainer>
        );
    }
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
            {subtitle && (
              <CardDescription className="text-xs truncate">{subtitle}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div style={{ height: `${height}px` }} className="w-full">
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
};

// LogsWidget Component with improved overflow handling
const LogsWidget = ({ 
  title = "Recent Logs", 
  logs = [], 
  loading = false, 
  onExport,
  maxHeight = 300
}) => {
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
      return new Date(timestamp).toLocaleTimeString();
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
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <CardDescription className="text-xs">
              Real-time log stream from your AI agents
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            {onExport && (
              <>
                <Button size="sm" variant="outline" onClick={() => onExport('json')}>
                  <Download className="h-3 w-3 mr-1" />
                  JSON
                </Button>
                <Button size="sm" variant="outline" onClick={() => onExport('csv')}>
                  <Download className="h-3 w-3 mr-1" />
                  CSV
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-8 text-xs"
            />
          </div>
          <div className="flex items-center space-x-1">
            <Filter className="h-3 w-3 text-slate-400" />
            <Slider
              value={riskFilter}
              onValueChange={setRiskFilter}
              max={100}
              step={10}
              className="w-16"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div 
          className="overflow-y-auto h-full px-4 pb-4"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 dark:bg-slate-700 h-16 rounded" />
                </div>
              ))}
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No logs available</p>
                <p className="text-xs">Logs will appear here when available</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate">
                        {log.sender}
                      </span>
                      <span className="text-xs text-slate-400">→</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {log.receiver || 'SentinelMesh-Dashboard'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs text-slate-400">
                        {formatTime(log.timestamp)}
                      </span>
                      <Badge className={`text-xs px-2 py-0 ${getRiskColor(log.risk || 0)}`}>
                        Risk: {log.risk || 0}%
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-700 dark:text-slate-200 mb-1 break-words">
                    {log.payload}
                  </p>
                  
                  {log.context && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 break-words">
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
  );
};

// AlertsWidget Component
const AlertsWidget = ({ 
  title = "Security Alerts", 
  alerts = [], 
  loading = false,
  onExport,
  maxHeight = 300
}) => {
  if (loading) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription className="text-xs">
            High-risk events requiring attention (Risk ≥ 80%)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 dark:bg-slate-700 h-16 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <CardDescription className="text-xs">
                High-risk events requiring attention (Risk ≥ 80%)
              </CardDescription>
            </div>
            {onExport && (
              <Button size="sm" variant="outline" onClick={onExport}>
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">No active alerts</p>
            <p className="text-xs">Your system is secure</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <CardDescription className="text-xs">
              High-risk events requiring attention (Risk ≥ 80%)
            </CardDescription>
          </div>
          {onExport && (
            <Button size="sm" variant="outline" onClick={onExport}>
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div 
          className="overflow-y-auto h-full px-4 pb-4"
          style={{ maxHeight: `${maxHeight}px` }}
        >
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-red-800 dark:text-red-200 truncate">
                        {alert.sender}
                      </span>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs">
                        Risk: {alert.risk}%
                      </Badge>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-1 break-words">
                      {alert.payload}
                    </p>
                    {alert.context && (
                      <p className="text-xs text-red-600 dark:text-red-400 break-words">
                        {alert.context}
                      </p>
                    )}
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// AgentsWidget Component
const AgentsWidget = ({ 
  title = "Agent Activity", 
  agents = [], 
  loading = false,
  maxHeight = 300
}) => {
  const agentData = useMemo(() => {
    if (!agents || agents.length === 0) return [];
    
    // Group logs by sender (agent)
    const agentMap = {};
    agents.forEach(log => {
      if (!agentMap[log.sender]) {
        agentMap[log.sender] = {
          name: log.sender,
          count: 0,
          lastSeen: log.timestamp,
          avgRisk: 0,
          totalRisk: 0
        };
      }
      agentMap[log.sender].count++;
      agentMap[log.sender].totalRisk += (log.risk || 0);
      if (new Date(log.timestamp) > new Date(agentMap[log.sender].lastSeen)) {
        agentMap[log.sender].lastSeen = log.timestamp;
      }
    });

    // Calculate average risk and convert to array
    return Object.values(agentMap).map(agent => ({
      ...agent,
      avgRisk: agent.count > 0 ? Math.round(agent.totalRisk / agent.count) : 0
    })).sort((a, b) => b.count - a.count);
  }, [agents]);

  const chartData = useMemo(() => {
    return agentData.slice(0, 5).map(agent => ({
      name: agent.name.length > 10 ? agent.name.substring(0, 10) + '...' : agent.name,
      value: agent.count
    }));
  }, [agentData]);

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription className="text-xs">
          Message volume by agent
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 flex-1 overflow-hidden">
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="bg-slate-200 dark:bg-slate-700 h-32 rounded" />
            <div className="bg-slate-200 dark:bg-slate-700 h-16 rounded" />
          </div>
        ) : agentData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No agent activity</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 h-full">
            {/* Chart */}
            <div className="h-32">
              <ChartWidget
                data={chartData}
                type="bar"
                color="#8b5cf6"
                height={120}
              />
            </div>
            
            {/* Agent List */}
            <div 
              className="overflow-y-auto"
              style={{ maxHeight: `${maxHeight - 160}px` }}
            >
              <div className="space-y-2">
                {agentData.slice(0, 10).map((agent, index) => (
                  <div
                    key={agent.name}
                    className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded text-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      <span className="font-medium truncate">{agent.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge variant="outline" className="text-xs">
                        {agent.count}
                      </Badge>
                      <Badge 
                        className={`text-xs ${
                          agent.avgRisk >= 80 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                          agent.avgRisk >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        }`}
                      >
                        {agent.avgRisk}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// INLINED DashboardGrid Component with improved layout settings
const DashboardGrid = ({ 
  logs = [], 
  alerts = [], 
  stats = {}, 
  loading = false, 
  onRefresh,
  className = ""
}) => {
  const { user } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  
  const {
    layouts,
    isLoading: layoutsLoading,
    saveStatus,
    lastSaved,
    hasUnsavedChanges,
    saveLayouts,
    updateLayouts,
    exportLayouts,
    importLayouts
  } = useLayoutPersistence(user?.username);

  const handleLayoutChange = (layout, layouts) => {
    updateLayouts(layouts);
  };

  const handleSaveLayout = () => {
    saveLayouts(layouts);
  };

  const handleResetLayout = () => {
    updateLayouts(DEFAULT_LAYOUTS);
  };

  const handleExportLayout = () => {
    exportLayouts();
  };

  const handleImportLayout = (event) => {
    const file = event.target.files[0];
    if (file) {
      importLayouts(file)
        .then(() => {
          console.log('Layout imported successfully');
        })
        .catch((error) => {
          console.error('Failed to import layout:', error);
        });
    }
  };

  // Prepare chart data
  const agentActivityData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    
    const agentCounts = {};
    logs.forEach(log => {
      agentCounts[log.sender] = (agentCounts[log.sender] || 0) + 1;
    });
    
    return Object.entries(agentCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [logs]);

  const riskDistributionData = useMemo(() => {
    if (!logs || logs.length === 0) return [];
    
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
    
    return Object.entries(riskRanges).map(([name, value]) => ({ name, value }));
  }, [logs]);

  if (layoutsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Control Panel */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? "default" : "outline"}
            size="sm"
          >
            {isEditMode ? <Eye className="h-4 w-4 mr-2" /> : <Settings className="h-4 w-4 mr-2" />}
            {isEditMode ? 'Exit Edit' : 'Customize'}
          </Button>
          
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Badge variant="outline" className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                Edit Mode
              </Badge>
            </motion.div>
          )}
        </div>

        {isEditMode && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSaveLayout}
              size="sm"
              disabled={!hasUnsavedChanges || saveStatus === 'saving'}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveStatus === 'saving' ? 'Saving...' : 'Save Layout'}
            </Button>
            
            <Button
              onClick={handleResetLayout}
              variant="outline"
              size="sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <Button
              onClick={handleExportLayout}
              variant="outline"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportLayout}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {saveStatus === 'saved' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-700 dark:text-green-300">
              Layout saved successfully
              {lastSaved && (
                <span className="ml-2 text-green-600 dark:text-green-400">
                  (Last saved: {lastSaved.toLocaleTimeString()})
                </span>
              )}
            </span>
          </div>
        </motion.div>
      )}

      {saveStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300">
              Failed to save layout. Please try again.
            </span>
          </div>
        </motion.div>
      )}

      {/* Dashboard Grid */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 8, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        useCSSTransforms={true}
      >
        {/* Stats Widgets */}
        <div key="system-status">
          <StatsWidget
            title="System Status"
            value={stats.systemStatus || 'NaN'}
            icon={Shield}
            color="purple"
            loading={loading}
          />
        </div>
        
        <div key="total-logs">
          <StatsWidget
            title="Total Logs"
            value={logs?.length || 0}
            icon={Activity}
            color="blue"
            trend={5}
            loading={loading}
          />
        </div>
        
        <div key="active-alerts">
          <StatsWidget
            title="Active Alerts"
            value={alerts?.length || 0}
            icon={AlertTriangle}
            color="red"
            loading={loading}
          />
        </div>
        
        <div key="active-agents">
          <StatsWidget
            title="Active Agents"
            value={stats.activeAgents || 2}
            icon={Users}
            color="green"
            loading={loading}
          />
        </div>

        {/* Content Widgets */}
        <div key="recent-logs">
          <LogsWidget
            logs={logs}
            loading={loading}
            maxHeight={220}
            onExport={(format) => {
              console.log(`Exporting logs as ${format}`);
              // Implement export logic here
            }}
          />
        </div>
        
        <div key="security-alerts">
          <AlertsWidget
            alerts={alerts}
            loading={loading}
            maxHeight={220}
            onExport={() => {
              console.log('Exporting alerts');
              // Implement export logic here
            }}
          />
        </div>
        
        <div key="agent-activity">
          <AgentsWidget
            agents={logs}
            loading={loading}
            maxHeight={220}
          />
        </div>
        
        <div key="risk-distribution">
          <ChartWidget
            title="Risk Distribution"
            subtitle="Alert severity breakdown"
            data={riskDistributionData}
            type="pie"
            color="#ef4444"
            loading={loading}
            height={180}
          />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

// Main Dashboard Component
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <DashboardGrid
          logs={logs}
          alerts={alerts}
          stats={stats}
          loading={loading}
          onRefresh={handleRefresh}
        />
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

