
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { ArrowRight, XCircle, AlertTriangle } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface StatusControlsProps {
  action: CorrectiveAction;
  onStatusChange: (newStatus: CorrectiveAction['status']) => void;
}

const StatusControls = ({ action, onStatusChange }: StatusControlsProps) => {
  const [isAnnulDialogOpen, setIsAnnulDialogOpen] = useState(false);

  const getNextStatus = (): CorrectiveAction['status'] | null => {
    switch (action.status) {
      case 'Borrador':
        return 'Pendiente de Análisis';
      case 'Pendiente de Análisis':
        return 'Pendiente de Comprobación';
      case 'Pendiente de Comprobación':
        return 'Pendiente de Cierre';
      case 'Pendiente de Cierre':
        return 'Cerrado';
      default:
        return null;
    }
  };

  const getNextActionText = (): string => {
    switch (action.status) {
      case 'Borrador':
        return 'Enviar per Anàlisi';
      case 'Pendiente de Análisis':
        return 'Enviar per Comprovació';
      case 'Pendiente de Comprobación':
        return 'Enviar per Tancament';
      case 'Pendiente de Cierre':
        return 'Tancar Acció';
      default:
        return '';
    }
  };

  const canAdvance = (): boolean => {
    switch (action.status) {
      case 'Borrador':
        return action.description.trim().length > 0;
      case 'Pendiente de Análisis':
        return !!(action.analysisData?.rootCauses && action.analysisData?.proposedAction);
      case 'Pendiente de Comprobación':
        return !!action.verificationData?.implementationCheck;
      case 'Pendiente de Cierre':
        return !!(action.closureData?.closureNotes && action.closureData?.effectivenessEvaluation);
      default:
        return false;
    }
  };

  const getValidationMessage = (): string => {
    switch (action.status) {
      case 'Borrador':
        return 'Cal completar la descripció abans de continuar';
      case 'Pendiente de Análisis':
        return 'Cal completar l\'anàlisi de causes i l\'acció proposada';
      case 'Pendiente de Comprobación':
        return 'Cal completar la verificació de la implantació';
      case 'Pendiente de Cierre':
        return 'Cal completar les notes de tancament i l\'avaluació d\'eficàcia';
      default:
        return '';
    }
  };

  const nextStatus = getNextStatus();
  const canProceed = canAdvance();
  const canAnnul = !['Cerrado', 'Anulada'].includes(action.status);

  const handleAdvance = () => {
    if (nextStatus && canProceed) {
      onStatusChange(nextStatus);
    }
  };

  const handleAnnul = () => {
    onStatusChange('Anulada');
    setIsAnnulDialogOpen(false);
  };

  if (['Cerrado', 'Anulada'].includes(action.status)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accions d'Estat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {nextStatus && (
          <div className="space-y-2">
            <Button 
              onClick={handleAdvance}
              disabled={!canProceed}
              className="w-full"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              {getNextActionText()}
            </Button>
            {!canProceed && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {getValidationMessage()}
              </p>
            )}
          </div>
        )}
        
        {canAnnul && (
          <Dialog open={isAnnulDialogOpen} onOpenChange={setIsAnnulDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <XCircle className="w-4 h-4 mr-2" />
                Anul·lar Acció
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar Anul·lació</DialogTitle>
                <DialogDescription>
                  Estàs segur que vols anul·lar aquesta acció correctiva? 
                  Aquesta acció no es pot desfer i l'acció quedarà marcada com a anul·lada.
                </DialogDescription>
              </DialogHeader>
              <div className="flex space-x-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAnnulDialogOpen(false)}
                >
                  Cancel·lar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleAnnul}
                >
                  Confirmar Anul·lació
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusControls;
