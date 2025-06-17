
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { CorrectiveAction } from '@/types';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progrés de l'Acció</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusOrder.map((status, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isAnulled = action.status === 'Anulada';
            
            return (
              <div key={status} className="flex items-center space-x-3">
                {isAnulled ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : isCurrent ? (
                  <Circle className="w-5 h-5 text-blue-500 fill-blue-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                <span className={`${
                  isCompleted ? 'text-green-700' : 
                  isCurrent ? 'text-blue-700 font-medium' : 
                  isAnulled ? 'text-red-500 line-through' :
                  'text-gray-500'
                }`}>
                  {status}
                </span>
              </div>
            );
          })}
          {action.status === 'Anulada' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-700 font-medium">Acció Anul·lada</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusProgress;
