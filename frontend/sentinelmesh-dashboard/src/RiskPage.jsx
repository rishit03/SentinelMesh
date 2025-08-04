import React, { useMemo } from 'react'
import {
  Shield,
  BarChart3,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer as RechartsResponsiveContainer
} from 'recharts'

const RiskPage = ({ logs = [], loading = false }) => {
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

export default RiskPage;

