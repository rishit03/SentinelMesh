import React from 'react'
import { motion } from 'framer-motion'
import {
  Satellite,
  Shield,
  Activity,
  AlertTriangle,
  Users,
  ChevronRight
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import AnimatedCounter from '../components/AnimatedCounter.jsx'

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
          <div className={`w-2 h-2 rounded-full bg-${color}-500`} />
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
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
              <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </div>
        
        <div className="flex-1 flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {loading ? (
              <div className="animate-pulse bg-slate-200 dark:bg-slate-700 h-10 w-20 rounded" />
            ) : (
              <AnimatedCounter value={count} />
            )}
          </div>
          <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardPage = ({ logs = [], alerts = [], stats = {}, loading = false, onNavigateToTab }) => {
  const handleNavigateToTab = (tab) => {
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4">
            <Satellite className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              SentinelMesh Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              AI Agent Security Monitoring & Risk Analysis
            </p>
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryStatsWidget
          title="Risk Level"
          value={logs.length > 0 ? Math.round(logs.reduce((sum, log) => sum + (log.risk || 0), 0) / logs.length) : 0}
          icon={Shield}
          color="red"
          trend={-2}
          subtitle="Average security risk percentage"
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
    </div>
  );
};

export default DashboardPage;

