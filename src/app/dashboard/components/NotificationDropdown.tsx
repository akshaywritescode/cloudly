import React from 'react';
import { Bell, Check, X, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown: React.FC = () => {
  const { 
    notificationCount, 
    notificationMessage, 
    isLoading, 
    refreshNotifications, 
    clearAllNotifications,
    lastUpdated 
  } = useNotifications();

  const getNotificationIcon = () => {
    if (notificationCount > 0) {
      return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
    return <Info className="w-4 h-4 text-blue-500" />;
  };

  const getNotificationType = () => {
    if (notificationCount > 0) {
      return 'warning';
    }
    return 'info';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <h3 className="font-semibold">Notifications</h3>
            {notificationCount > 0 && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {notificationCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshNotifications}
              disabled={isLoading}
              className="h-6 w-6 p-0"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600"></div>
              ) : (
                <Check className="w-3 h-3" />
              )}
            </Button>
            {notificationCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : notificationCount === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <CheckCircle className="w-8 h-8 mb-2 text-green-500" />
              <p className="text-sm">No notifications</p>
              <p className="text-xs">You're all caught up!</p>
            </div>
          ) : (
            <div className="p-3">
              {notificationMessage && (
                <div className={`flex items-start gap-3 p-3 rounded-lg border ${
                  getNotificationType() === 'warning' 
                    ? 'bg-orange-50 border-orange-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 break-words">
                      {notificationMessage}
                    </p>
                    {lastUpdated && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(lastUpdated), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {notificationCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={clearAllNotifications}
              className="text-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
