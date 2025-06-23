
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Calendar, 
  User, 
  Building, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  UserCheck, 
  Bell, 
  ArrowUpDown,
  Target,
  Activity
} from 'lucide-react';
import { CorrectiveAction } from '@/types';
import UserAvatar from './UserAvatar';

interface ControlPanelSectionProps {
  action: CorrectiveAction;
  onUpdate?: (updates: Partial<CorrectiveAction>) => void;
}

const ControlPanelSection = ({ action, onUpdate }: ControlPanelSectionProps) => {
  // Càlculs de temps i progrés
  const now = new Date();
  const dueDate = new Date(action.dueDate);
  const createdDate = new Date(action.createdAt);
  const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isOverdue = daysUntilDue < 0;
  const isUrgent = daysUntilDue <= 3 && daysUntilDue >= 0;

  // Càlcul del progrés basat en l'estat
  const getStatusProgress = () => {
    switch (action.status) {
      case 'Borrador': return 10;
      case 'Pendiente de Análisis': return 25;
      case 'Pendiente de Comprobación': return 60;
      case 'Pendiente de Cierre': return 85;
      case 'Cerrado': return 100;
      case 'Anulada': return 0;
      default: return 0;
    }
  };

  // Temps mitjà estimat per estat (simulat)
  const getAverageTimeForStatus = () => {
    switch (action.status) {
      case 'Pendiente de Análisis': return 5;
      case 'Pendiente de Comprobación': return 10;
      case 'Pendiente de Cierre': return 3;
      default: return 0;
    }
  };

  const statusProgress = getStatusProgress();
  const averageTime = getAverageTimeForStatus();

  // Indicadors de risc
  const getRiskLevel = () => {
    if (isOverdue) return { level: 'high', text: 'Alt risc', color: 'text-red-600' };
    if (isUrgent) return { level: 'medium', text: 'Risc mitjà', color: 'text-orange-600' };
    return { level: 'low', text: 'Baix risc', color: 'text-green-600' };
  };

  const risk = getRiskLevel();

  // Accions recomanades
  const getRecommendedActions = () => {
    const recommendations = [];
    
    if (isOverdue) {
      recommendations.push('Contactar responsable urgentment');
    }
    if (daysSinceCreated > averageTime && action.status !== 'Cerrado') {
      recommendations.push('Considerar escalació');
    }
    if (isUrgent) {
      recommendations.push('Preparar documentació de seguiment');
    }
    
    return recommendations;
  };

  const recommendations = getRecommendedActions();

  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'notify':
        console.log('Notificar responsable:', action.assignedTo);
        break;
      case 'reassign':
        console.log('Reassignar acció');
        break;
      case 'priority':
        console.log('Canviar prioritat');
        break;
    }
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Control Panel
            </div>
            <Badge variant={risk.level === 'high' ? 'destructive' : risk.level === 'medium' ? 'default' : 'secondary'}>
              {risk.text}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informació essencial amb indicadors */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className={`w-4 h-4 ${isOverdue ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-gray-500'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-700">Data Límit</p>
                  <p className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                    {dueDate.toLocaleDateString('ca-ES')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">
                  {isOverdue ? `${Math.abs(daysUntilDue)} dies de retard` : `${daysUntilDue} dies restants`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <UserAvatar userName={action.assignedTo} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Assignat a</p>
                  <p className="text-sm text-gray-900">{action.assignedTo}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleQuickAction('reassign')}>
                <ArrowUpDown className="w-3 h-3 mr-1" />
                Reassignar
              </Button>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Building className="w-4 h-4 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Centre</p>
                <p className="text-sm text-gray-900">{action.centre}</p>
                {action.department && (
                  <p className="text-xs text-gray-600">{action.department}</p>
                )}
              </div>
            </div>
          </div>

          {/* Mètriques de progrés */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progrés General</span>
              <span className="text-sm text-gray-600">{statusProgress}%</span>
            </div>
            <Progress value={statusProgress} className="h-2" />
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {daysSinceCreated} dies activa
              </div>
              {averageTime > 0 && (
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Mitjana: {averageTime} dies
                </div>
              )}
            </div>
          </div>

          {/* Controls ràpids */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Accions Ràpides</h4>
            <div className="flex space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleQuickAction('notify')}>
                    <Bell className="w-3 h-3 mr-1" />
                    Notificar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enviar notificació al responsable</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => handleQuickAction('priority')}>
                    <Target className="w-3 h-3 mr-1" />
                    Prioritat
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Canviar nivell de prioritat</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Seguiment
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Afegir al seguiment personalitzat</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Recomanacions IA */}
          {recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Recomanacions
              </h4>
              <div className="space-y-1">
                {recommendations.map((rec, index) => (
                  <div key={index} className="text-xs text-gray-600 bg-blue-50 p-2 rounded flex items-center">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mr-2" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estadístiques comparatives */}
          <div className="pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-lg font-semibold text-green-600">{statusProgress}%</p>
                <p className="text-xs text-green-700">Completat</p>
              </div>
              <div className={`p-3 rounded-lg ${isOverdue ? 'bg-red-50' : 'bg-blue-50'}`}>
                <p className={`text-lg font-semibold ${isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                  {Math.abs(daysUntilDue)}
                </p>
                <p className={`text-xs ${isOverdue ? 'text-red-700' : 'text-blue-700'}`}>
                  {isOverdue ? 'Dies retard' : 'Dies restants'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ControlPanelSection;
