import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Download, Activity } from 'lucide-react';

const LogsWidget = ({ 
  logs = [], 
  title = "Recent Logs",
  description = "Real-time log stream from your AI agents",
  lastUpdated,
  onExport,
  showDetails = true,
  maxHeight = 400,
  className = ""
}) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getRiskBadgeColor = (risk) => {
    if (risk >= 90) return 'bg-red-500 hover:bg-red-600';
    if (risk >= 70) return 'bg-orange-500 hover:bg-orange-600';
    if (risk >= 50) return 'bg-yellow-500 hover:bg-yellow-600';
    return 'bg-green-500 hover:bg-green-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              {description}
              {lastUpdated && (
                <span className="ml-2 text-xs">
                  Last updated: {formatTimestamp(lastUpdated)}
                </span>
              )}
            </CardDescription>
          </div>
          {onExport && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onExport(logs, 'logs', 'json')}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button
                onClick={() => onExport(logs, 'logs', 'csv')}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: maxHeight }}>
            <AnimatePresence>
              {logs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-slate-500 dark:text-slate-400"
                >
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No logs available</p>
                  <p className="text-sm">Logs will appear here in real-time</p>
                </motion.div>
              ) : (
                logs.map((log, index) => (
                  <motion.div
                    key={log.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {log.sender}
                        </Badge>
                        {log.receiver && (
                          <>
                            <span className="text-slate-400">→</span>
                            <Badge variant="outline" className="text-xs">
                              {log.receiver}
                            </Badge>
                          </>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        {log.payload || log.context || 'No message content'}
                      </p>
                      {showDetails && log.context && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Context: {log.context}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {log.risk !== undefined && (
                        <Badge className={`${getRiskBadgeColor(log.risk)} text-white`}>
                          Risk: {log.risk}%
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LogsWidget;

