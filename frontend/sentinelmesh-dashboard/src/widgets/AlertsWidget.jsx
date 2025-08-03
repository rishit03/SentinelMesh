import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Download, AlertTriangle, Shield } from 'lucide-react';

const AlertsWidget = ({ 
  alerts = [], 
  title = "Security Alerts",
  description = "High-risk events requiring attention",
  minRisk = 80,
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
              <AlertTriangle className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              {description} (Risk ≥ {minRisk}%)
            </CardDescription>
          </div>
          {onExport && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onExport(alerts, 'alerts', 'json')}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: maxHeight }}>
            <AnimatePresence>
              {alerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-slate-500 dark:text-slate-400"
                >
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active alerts</p>
                  <p className="text-sm">Your system is secure</p>
                </motion.div>
              ) : (
                alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-start justify-between p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                          {alert.sender}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTimestamp(alert.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                        {alert.payload || alert.context || 'High-risk activity detected'}
                      </p>
                      {showDetails && alert.context && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Context: {alert.context}
                        </p>
                      )}
                    </div>
                    <Badge className={`${getRiskBadgeColor(alert.risk)} text-white ml-4`}>
                      {alert.risk}%
                    </Badge>
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

export default AlertsWidget;

