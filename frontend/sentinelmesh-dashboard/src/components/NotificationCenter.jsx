import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  Check,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = ({ isOpen, onClose, notifications = [] }) => {
  const [localNotifications, setLocalNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'System Update Complete',
      message: 'All agents have been successfully updated to version 2.1.0',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      action: { label: 'View Details', url: '#' }
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Risk Activity Detected',
      message: 'Agent Alpha-7 has detected suspicious behavior patterns',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Feature Available',
      message: 'AI-powered threat prediction is now available in Analytics',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true
    },
    {
      id: 4,
      type: 'error',
      title: 'Connection Lost',
      message: 'Unable to reach Agent Beta-3. Last seen 10 minutes ago',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      priority: 'critical'
    }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const markAsRead = (id) => {
    setLocalNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setLocalNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setLocalNotifications(prev =>
      prev.filter(notif => notif.id !== id)
    );
  };

  const clearAll = () => {
    setLocalNotifications([]);
  };

  const unreadCount = localNotifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-card border-l border-border shadow-2xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  {unreadCount > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {unreadCount} unread
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all as read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={localNotifications.length === 0}
                className="text-xs text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>

            {/* Notifications List */}
            <ScrollArea className="h-[calc(100vh-140px)]">
              {localNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="p-4 rounded-full bg-muted mb-4">
                    <Bell className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-center">
                    No notifications yet
                  </p>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    We'll notify you when something important happens
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {localNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        notification.read
                          ? 'bg-muted/30 border-border/50'
                          : 'bg-card border-border hover:shadow-md'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className={`text-sm font-semibold ${
                              notification.read ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                              {notification.title}
                            </h3>
                            {notification.priority && (
                              <Badge
                                variant={notification.priority === 'critical' ? 'destructive' : 'default'}
                                className="text-xs"
                              >
                                {notification.priority}
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${
                            notification.read ? 'text-muted-foreground/80' : 'text-muted-foreground'
                          }`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </div>
                            <div className="flex items-center gap-2">
                              {notification.action && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-7"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Handle action
                                  }}
                                >
                                  {notification.action.label}
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationCenter;