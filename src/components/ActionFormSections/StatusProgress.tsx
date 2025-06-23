
import React from 'react';
import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { CorrectiveAction } from '@/types';
import UserAvatar from '../UserAvatar';
import StatusHistoryTooltip from '../StatusHistoryTooltip';

interface StatusProgressProps {
  action: CorrectiveAction;
}

const StatusProgress = ({ action }: StatusProgressProps) => {
  const statusOrder = [
    'Borrador',
    'Pendiente de Análisis',
    'Pendiente de Comprobación',
    'Pendiente de Cierre',
    'Cerrado'
  ];

  const getCurrentIndex = () => {
    if (action.status === 'Anulada') return -1;
    return statusOrder.indexOf(action.status);
  };

  const currentIndex = getCurrentIndex();

  // Crear historial per defecte si no existeix
  const getStatusHistory = () => {
    if (action.statusHistory && action.statusHistory.length > 0) {
      return action.statusHistory;
    }
    
    // Crear entrada per l'estat actual si no hi ha historial
    return [{
      status: action.status,
      date: action.updatedAt,
      userId: 'system',
      userName: 'Sistema'
    }];
  };

  const statusHistory = getStatusHistory();

  const getHistoryForStatus = (status: string) => {
    return statusHistory.find(entry => entry.status === status);
  };

  const getNextHistoryEntry = (status: string) => {
    const currentEntry = statusHistory.find(entry => entry.status === status);
    if (!currentEntry) return undefined;
    
    const currentEntryIndex = statusHistory.indexOf(currentEntry);
    return statusHistory[currentEntryIndex + 1];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  return (
    <div className="space-y-3">
      {statusOrder.map((status, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isAnulled = action.status === 'Anulada';
        const historyEntry = getHistoryForStatus(status);
        const nextEntry = getNextHistoryEntry(status);
        
        const statusElement = (
          <div 
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              historyEntry ? 'hover:bg-gray-50 cursor-pointer' : ''
            }`}
          >
            {isAnulled ? (
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            ) : isCompleted ? (
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : isCurrent ? (
              <Circle className="w-4 h-4 text-blue-500 fill-blue-500 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${
                  isCompleted ? 'text-green-700' : 
                  isCurrent ? 'text-blue-700' : 
                  isAnulled ? 'text-red-500 line-through' :
                  'text-gray-500'
                }`}>
                  {status}
                </span>
                
                <div className="flex items-center space-x-2">
                  {historyEntry && (
                    <>
                      <span className="text-xs text-gray-500">
                        {formatDate(historyEntry.date)}
                      </span>
                      <UserAvatar 
                        userName={historyEntry.userName}
                        size="sm"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

        return (
          <div key={status}>
            {historyEntry ? (
              <StatusHistoryTooltip 
                historyEntry={historyEntry}
                nextEntry={nextEntry}
                isActive={isCurrent}
              >
                {statusElement}
              </StatusHistoryTooltip>
            ) : (
              statusElement
            )}
          </div>
        );
      })}
      
      {action.status === 'Anulada' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 font-medium text-sm">Acció Anul·lada</span>
            </div>
            {getHistoryForStatus('Anulada') && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-red-600">
                  {formatDate(getHistoryForStatus('Anulada')!.date)}
                </span>
                <UserAvatar 
                  userName={getHistoryForStatus('Anulada')!.userName}
                  size="sm"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusProgress;
