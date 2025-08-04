import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';

const useLogsData = (autoRefresh = true) => {
  const { user, authenticatedFetch } = useAuth();
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // WebSocket connection
  useEffect(() => {
    if (!user) return;

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//sentinelmesh-api.onrender.com/ws/logs`;
    
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
  }, [user]);

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [logsResponse, alertsResponse] = await Promise.all([
        authenticatedFetch('https://sentinelmesh-api.onrender.com/logs'),
        authenticatedFetch('https://sentinelmesh-api.onrender.com/alerts?min_risk=80')
      ]);

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(Array.isArray(logsData.logs) ? logsData.logs : []);
      }

      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        setAlerts(Array.isArray(alertsData.alerts) ? alertsData.alerts : []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, authenticatedFetch]);

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


