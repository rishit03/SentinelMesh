import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api'; // Import the new API client

const useLogsData = (autoRefresh = true) => {
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket connection
  useEffect(() => {
    // The API_BASE_URL is defined in api.js, but for WebSocket, we need to derive it
    // from window.location or ensure it's passed. For now, let's keep it consistent
    // with the API client's base URL logic.
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const wsProtocol = API_BASE_URL.startsWith('https') ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${new URL(API_BASE_URL).host}/ws/logs`;
    
    let ws;
    let reconnectTimeout;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
        };
        
        ws.onmessage = (event) => {
          try {
            const newLog = JSON.parse(event.data);
            setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]); // Keep last 100 logs
            
            // Add to alerts if high risk
            if (newLog.risk >= 80) {
              setAlerts(prevAlerts => [newLog, ...prevAlerts.slice(0, 49)]); // Keep last 50 alerts
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        ws.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          
          // Attempt to reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000);
        };
        
        ws.onerror = (error) => {
          console.log('WebSocket error:', error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (ws) {
        ws.close();
      }
    };
  }, []); // Removed 'user' from dependency array as API client handles auth

  // Fetch data function
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use the new API client for fetching data
      const [logsData, alertsData] = await Promise.all([
        api.get('/logs'),
        api.get('/alerts?min_risk=80')
      ]);

      setLogs(Array.isArray(logsData.logs) ? logsData.logs : []);
      setAlerts(Array.isArray(alertsData.alerts) ? alertsData.alerts : []);

    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle error, e.g., set logs/alerts to empty array or show a message
      setLogs([]);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []); // Removed 'user' and 'authenticatedFetch' from dependency array

  // Initial data fetch and auto-refresh setup
  useEffect(() => {
    fetchData();

    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(fetchData, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData, autoRefresh]);

  return { logs, alerts, loading, isConnected, fetchData };
};

export default useLogsData;


