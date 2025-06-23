
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, MessageSquare } from 'lucide-react';
import { StatusHistoryEntry } from '@/types';
import UserAvatar from './UserAvatar';

interface StatusHistoryTooltipProps {
  historyEntry: StatusHistoryEntry;
  nextEntry?: StatusHistoryEntry;
  isActive?: boolean;
  children: React.ReactNode;
}

const StatusHistoryTooltip = ({ historyEntry, nextEntry, isActive, children }: StatusHistoryTooltipProps) => {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('ca-ES'),
      time: date.toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const calculateDuration = () => {
    if (!nextEntry) {
      if (isActive) {
        return 'En curs';
      }
      return 'Final';
    }
    
    const startDate = new Date(historyEntry.date);
    const endDate = new Date(nextEntry.date);
    const diffInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Mateix dia';
    if (diffInDays === 1) return '1 dia';
    return `${diffInDays} dies`;
  };

  const { date, time } = formatDateTime(historyEntry.date);

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-medium">
              {historyEntry.status}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{calculateDuration()}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{date}</span>
              <span className="text-sm text-gray-500">{time}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <UserAvatar userName={historyEntry.userName} size="sm" />
              <span className="text-sm">{historyEntry.userName}</span>
            </div>
            
            {historyEntry.notes && (
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Notes:</span>
                  <p className="mt-1">{historyEntry.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default StatusHistoryTooltip;
