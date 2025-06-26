
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import { CorrectiveAction } from '@/types';
import { Link } from 'react-router-dom';

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
        chain.push(...findActionChain(originalAction.id));
      }
    } else {
      chain.push(currentAction);
    }
    
    // Afegir l'acció actual si no està ja a la cadena
    if (!chain.some(a => a.id === currentAction.id)) {
      chain.push(currentAction);
    }
    
    // Trobar totes les accions BIS derivades
    const bisActions = actions.filter(a => 
      a.esBis && a.accionOriginal === actionId
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    chain.push(...bisActions);
    
    return chain;
  };

  const actionChain = findActionChain(currentActionId);
  
  if (actionChain.length <= 1) {
    return null; // No mostrar si no hi ha cadena
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cerrado': return 'bg-green-100 text-green-800';
      case 'Anulada': return 'bg-red-100 text-red-800';
      case 'Borrador': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <RotateCcw className="w-5 h-5 mr-2" />
          Cadena d'Accions BIS
          {actionChain.filter(a => a.esBis).length > 1 && (
            <Badge variant="destructive" className="ml-2">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Múltiples BIS
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actionChain.map((action, index) => (
            <div key={action.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  {action.esBis && (
                    <Badge variant="destructive" className="bg-orange-500">
                      BIS
                    </Badge>
                  )}
                  <Badge className={getStatusColor(action.status)}>
                    {action.status}
                  </Badge>
                  <span className="font-medium">
                    {action.id === currentActionId ? (
                      action.title
                    ) : (
                      <Button variant="link" asChild className="p-0 h-auto text-blue-600">
                        <Link to={`/actions/${action.id}`}>
                          {action.title}
                        </Link>
                      </Button>
                    )}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Creat: {new Date(action.createdAt).toLocaleDateString('ca-ES')}
                  {action.tipoCierre && (
                    <span className={`ml-2 ${action.tipoCierre === 'no-conforme' ? 'text-red-600' : 'text-green-600'}`}>
                      • {action.tipoCierre === 'no-conforme' ? 'NO CONFORME' : 'CONFORME'}
                    </span>
                  )}
                </div>
              </div>
              
              {index < actionChain.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
        
        {actionChain.filter(a => a.esBis).length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Patró d'accions no conformes detectat</p>
                <p className="text-yellow-700 mt-1">
                  Aquesta cadena conté {actionChain.filter(a => a.esBis).length} acció(ns) BIS. 
                  Considera revisar les causes arrel per prevenir futures incidències.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BisActionChain;
