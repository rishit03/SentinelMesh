import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  AlertTriangle,
  Brain,
  Target,
  Zap,
  Clock,
  Calendar,
  Users,
  Shield,
  Eye,
  Download,
  CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts'

// Advanced Analytics Utilities
const calculateTrend = (data, field) => {
  if (data.length < 2) return { direction: 'stable', percentage: 0 }
  
  const recent = data.slice(-7) // Last 7 data points
  const older = data.slice(-14, -7) // Previous 7 data points
  
  const recentAvg = recent.reduce((sum, item) => sum + (item[field] || 0), 0) / recent.length
  const olderAvg = older.reduce((sum, item) => sum + (item[field] || 0), 0) / older.length
  
  if (olderAvg === 0) return { direction: 'stable', percentage: 0 }
  
  const percentage = ((recentAvg - olderAvg) / olderAvg) * 100
  const direction = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'stable'
  
  return { direction, percentage: Math.abs(percentage) }
}

const detectAnomalies = (data, field, threshold = 2) => {
  if (data.length < 10) return []
  
  const values = data.map(item => item[field] || 0)
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  const stdDev = Math.sqrt(variance)
  
  return data.filter((item, index) => {
    const value = item[field] || 0
    return Math.abs(value - mean) > threshold * stdDev
  })
}

const predictNextValue = (data, field) => {
  if (data.length < 5) return null
  
  const recent = data.slice(-10).map((item, index) => ({ x: index, y: item[field] || 0 }))
  
  // Simple linear regression
  const n = recent.length
  const sumX = recent.reduce((sum, point) => sum + point.x, 0)
  const sumY = recent.reduce((sum, point) => sum + point.y, 0)
  const sumXY = recent.reduce((sum, point) => sum + point.x * point.y, 0)
  const sumXX = recent.reduce((sum, point) => sum + point.x * point.x, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n
  
  const prediction = slope * (recent.length) + intercept // Predict for the next point after the last one
  
  return Math.max(0, Math.round(prediction))
}

const correlateFields = (data, field1, field2) => {
  if (data.length < 5) return 0
  
  const values1 = data.map(item => item[field1] || 0)
  const values2 = data.map(item => item[field2] || 0)
  
  const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length
  const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length
  
  const numerator = values1.reduce((sum, val, index) => 
    sum + (val - mean1) * (values2[index] - mean2), 0)
  
  const denominator1 = Math.sqrt(values1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0))
  const denominator2 = Math.sqrt(values2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0))
  
  if (denominator1 === 0 || denominator2 === 0) return 0
  
  return numerator / (denominator1 * denominator2)
}

