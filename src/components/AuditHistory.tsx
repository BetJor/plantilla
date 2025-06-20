
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Edit, 
  ArrowRight, 
  MessageSquare, 
  UserCheck, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { AuditEntry } from '@/hooks/useAuditHistory';
import { formatDistanceToNow } from 'date-fns';
import { ca } from 'date-fns/locale';

interface AuditHistoryProps {
  entries: AuditEntry[];
  title?: string;
  maxHeight?: string;
}

const AuditHistory: React.FC<AuditHistoryProps> = ({ 
  entries, 
  title = "Historial d'Activitat",
  maxHeight = "400px"
}) => {
  const getActionIcon = (action: AuditEntry['action']) => {
    switch (action) {
      case 'created':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'updated':
        return <Edit className="w-4 h-4 text-yellow-600" />;
      case 'status_changed':
        return <ArrowRight className="w-4 h-4 text-purple-600" />;
      case 'commented':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'assigned':
        return <UserCheck className="w-4 h-4 text-orange-600" />;
      case 'closed':
        return <CheckCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionLabel = (action: AuditEntry['action']) => {
    switch (action) {
      case 'created':
        return 'Creada';
      case 'updated':
        return 'Actualitzada';
      case 'status_changed':
        return 'Estat canviat';
      case 'commented':
        return 'Comentari';
      case 'assigned':
        return 'Reassignada';
      case 'closed':
        return 'Tancada';
      default:
        return action;
    }
  };

  const getActionColor = (action: AuditEntry['action']) => {
    switch (action) {
      case 'created':
        return 'bg-blue-100 text-blue-800';
      case 'updated':
        return 'bg-yellow-100 text-yellow-800';
      case 'status_changed':
        return 'bg-purple-100 text-purple-800';
      case 'commented':
        return 'bg-green-100 text-green-800';
      case 'assigned':
        return 'bg-orange-100 text-orange-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">
            No hi ha activitat registrada
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {title}
          </div>
          <Badge variant="secondary">
            {entries.length} {entries.length === 1 ? 'entrada' : 'entrades'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea style={{ height: maxHeight }}>
          <div className="space-y-4">
            {entries.map((entry, index) => (
              <div key={entry.id}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(entry.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getActionColor(entry.action)}>
                          {getActionLabel(entry.action)}
                        </Badge>
                        <span className="text-sm font-medium text-gray-900">
                          {entry.userName}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(entry.timestamp), { 
                          addSuffix: true,
                          locale: ca 
                        })}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">
                      {entry.details.description}
                    </p>
                    
                    {entry.changes && Object.keys(entry.changes).length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <details className="cursor-pointer">
                          <summary className="hover:text-gray-700">
                            Veure canvis detallats
                          </summary>
                          <div className="mt-1 pl-4 border-l-2 border-gray-200">
                            {Object.entries(entry.changes).map(([field, change]) => (
                              <div key={field} className="py-1">
                                <strong>{field}:</strong>{' '}
                                <span className="text-red-600">"{String(change.from)}"</span>{' '}
                                → <span className="text-green-600">"{String(change.to)}"</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
                
                {index < entries.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AuditHistory;
