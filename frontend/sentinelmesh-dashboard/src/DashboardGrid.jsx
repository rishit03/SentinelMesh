import React, { useState, useCallback, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { 
  Settings, 
  RotateCcw, 
  Save, 
  Download, 
  Upload, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';
import StatsWidget from './widgets/StatsWidget.jsx';
import ChartWidget from './widgets/ChartWidget.jsx';
import LogsWidget from './widgets/LogsWidget.jsx';
import AlertsWidget from './widgets/AlertsWidget.jsx';
import AgentsWidget from './widgets/AgentsWidget.jsx';
import { useLayoutPersistence } from './hooks/useLayoutPersistence.js';

// Make ResponsiveGridLayout responsive
const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardGrid = ({
  logs = [],
  alerts = [],
  agentStats = {},
  agentChartData = [],
  riskChartData = [],
  lastUpdated,
  downloadData,
  showDetails = true,
  minRisk = 80,
  hoveredCard,
  setHoveredCard,
  user
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Use the layout persistence hook
  const {
    layouts,
    isLoading,
    lastSaved,
    saveLayouts,
    resetLayouts,
    updateLayouts,
    exportLayouts,
    importLayouts,
    hasUnsavedChanges
  } = useLayoutPersistence(user?.username);

  // Breakpoints for responsive design
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 12, sm: 12, xs: 4, xxs: 2 };

  const handleLayoutChange = useCallback((layout, newLayouts) => {
    updateLayouts(newLayouts);
  }, [updateLayouts]);

  const handleSaveLayout = async () => {
    setSaveStatus('saving');
    
    try {
      const success = saveLayouts(layouts);
      
      if (success) {
        setSaveStatus('saved');
        setIsEditMode(false);
        
        // Clear status after 3 seconds
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error('Failed to save layout:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleResetLayout = async () => {
    try {
      const success = resetLayouts();
      
      if (success) {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (error) {
      console.error('Failed to reset layout:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleImportLayout = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setSaveStatus('saving');
      await importLayouts(file);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Failed to import layout:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }

    // Reset file input
    event.target.value = '';
  };

  const getSystemStatus = () => {
    if (alerts.length > 0) return 'warning';
    return 'online';
  };

  const formatLastSaved = (date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  // Show loading state while layouts are being loaded
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard layout...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-200 dark:border-slate-700 gap-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Dashboard Layout
            </h2>
            {lastSaved && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last saved: {formatLastSaved(lastSaved)}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {isEditMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                Edit Mode
              </motion.div>
            )}
            
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {saveStatus === 'saving' && (
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                    Saving...
                  </Badge>
                )}
                {saveStatus === 'saved' && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Saved
                  </Badge>
                )}
                {saveStatus === 'error' && (
                  <Badge variant="outline" className="text-red-600 border-red-300">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Error
                  </Badge>
                )}
              </motion.div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Import/Export Controls */}
          <div className="flex items-center gap-1">
            <Button
              onClick={exportLayouts}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportLayout}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="layout-import"
              />
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                asChild
              >
                <label htmlFor="layout-import" className="cursor-pointer flex items-center">
                  <Upload className="h-3 w-3 mr-1" />
                  Import
                </label>
              </Button>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsEditMode(!isEditMode)}
              variant={isEditMode ? "default" : "outline"}
              size="sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isEditMode ? 'Exit Edit' : 'Customize'}
            </Button>
            
            {isEditMode && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2"
                >
                  <Button
                    onClick={handleResetLayout}
                    variant="outline"
                    size="sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button
                    onClick={handleSaveLayout}
                    variant="default"
                    size="sm"
                    disabled={saveStatus === 'saving'}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Layout
                  </Button>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>

      {/* Unsaved Changes Warning */}
      {isEditMode && hasUnsavedChanges(layouts) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3"
        >
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">You have unsaved changes</span>
          </div>
        </motion.div>
      )}

      {/* Grid Layout */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={handleLayoutChange}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={60}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        preventCollision={false}
        compactType="vertical"
      >
        {/* Stats Widgets */}
        <div key="total-logs">
          <StatsWidget
            title="Total Logs"
            value={logs.length}
            icon={() => <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-600 text-sm font-bold">L</div>}
            color="from-blue-500 to-blue-600"
            hoverText={`+${Math.floor(Math.random() * 10)} in last hour`}
            isHovered={hoveredCard === 'logs'}
            onHover={() => setHoveredCard('logs')}
            onHoverEnd={() => setHoveredCard(null)}
            className="h-full"
          />
        </div>

        <div key="active-alerts">
          <StatsWidget
            title="Active Alerts"
            value={alerts.length}
            icon={() => <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center text-red-600 text-sm font-bold">!</div>}
            color="from-red-500 to-red-600"
            hoverText={alerts.length > 0 ? 'Requires attention' : 'All clear'}
            isHovered={hoveredCard === 'alerts'}
            onHover={() => setHoveredCard('alerts')}
            onHoverEnd={() => setHoveredCard(null)}
            className="h-full"
          />
        </div>

        <div key="active-agents">
          <StatsWidget
            title="Active Agents"
            value={Object.keys(agentStats).length}
            icon={() => <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-600 text-sm font-bold">A</div>}
            color="from-green-500 to-green-600"
            hoverText={`Across ${user?.org}`}
            isHovered={hoveredCard === 'agents'}
            onHover={() => setHoveredCard('agents')}
            onHoverEnd={() => setHoveredCard(null)}
            className="h-full"
          />
        </div>

        <div key="system-status">
          <StatsWidget
            title="System Status"
            value={getSystemStatus()}
            icon={() => <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 text-sm font-bold">S</div>}
            color="from-purple-500 to-purple-600"
            hoverText="WebSocket: Connected"
            isHovered={hoveredCard === 'status'}
            onHover={() => setHoveredCard('status')}
            onHoverEnd={() => setHoveredCard(null)}
            className="h-full"
          />
        </div>

        {/* Content Widgets */}
        <div key="recent-logs">
          <LogsWidget
            logs={logs}
            title="Recent Logs"
            description="Real-time log stream from your AI agents"
            lastUpdated={lastUpdated}
            onExport={downloadData}
            showDetails={showDetails}
            maxHeight={300}
            className="h-full"
          />
        </div>

        <div key="security-alerts">
          <AlertsWidget
            alerts={alerts}
            title="Security Alerts"
            description="High-risk events requiring attention"
            minRisk={minRisk}
            onExport={downloadData}
            showDetails={showDetails}
            maxHeight={300}
            className="h-full"
          />
        </div>

        <div key="agent-activity">
          <ChartWidget
            title="Agent Activity"
            description="Message volume by agent"
            icon={() => <div className="w-5 h-5 rounded bg-blue-500 flex items-center justify-center text-white text-xs font-bold">📊</div>}
            chartType="bar"
            data={agentChartData}
            dataKey="messages"
            nameKey="name"
            height={250}
            className="h-full"
          />
        </div>

        <div key="risk-distribution">
          <ChartWidget
            title="Risk Distribution"
            description="Alert severity breakdown"
            icon={() => <div className="w-5 h-5 rounded bg-red-500 flex items-center justify-center text-white text-xs font-bold">📈</div>}
            chartType="pie"
            data={riskChartData}
            dataKey="value"
            nameKey="name"
            height={250}
            className="h-full"
          />
        </div>

        <div key="agent-status">
          <AgentsWidget
            agentStats={agentStats}
            title="Agent Status"
            description="Overview of all active agents in your organization"
            maxHeight={300}
            className="h-full"
          />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardGrid;