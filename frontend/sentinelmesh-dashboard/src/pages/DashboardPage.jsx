import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Activity,
  AlertCircle,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  BarChart3,
  FileText,
  Download,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Line, Bar, Pie } from 'recharts';
import {
  LineChart,
  BarChart,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import AnimatedCounter from '@/components/AnimatedCounter';
import StatusIndicator from '@/components/StatusIndicator';
import { toast } from 'sonner';

const DashboardPage = ({ logs = [], alerts = [], loading = false, onRefresh }) => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Extract unique agents from logs
  const agents = [...new Set(logs.map(log => log.sender))].filter(Boolean);

  // Calculate actual stats from real data
  const stats = {
    totalLogs: logs.length,
    activeAgents: agents.length,
    highRiskAlerts: logs.filter(log => log.risk_score >= 80).length,
    averageRiskScore: logs.length > 0 
      ? (logs.reduce((sum, log) => sum + (log.risk_score || 0), 0) / logs.length).toFixed(1)
      : 0
  };

  // Generate activity data from actual logs (last 7 hours)
  const activityData = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourStr = hour.getHours() + ':00';
    const hourLogs = logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime.getHours() === hour.getHours();
    });
    
    activityData.push({
      name: hourStr,
      logs: hourLogs.length,
      alerts: hourLogs.filter(log => log.risk_score >= 80).length
    });
  }

  // Calculate risk distribution from actual data
  const riskDistribution = [
    { 
      name: 'Low', 
      value: logs.filter(log => log.risk_score < 30).length,
      fill: '#10b981' 
    },
    { 
      name: 'Medium', 
      value: logs.filter(log => log.risk_score >= 30 && log.risk_score < 60).length,
      fill: '#f59e0b' 
    },
    { 
      name: 'High', 
      value: logs.filter(log => log.risk_score >= 60 && log.risk_score < 80).length,
      fill: '#ef4444' 
    },
    { 
      name: 'Critical', 
      value: logs.filter(log => log.risk_score >= 80).length,
      fill: '#dc2626' 
    },
  ].filter(item => item.value > 0); // Only show categories with data

  // Recent activity from actual logs
  const recentActivity = logs
    .slice(0, 5)
    .map(log => {
      const timeAgo = new Date(log.timestamp);
      const minutesAgo = Math.floor((now - timeAgo) / 60000);
      const timeStr = minutesAgo < 60 
        ? `${minutesAgo} min ago`
        : `${Math.floor(minutesAgo / 60)} hour${Math.floor(minutesAgo / 60) > 1 ? 's' : ''} ago`;
      
      return {
        time: timeStr,
        event: log.message || 'Log entry',
        type: log.risk_score >= 80 ? 'alert' : log.risk_score >= 60 ? 'warning' : 'info',
        status: log.risk_score >= 80 ? 'critical' : log.risk_score >= 60 ? 'warning' : 'normal',
        sender: log.sender
      };
    });

  const COLORS = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626'
  };

  const handleRefresh = () => {
    fetchData();
    toast.success('Dashboard refreshed');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor your AI agents and security metrics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            {timeRange}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card 
          className="glass-card card-hover cursor-pointer group"
          onClick={() => navigate('/logs')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Logs
            </CardTitle>
            <FileText className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.totalLogs} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              {stats.totalLogs > 0 ? (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">Active</span>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">No logs yet</span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Logs</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="glass-card card-hover cursor-pointer group"
          onClick={() => navigate('/agents')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Agents
            </CardTitle>
            <Users className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter value={stats.activeAgents} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              {stats.activeAgents > 0 ? (
                <>
                  <StatusIndicator status="online" />
                  <span className="text-xs text-muted-foreground">{stats.activeAgents} agent{stats.activeAgents !== 1 ? 's' : ''} active</span>
                </>
              ) : (
                <>
                  <StatusIndicator status="offline" />
                  <span className="text-xs text-muted-foreground">No agents active</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Manage Agents</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="glass-card card-hover cursor-pointer group"
          onClick={() => navigate('/alerts')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Risk Alerts
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              <AnimatedCounter value={stats.highRiskAlerts} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              {stats.highRiskAlerts > 0 ? (
                <>
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-xs text-destructive font-medium">Needs attention</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">All clear</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>View Alerts</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="glass-card card-hover cursor-pointer group"
          onClick={() => navigate('/risk')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Risk Score
            </CardTitle>
            <Shield className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRiskScore}</div>
            <Progress value={stats.averageRiskScore} className="mt-2 h-2" />
            <span className="text-xs text-muted-foreground mt-1">
              {stats.averageRiskScore === 0 ? 'No data' : 
               stats.averageRiskScore < 30 ? 'Low Risk' :
               stats.averageRiskScore < 60 ? 'Medium Risk' :
               stats.averageRiskScore < 80 ? 'High Risk' : 'Critical Risk'}
            </span>
            <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Risk Analysis</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activityData.some(d => d.logs > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="logs" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="alerts" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--destructive))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No activity data available</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Logs will appear here once agents are active</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {riskDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => value > 0 ? `${name} (${value})` : ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">No risk data available</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Risk distribution will appear once logs are received</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {activity.type === 'alert' && <AlertCircle className="h-4 w-4 text-destructive" />}
                    {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    {activity.type === 'info' && <Activity className="h-4 w-4 text-blue-500" />}
                    <div>
                      <p className="text-sm font-medium">{activity.event}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.sender && `From ${activity.sender} • `}{activity.time}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    activity.status === 'critical' ? 'destructive' : 
                    activity.status === 'warning' ? 'outline' :
                    activity.status === 'completed' ? 'default' : 'secondary'
                  }>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No recent activity</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Activity will appear here once agents send logs</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;

