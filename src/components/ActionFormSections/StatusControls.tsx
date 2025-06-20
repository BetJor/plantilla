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
import { useWorkflow } from '@/hooks/useWorkflow';

interface StatusControlsProps {
  action: CorrectiveAction;
  onStatusChange: (newStatus: CorrectiveAction['status']) => void;
  user?: any; // Mock user per testing
}

const StatusControls = ({ 
  action, 
  onStatusChange, 
  user = { id: 'current-user', specificRoles: ['direccio-qualitat'] }
}: StatusControlsProps) => {
  const [isAnnulDialogOpen, setIsAnnulDialogOpen] = useState(false);
  const { canEditInStatus } = useWorkflow({ user, action });

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
        return action.description.trim().length > 0 && 
               !!action.type && 
               !!action.category && 
               action.subCategory.trim().length > 0 &&
               !!action.responsableAnalisis &&
               !!action.fechaLimiteAnalisis;
      case 'Pendiente de Análisis':
        // Només validar anàlisi de causes i accions proposades amb dades
        const hasRootCauses = !!(action.analysisData?.rootCauses?.trim());
        const proposedActions = action.analysisData?.proposedActions || [];
        const hasValidProposedActions = proposedActions.length > 0 && 
          proposedActions.every(proposedAction => 
            proposedAction.description?.trim() &&
            proposedAction.assignedTo?.trim() &&
            proposedAction.dueDate
          );
        
        return hasRootCauses && hasValidProposedActions;
      case 'Pendiente de Comprobación':
        // Verificar que totes les accions proposades han estat verificades
        const proposedActionsForVerification = action.analysisData?.proposedActions || [];
        const allActionsVerified = proposedActionsForVerification.every(proposedAction => 
          proposedAction.verificationStatus && proposedAction.verificationStatus !== 'not-verified'
        );
        return !!(allActionsVerified && 
                 proposedActionsForVerification.length > 0 &&
                 action.responsableCierre &&
                 action.fechaLimiteCierre);
      case 'Pendiente de Cierre':
        return !!(action.closureData?.closureNotes && 
                 action.closureData?.effectivenessEvaluation &&
                 action.tipoCierre);
      default:
        return false;
    }
  };

  const getValidationMessage = (): string => {
    switch (action.status) {
      case 'Borrador':
        const missing = [];
        if (!action.description.trim()) missing.push('descripció');
        if (!action.type) missing.push('tipus d\'acció');
        if (!action.category) missing.push('categoria');
        if (!action.subCategory.trim()) missing.push('subcategoria');
        if (!action.responsableAnalisis) missing.push('responsable d\'anàlisi');
        if (!action.fechaLimiteAnalisis) missing.push('data límit anàlisi');
        return `Cal completar: ${missing.join(', ')}`;
      case 'Pendiente de Análisis':
        const missingAnalysis = [];
        if (!action.analysisData?.rootCauses?.trim()) {
          missingAnalysis.push('anàlisi de causes');
        }
        
        const proposedActions = action.analysisData?.proposedActions || [];
        if (proposedActions.length === 0) {
          missingAnalysis.push('almenys una acció proposada');
        } else {
          const incompleteActions = proposedActions.filter(proposedAction => 
            !proposedAction.description?.trim() || 
            !proposedAction.assignedTo?.trim() || 
            !proposedAction.dueDate
          );
          if (incompleteActions.length > 0) {
            missingAnalysis.push(`dades completes per ${incompleteActions.length} accions`);
          }
        }
        
        return `Cal completar: ${missingAnalysis.join(', ')}`;
      case 'Pendiente de Comprobación':
        const missingVerification = [];
        const proposedActionsForVerification = action.analysisData?.proposedActions || [];
        const unverifiedActions = proposedActionsForVerification.filter(proposedAction => 
          !proposedAction.verificationStatus || proposedAction.verificationStatus === 'not-verified'
        );
        
        if (unverifiedActions.length > 0) {
          missingVerification.push(`verificació de ${unverifiedActions.length} accions`);
        }
        if (!action.responsableCierre) missingVerification.push('responsable de tancament');
        if (!action.fechaLimiteCierre) missingVerification.push('data límit tancament');
        return `Cal completar: ${missingVerification.join(', ')}`;
      case 'Pendiente de Cierre':
        const missingClosure = [];
        if (!action.closureData?.closureNotes) missingClosure.push('notes de tancament');
        if (!action.closureData?.effectivenessEvaluation) missingClosure.push('avaluació d\'eficàcia');
        if (!action.tipoCierre) missingClosure.push('tipus de tancament');
        return `Cal completar: ${missingClosure.join(', ')}`;
      default:
        return '';
    }
  };

  const nextStatus = getNextStatus();
  const canProceed = canAdvance() && canEditInStatus(action.status);
  const canAnnul = !['Cerrado', 'Anulada'].includes(action.status) && canEditInStatus(action.status);

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

  // Si l'usuari no pot editar en aquest estat, només mostrar informació
  if (!canEditInStatus(action.status)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estat de l'Acció</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-700">
              No tens permisos per editar aquesta acció en l'estat actual: <strong>{action.status}</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    );
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
