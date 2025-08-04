import React from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Download,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'

const AlertsPage = ({ alerts = [], loading = false, onExport }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="bg-slate-200 dark:bg-slate-700 h-8 w-48 rounded mb-2" />
          <div className="bg-slate-200 dark:bg-slate-700 h-4 w-96 rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-slate-200 dark:bg-slate-700 h-24 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Security Alerts</h2>
          <p className="text-slate-600 dark:text-slate-400">High-risk events requiring attention (Risk ≥ 80%)</p>
        </div>
        {onExport && (
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Alerts
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{alerts.length}</div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Active Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {alerts.length > 0 ? Math.round(alerts.reduce((sum, alert) => sum + (alert.risk || 0), 0) / alerts.length) : 0}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Average Risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {new Set(alerts.map(alert => alert.sender)).size}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Affected Agents</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card>
        <CardContent className="p-0">
          {alerts.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-1">No active alerts</p>
                <p className="text-xs">Your system is secure</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-red-800 dark:text-red-200">
                          {alert.sender}
                        </span>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                          Risk: {alert.risk}%
                        </Badge>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                        {alert.payload}
                      </p>
                      {alert.context && (
                        <p className="text-xs text-red-600 dark:text-red-400 mb-2">
                          Context: {alert.context}
                        </p>
                      )}
                      <p className="text-xs text-red-500 dark:text-red-400">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsPage;

