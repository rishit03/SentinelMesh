import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Users } from 'lucide-react';
import StatusIndicator from '../components/StatusIndicator.jsx';

const AgentsWidget = ({ 
  agentStats = {},
  title = "Agent Status",
  description = "Overview of all active agents in your organization",
  maxHeight = 400,
  className = ""
}) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const agents = Object.values(agentStats);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: maxHeight }}>
            {agents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No agents detected</p>
                <p className="text-sm">Agents will appear here once they start sending logs</p>
              </div>
            ) : (
              agents.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {agent.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {agent.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Last seen: {formatTimestamp(agent.lastSeen)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {agent.count} messages
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total activity
                      </p>
                    </div>
                    <StatusIndicator status="online" size="sm" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AgentsWidget;

