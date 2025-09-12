import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  RefreshCw,
  Share2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingActionButton = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'search', icon: Search, label: 'Search', color: 'from-blue-500 to-cyan-500' },
    { id: 'filter', icon: Filter, label: 'Filter', color: 'from-purple-500 to-pink-500' },
    { id: 'download', icon: Download, label: 'Export', color: 'from-green-500 to-emerald-500' },
    { id: 'upload', icon: Upload, label: 'Import', color: 'from-orange-500 to-yellow-500' },
    { id: 'refresh', icon: RefreshCw, label: 'Refresh', color: 'from-indigo-500 to-purple-500' },
    { id: 'share', icon: Share2, label: 'Share', color: 'from-pink-500 to-rose-500' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'from-gray-500 to-gray-600' },
  ];

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB Container */}
      <div className="fixed bottom-8 right-8 z-50">
        {/* Action Buttons */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-20 right-0 space-y-3"
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    y: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: 20, 
                    y: 20,
                    transition: { delay: (actions.length - index) * 0.05 }
                  }}
                  className="flex items-center justify-end gap-3"
                >
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap"
                  >
                    {action.label}
                  </motion.span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAction(action.id)}
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${action.color} shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-shadow`}
                  >
                    <action.icon className="h-6 w-6" />
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isOpen ? 45 : 0 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-gradient-primary shadow-neon flex items-center justify-center text-white hover:shadow-2xl transition-all duration-300"
        >
          {isOpen ? (
            <X className="h-8 w-8" />
          ) : (
            <Plus className="h-8 w-8" />
          )}
        </motion.button>

        {/* Ripple Effect */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </div>
    </>
  );
};

export default FloatingActionButton;