const AdvancedAnalytics = ({ logs = [], agents = [] }) => {
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedMetric, setSelectedMetric] = useState('risk')
  
  // Process data for analytics
  const analyticsData = useMemo(() => {
    const now = new Date()
    const timeRanges = {
      '1h': 1 * 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }
    
    const cutoff = new Date(now.getTime() - timeRanges[timeRange])
    const filteredLogs = logs.filter(log => new Date(log.timestamp || log.received_at) >= cutoff)
    
    // Group by time intervals
    const intervals = timeRange === '1h' ? 12 : timeRange === '6h' ? 24 : timeRange === '24h' ? 24 : 30
    const intervalMs = timeRanges[timeRange] / intervals
    
    const groupedData = []
    for (let i = 0; i < intervals; i++) {
      const intervalStart = new Date(cutoff.getTime() + i * intervalMs)
      const intervalEnd = new Date(cutoff.getTime() + (i + 1) * intervalMs)
      
      const intervalLogs = filteredLogs.filter(log => {
        const logTime = new Date(log.timestamp || log.received_at)
        return logTime >= intervalStart && logTime < intervalEnd
      })
      
      const avgRisk = intervalLogs.length > 0 
        ? intervalLogs.reduce((sum, log) => sum + (log.risk || 0), 0) / intervalLogs.length 
        : 0
      
      const highRiskCount = intervalLogs.filter(log => (log.risk || 0) >= 80).length
      const uniqueAgents = new Set(intervalLogs.map(log => log.sender)).size
      
      groupedData.push({
        time: intervalStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: intervalStart.getTime(),
        logCount: intervalLogs.length,
        avgRisk: Math.round(avgRisk),
        highRiskCount,
        uniqueAgents,
        totalRisk: intervalLogs.reduce((sum, log) => sum + (log.risk || 0), 0)
      })
    }
    
    return groupedData
  }, [logs, timeRange])
  
  // Calculate trends and predictions
  const trends = useMemo(() => ({
    risk: calculateTrend(analyticsData, 'avgRisk'),
    volume: calculateTrend(analyticsData, 'logCount'),
    agents: calculateTrend(analyticsData, 'uniqueAgents')
  }), [analyticsData])
  
  const predictions = useMemo(() => ({
    nextRisk: predictNextValue(analyticsData, 'avgRisk'),
    nextVolume: predictNextValue(analyticsData, 'logCount'),
    nextAgents: predictNextValue(analyticsData, 'uniqueAgents')
  }), [analyticsData])
  
  const anomalies = useMemo(() => ({
    risk: detectAnomalies(analyticsData, 'avgRisk'),
    volume: detectAnomalies(analyticsData, 'logCount')
  }), [analyticsData])
  
  const correlations = useMemo(() => ({
    riskVolume: correlateFields(analyticsData, 'avgRisk', 'logCount'),
    riskAgents: correlateFields(analyticsData, 'avgRisk', 'uniqueAgents'),
    volumeAgents: correlateFields(analyticsData, 'logCount', 'uniqueAgents')
  }), [analyticsData])
  
  // Risk distribution data
  const riskDistribution = useMemo(() => {
    const low = logs.filter(log => (log.risk || 0) < 40).length
    const medium = logs.filter(log => (log.risk || 0) >= 40 && (log.risk || 0) < 80).length
    const high = logs.filter(log => (log.risk || 0) >= 80).length
    
    return [
      { name: 'Low Risk', value: low, color: '#10b981' },
      { name: 'Medium Risk', value: medium, color: '#f59e0b' },
      { name: 'High Risk', value: high, color: '#ef4444' }
    ]
  }, [logs])
  
  // Agent activity correlation
  const agentCorrelation = useMemo(() => {
    const agentStats = {}
    logs.forEach(log => {
      if (!agentStats[log.sender]) {
        agentStats[log.sender] = { count: 0, totalRisk: 0, avgRisk: 0 }
      }
      agentStats[log.sender].count++
      agentStats[log.sender].totalRisk += log.risk || 0
    })
    
    return Object.entries(agentStats).map(([agent, stats]) => ({
      agent,
      count: stats.count,
      avgRisk: Math.round(stats.totalRisk / stats.count),
      riskScore: stats.totalRisk
    })).sort((a, b) => b.riskScore - a.riskScore)
  }, [logs])
  
  const TrendIndicator = ({ trend, label }) => (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        trend.direction === 'up' ? 'bg-red-100 text-red-700' :
        trend.direction === 'down' ? 'bg-green-100 text-green-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {trend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> :
         trend.direction === 'down' ? <TrendingDown className="w-3 h-3" /> :
         <Activity className="w-3 h-3" />}
        {trend.percentage.toFixed(1)}%
      </div>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  )
  
  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Predictive insights and trend analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="6h">Last 6 Hours</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Key Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Risk Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {analyticsData.length > 0 ? analyticsData[analyticsData.length - 1]?.avgRisk || 0 : 0}%
              </div>
              <TrendIndicator trend={trends.risk} label="" />
            </div>
            {predictions.nextRisk && (
              <p className="text-xs text-gray-500 mt-1">
                Predicted next: {predictions.nextRisk}%
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {analyticsData.reduce((sum, item) => sum + item.logCount, 0)}
              </div>
              <TrendIndicator trend={trends.volume} label="" />
            </div>
            {predictions.nextVolume && (
              <p className="text-xs text-gray-500 mt-1">
                Predicted next: {predictions.nextVolume} logs
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Anomalies Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-600">
                {anomalies.risk.length + anomalies.volume.length}
              </div>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Risk: {anomalies.risk.length}, Volume: {anomalies.volume.length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Correlation Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {(Math.abs(correlations.riskVolume) * 100).toFixed(0)}%
              </div>
              <Brain className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Risk-Volume correlation
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Trend Analysis</CardTitle>
                <CardDescription>Average risk levels over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="avgRisk" 
                      stroke="#ef4444" 
                      fill="#ef4444" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Log Volume Trends</CardTitle>
                <CardDescription>Message volume and agent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="logCount" fill="#3b82f6" />
                    <Line yAxisId="right" type="monotone" dataKey="uniqueAgents" stroke="#10b981" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Analysis</CardTitle>
                <CardDescription>AI-powered predictions based on historical data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Next Risk Level</p>
                      <p className="text-sm text-gray-600">Predicted average risk</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {predictions.nextRisk || 'N/A'}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Next Volume</p>
                      <p className="text-sm text-gray-600">Predicted log count</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {predictions.nextVolume || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Active Agents</p>
                      <p className="text-sm text-gray-600">Predicted agent count</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">
                      {predictions.nextAgents || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Current risk level distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="correlations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Correlation Matrix</CardTitle>
                <CardDescription>Relationships between different metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk ↔ Volume</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-16 h-2 rounded-full ${
                        Math.abs(correlations.riskVolume) > 0.7 ? 'bg-red-500' :
                        Math.abs(correlations.riskVolume) > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="text-sm font-medium">
                        {(correlations.riskVolume * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Risk ↔ Agents</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-16 h-2 rounded-full ${
                        Math.abs(correlations.riskAgents) > 0.7 ? 'bg-red-500' :
                        Math.abs(correlations.riskAgents) > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="text-sm font-medium">
                        {(correlations.riskAgents * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Volume ↔ Agents</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-16 h-2 rounded-full ${
                        Math.abs(correlations.volumeAgents) > 0.7 ? 'bg-red-500' :
                        Math.abs(correlations.volumeAgents) > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="text-sm font-medium">
                        {(correlations.volumeAgents * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Agent Risk Analysis</CardTitle>
                <CardDescription>Risk correlation by agent activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={agentCorrelation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="count" name="Message Count" />
                    <YAxis dataKey="avgRisk" name="Average Risk" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter dataKey="avgRisk" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="anomalies" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Anomaly Detection</CardTitle>
                <CardDescription>Statistical outliers and unusual patterns</CardDescription>
              </CardHeader>
              <CardContent>
                {anomalies.risk.length === 0 && anomalies.volume.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No anomalies detected in the current time range</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {anomalies.risk.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Risk Anomalies</h4>
                        <div className="space-y-2">
                          {anomalies.risk.map((anomaly, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-sm">
                                  Unusual risk spike at {anomaly.time}
                                </span>
                              </div>
                              <Badge variant="destructive">{anomaly.avgRisk}%</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {anomalies.volume.length > 0 && (
                      <div>
                        <h4 className="font-medium text-orange-600 mb-2">Volume Anomalies</h4>
                        <div className="space-y-2">
                          {anomalies.volume.map((anomaly, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <BarChart3 className="w-4 h-4 text-orange-500" />
                                <span className="text-sm">
                                  Unusual volume at {anomaly.time}
                                </span>
                              </div>
                              <Badge variant="secondary">{anomaly.logCount} logs</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdvancedAnalytics

