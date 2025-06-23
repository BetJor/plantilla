
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CorrectiveAction } from '@/types';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { AlertCircle, Calendar, User, Building } from 'lucide-react';

interface ActionPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionId: string | null;
}

const ActionPreviewDialog = ({ open, onOpenChange, actionId }: ActionPreviewDialogProps) => {
  const { actions } = useCorrectiveActions();
  
  const action = actionId ? actions.find(a => a.id === actionId) : null;

  if (!action) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Acció no trobada</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <p>No s'ha pogut carregar l'acció sol·licitada.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Borrador': return 'secondary';
      case 'Pendiente de Análisis': return 'default';
      case 'Pendiente de Comprobación': return 'default';
      case 'Pendiente de Cierre': return 'destructive';
      case 'Cerrado': return 'secondary';
      case 'Anulada': return 'destructive';
      default: return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'crítica': return 'destructive';
      case 'alta': return 'destructive';
      case 'mitjana': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <ResizablePanelGroup direction="vertical" className="min-h-[600px]">
          <ResizablePanel defaultSize={100}>
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{action.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">ID: {action.id}</p>
                </div>
                <div className="flex space-x-2">
                  <Badge variant={getPriorityVariant(action.priority)}>
                    {action.priority}
                  </Badge>
                  <Badge variant={getStatusVariant(action.status)}>
                    {action.status}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Building className="w-4 h-4" />
                      Ubicació
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{action.centre}</p>
                    {action.department && (
                      <p className="text-sm text-gray-600">{action.department}</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4" />
                      Responsable
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{action.assignedTo}</p>
                    {action.dueDate && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(action.dueDate).toLocaleDateString('ca-ES')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Descripció</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{action.description}</p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Tipus</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{action.type}</Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Categoria</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">{action.category}</Badge>
                  </CardContent>
                </Card>
              </div>

              {action.analysisData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Anàlisi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {action.analysisData.rootCause && (
                      <div>
                        <h4 className="font-medium text-sm mb-1">Causa arrel:</h4>
                        <p className="text-gray-700 text-sm">{action.analysisData.rootCause}</p>
                      </div>
                    )}
                    {action.analysisData.proposedActions && action.analysisData.proposedActions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Accions proposades:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                          {action.analysisData.proposedActions.map((actionItem, idx) => (
                            <li key={idx}>{actionItem}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {action.closureData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Tancament</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{action.closureData.closureNotes}</p>
                    {action.closureData.closureDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                        <Calendar className="w-3 h-3" />
                        Tancat el {new Date(action.closureData.closureDate).toLocaleDateString('ca-ES')}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </DialogContent>
    </Dialog>
  );
};

export default ActionPreviewDialog;
