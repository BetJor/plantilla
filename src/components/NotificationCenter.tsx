
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Bell, Eye, Trash2, CheckCheck, ExternalLink } from 'lucide-react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';

const NotificationCenter = () => {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    getMetrics 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [showFullCenter, setShowFullCenter] = useState(false);
  
  const metrics = getMetrics();
  const recentNotifications = notifications
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'retraso':
        return '🔴';
      case 'proximo-vencimiento':
        return '🟡';
      case 'cerrada':
        return '✅';
      default:
        return '📋';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'retraso':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'proximo-vencimiento':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'cerrada':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/10">
            <Bell className="w-5 h-5" />
            {metrics.unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {metrics.unreadCount > 99 ? '99+' : metrics.unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notificacions</h3>
              <div className="flex space-x-2">
                {metrics.unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-6 px-2"
                  >
                    <CheckCheck className="w-3 h-3" />
                  </Button>
                )}
                <Dialog open={showFullCenter} onOpenChange={setShowFullCenter}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>Centre de Notificacions</DialogTitle>
                      <DialogDescription>
                        Gestiona totes les teves notificacions aquí
                      </DialogDescription>
                    </DialogHeader>
                    <FullNotificationCenter 
                      notifications={notifications}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            {metrics.unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {metrics.unreadCount} notificacions no llegides
              </p>
            )}
          </div>
          <ScrollArea className="h-80">
            {recentNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No hi ha notificacions
              </div>
            ) : (
              <div className="p-2">
                {recentNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <div
                      className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(notification.createdAt), { 
                              addSuffix: true, 
                              locale: ca 
                            })}
                          </p>
                        </div>
                        <Link 
                          to={`/actions/${notification.actionId}`}
                          className="text-blue-500 hover:text-blue-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                    {index < recentNotifications.length - 1 && <Separator className="my-1" />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          {notifications.length > 5 && (
            <div className="p-2 border-t">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => setShowFullCenter(true)}
              >
                Veure totes les notificacions ({notifications.length})
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

// Component per mostrar totes les notificacions
const FullNotificationCenter = ({ 
  notifications, 
  onMarkAsRead, 
  onDelete 
}: {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const sortedNotifications = notifications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'retraso':
        return '🔴';
      case 'proximo-vencimiento':
        return '🟡';
      case 'cerrada':
        return '✅';
      default:
        return '📋';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'retraso':
        return 'border-red-200 bg-red-50';
      case 'proximo-vencimiento':
        return 'border-yellow-200 bg-yellow-50';
      case 'cerrada':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <ScrollArea className="h-96">
      {sortedNotifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hi ha notificacions
        </div>
      ) : (
        <div className="space-y-3">
          {sortedNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`${getNotificationColor(notification.type)} ${
                !notification.isRead ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Per: {notification.recipient}</span>
                        <span>
                          {formatDistanceToNow(new Date(notification.createdAt), { 
                            addSuffix: true, 
                            locale: ca 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Link to={`/actions/${notification.actionId}`}>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </Link>
                    {!notification.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onMarkAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(notification.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default NotificationCenter;
