import React, { useMemo } from 'react'
import {
  Users,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer as RechartsResponsiveContainer
} from 'recharts'

const AgentsPage = ({ logs = [], loading = false }) => {
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

export default AgentsPage;

