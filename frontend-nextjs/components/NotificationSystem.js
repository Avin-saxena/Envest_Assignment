import { useState, useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const NotificationSystem = ({ notifications, onDismiss }) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleDismiss = (id) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
    if (onDismiss) onDismiss(id);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-success-600" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-warning-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-danger-600" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-accent-600" />;
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-800';
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800';
      case 'error':
        return 'bg-danger-50 border-danger-200 text-danger-800';
      default:
        return 'bg-accent-50 border-accent-200 text-accent-800';
    }
  };

  if (!visibleNotifications.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {visibleNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification-enter ${getNotificationStyle(notification.type)} border rounded-xl p-4 shadow-lg backdrop-blur-sm`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{notification.title}</h4>
              <p className="text-sm mt-1 opacity-90">{notification.message}</p>
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className="text-xs font-medium underline mt-2 hover:no-underline transition-all duration-200"
                >
                  {notification.action.text}
                </button>
              )}
            </div>
            <button
              onClick={() => handleDismiss(notification.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto-dismiss after 5 seconds unless it's an error
    if (notification.type !== 'error') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    }

    return id;
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Smart portfolio notifications
  const addPortfolioAlert = (type, stock, message, action) => {
    addNotification({
      type,
      title: `Portfolio Alert: ${stock}`,
      message,
      action
    });
  };

  const addNewsAlert = (title, message, urgency = 'info') => {
    // Check if a similar notification already exists to prevent duplicates
    const isDuplicate = notifications.some(notification => 
      notification.title === title && notification.message === message
    );
    
    if (!isDuplicate) {
      addNotification({
        type: urgency,
        title,
        message
      });
    }
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAll,
    addPortfolioAlert,
    addNewsAlert
  };
};

export default NotificationSystem; 