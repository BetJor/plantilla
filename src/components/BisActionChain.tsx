
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, ExternalLink } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface BisActionChainProps {
  actions: CorrectiveAction[];
  currentActionId: string;
}

const BisActionChain = ({ actions, currentActionId }: BisActionChainProps) => {
  // Trobar la cadena d'accions relacionades
  const findActionChain = (actionId: string): CorrectiveAction[] => {
    const chain: CorrectiveAction[] = [];
    const currentAction = actions.find(a => a.id === actionId);
    
    if (!currentAction) return chain;
    
    // Si és una acció BIS, trobar l'original
    if (currentAction.esBis && currentAction.accionOriginal) {
      const originalAction = actions.find(a => a.id === currentAction.accionOriginal);
      if (originalAction) {
        chain.push(originalAction);
      }
    } else {
      chain.push(currentAction);
    }
    
    // Trobar totes les accions BIS derivades
    const bisActions = actions.filter(a => 
      a.esBis && (a.accionOriginal === actionId || 
        (currentAction.esBis && a.accionOriginal === currentAction.accionOriginal))
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    chain.push(...bisActions);
    
    return chain;
  };

  const actionChain = findActionChain(currentActionId);
  
  if (actionChain.length <= 1) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cerrado': return 'bg-green-500';
      case 'Anulada': return 'bg-red-500';
      case 'Borrador': return 'bg-purple-500';
      default: return 'bg-blue-500';
    }
  };

  const handleViewAction = (actionId: string) => {
    window.open(`/actions/${actionId}`, '_blank');
  };

  return (
    <div className="space-y-3">
      {actionChain.map((action) => (
        <Card key={action.id} className={`${action.id === currentActionId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {action.esBis && (
                    <Badge variant="destructive" className="text-xs">
                      BIS
                    </Badge>
                  )}
                  <Badge className={`${getStatusColor(action.status)} text-white text-xs`}>
                    {action.status}
                  </Badge>
                  {action.id === currentActionId && (
                    <Badge variant="outline" className="text-xs">
                      Actual
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium text-sm truncate mb-1">{action.title}</h4>
                <p className="text-xs text-gray-500">
                  ID: {action.id} • {new Date(action.createdAt).toLocaleDateString('ca-ES')}
                </p>
              </div>
              {action.id !== currentActionId && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewAction(action.id)}
                  className="ml-2 flex-shrink-0"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Veure
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {actionChain.filter(a => a.esBis).length > 0 && (
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Patró detectat:</strong> Aquesta cadena conté {actionChain.filter(a => a.esBis).length} acció(ns) BIS.
          </p>
        </div>
      )}
    </div>
  );
};

export default BisActionChain;
