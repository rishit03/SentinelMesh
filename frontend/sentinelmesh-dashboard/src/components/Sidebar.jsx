import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Shield,
  Users,
  AlertCircle,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  Activity,
  BarChart3,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/logs', label: 'Logs', icon: FileText },
    { path: '/agents', label: 'Agents', icon: Users },
    { path: '/risk', label: 'Risk Analysis', icon: Shield },
    { path: '/alerts', label: 'Alerts', icon: AlertCircle },
    { path: '/users', label: 'Users', icon: User },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-30",
          isOpen ? "w-64" : "w-16"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {isOpen && (
            <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SentinelMesh
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto"
          >
            {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {isOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {isOpen && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">System Status</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">All systems operational</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;