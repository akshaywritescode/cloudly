import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getUserNotifications, clearNotifications, NotificationData } from '@/lib/notifications';

interface NotificationContextType {
  notificationCount: number;
  notificationMessage: string | null;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  lastUpdated: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const refreshNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const notificationData = await getUserNotifications();
      if (notificationData) {
        setNotificationCount(notificationData.notification_count);
        setNotificationMessage(notificationData.notification);
        setLastUpdated(notificationData.last_updated || null);
      }
    } catch (error) {
      console.error('Failed to refresh notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAllNotifications = useCallback(async () => {
    try {
      const success = await clearNotifications();
      if (success) {
        setNotificationCount(0);
        setNotificationMessage(null);
        setLastUpdated(new Date().toISOString());
      }
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }, []);

  // Auto-refresh notifications on mount and periodically
  useEffect(() => {
    refreshNotifications();
    
    // Refresh every 30 seconds
    const interval = setInterval(refreshNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const contextValue: NotificationContextType = {
    notificationCount,
    notificationMessage,
    isLoading,
    refreshNotifications,
    clearAllNotifications,
    lastUpdated
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
