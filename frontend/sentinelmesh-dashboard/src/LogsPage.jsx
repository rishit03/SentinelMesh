import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Download,
  Search,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Slider } from '@/components/ui/slider.jsx'

const LogsPage = ({ logs = [], loading = false, onExport }) => {
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
                    transition={{ delay: index * 0.05 }}
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

export default LogsPage;

