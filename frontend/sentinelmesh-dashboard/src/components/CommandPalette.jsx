import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  Search,
  Home,
  Users,
  Shield,
  Activity,
  Settings,
  Bell,
  BarChart3,
  Terminal,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const CommandPalette = ({ isOpen, onClose, onCommand, darkMode, setDarkMode }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: Home, shortcut: '⌘D' },
    { id: 'logs', label: 'View Logs', icon: Terminal, shortcut: '⌘L' },
    { id: 'agents', label: 'Manage Agents', icon: Users, shortcut: '⌘A' },
    { id: 'analytics', label: 'Open Analytics', icon: BarChart3, shortcut: '⌘N' },
    { id: 'alerts', label: 'Check Alerts', icon: Bell, shortcut: '⌘E' },
    { id: 'risk', label: 'Risk Analysis', icon: Shield, shortcut: '⌘R' },
    { id: 'export', label: 'Export Data', icon: Download, shortcut: '⌘S' },
    { id: 'import', label: 'Import Data', icon: Upload, shortcut: '⌘I' },
    { id: 'refresh', label: 'Refresh Dashboard', icon: RefreshCw, shortcut: '⌘⇧R' },
    { id: 'settings', label: 'Settings', icon: Settings, shortcut: '⌘,' },
    { id: 'theme', label: darkMode ? 'Light Mode' : 'Dark Mode', icon: darkMode ? Sun : Moon, shortcut: '⌘T' },
    { id: 'docs', label: 'Documentation', icon: FileText, shortcut: '⌘?' },
    { id: 'logout', label: 'Sign Out', icon: LogOut, shortcut: '⌘Q' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        handleCommand(filteredCommands[selectedIndex]);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, selectedIndex, filteredCommands]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleCommand = (command) => {
    if (command.id === 'theme') {
      setDarkMode(!darkMode);
    } else if (onCommand) {
      onCommand(command);
    }
    onClose();
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-card/95 backdrop-blur-xl border-primary/20">
            <div className="flex items-center px-4 py-3 border-b border-border/50">
              <Search className="h-5 w-5 text-muted-foreground mr-3" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 border-0 bg-transparent focus:ring-0 text-lg"
                autoFocus
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <kbd className="px-2 py-1 bg-muted rounded">↑↓</kbd>
                <span>Navigate</span>
                <kbd className="px-2 py-1 bg-muted rounded">↵</kbd>
                <span>Select</span>
                <kbd className="px-2 py-1 bg-muted rounded">ESC</kbd>
                <span>Close</span>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No commands found for "{search}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCommands.map((command, index) => (
                    <motion.button
                      key={command.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleCommand(command)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                        selectedIndex === index
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted/50 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <command.icon className={`h-5 w-5 ${
                          selectedIndex === index ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                        <span className="font-medium">{command.label}</span>
                      </div>
                      <kbd className="px-2 py-1 bg-muted/50 rounded text-xs text-muted-foreground">
                        {command.shortcut}
                      </kbd>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-border/50 bg-muted/30">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Command className="h-3 w-3" />
                  <span>Command Palette</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>{filteredCommands.length} commands</span>
                  <span>Press ⌘K to open</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;