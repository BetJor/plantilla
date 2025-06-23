import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowRight, XCircle, AlertTriangle, Save } from 'lucide-react';
import { CorrectiveAction } from '@/types';
import { useWorkflow } from '@/hooks/useWorkflow';

interface FloatingActionButtonsProps {
  action: CorrectiveAction;
  onStatusChange: (newStatus: CorrectiveAction['status']) => void;
  onSave?: () => void;
  hasPendingChanges?: boolean;
  user?: any;
}

const FloatingActionButtons = ({ 
  action, 
  onStatusChange,
  onSave,
  hasPendingChanges = false,
  user = { id: 'current-user', specificRoles: ['direccio-qualitat'] }
}: FloatingActionButtonsProps) => {
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

  const getSaveButtonText = (): string => {
    return 'Guardar';
  };

  const shouldShowSaveButton = (): boolean => {
    return ['Borrador', 'Pendiente de Análisis', 'Pendiente de Cierre'].includes(action.status) && 
           hasPendingChanges && 
           canEditInStatus(action.status);
  };

  const canAdvance = (): boolean => {
    switch (action.status) {
      case 'Borrador':
        return action.description.trim().length > 0 && 
               !!action.type && 
               !!action.category && 
               action.subCategory.trim().length > 0 &&
               !!action.responsableAnalisis;
      case 'Pendiente de Análisis':
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
        const proposedActionsForVerification = action.analysisData?.proposedActions || [];
        const allActionsVerified = proposedActionsForVerification.every(proposedAction => 
          proposedAction.verificationStatus && proposedAction.verificationStatus !== 'not-verified'
        );
        return !!(allActionsVerified && proposedActionsForVerification.length > 0);
      case 'Pendiente de Cierre':
        const canAdvanceResult = !!(action.closureData?.closureNotes && 
                 action.closureData?.effectivenessEvaluation &&
                 action.tipoCierre);
        
        // Debug log per identificar el problema
        console.log('FloatingActionButtons: Validació Pendiente de Cierre', {
          closureNotes: !!action.closureData?.closureNotes,
          closureNotesValue: action.closureData?.closureNotes,
          effectivenessEvaluation: !!action.closureData?.effectivenessEvaluation,
          effectivenessValue: action.closureData?.effectivenessEvaluation,
          tipoCierre: !!action.tipoCierre,
          tipoCierreValue: action.tipoCierre,
          canAdvanceResult
        });
        
        return canAdvanceResult;
      default:
        return false;
    }
  };

  const getValidationErrors = (): number => {
    let errors = 0;
    switch (action.status) {
      case 'Borrador':
        if (!action.description.trim()) errors++;
        if (!action.type) errors++;
        if (!action.category) errors++;
        if (!action.subCategory.trim()) errors++;
        if (!action.responsableAnalisis) errors++;
        break;
      case 'Pendiente de Análisis':
        if (!action.analysisData?.rootCauses?.trim()) errors++;
        const proposedActions = action.analysisData?.proposedActions || [];
        if (proposedActions.length === 0) errors++;
        else {
          errors += proposedActions.filter(pa => 
            !pa.description?.trim() || !pa.assignedTo?.trim() || !pa.dueDate
          ).length;
        }
        break;
      case 'Pendiente de Comprobación':
        const proposedActionsForVerification = action.analysisData?.proposedActions || [];
        errors += proposedActionsForVerification.filter(pa => 
          !pa.verificationStatus || pa.verificationStatus === 'not-verified'
        ).length;
        break;
      case 'Pendiente de Cierre':
        if (!action.closureData?.closureNotes) errors++;
        if (!action.closureData?.effectivenessEvaluation) errors++;
        if (!action.tipoCierre) errors++;
        break;
    }
    return errors;
  };

  const nextStatus = getNextStatus();
  const canProceed = canAdvance() && canEditInStatus(action.status);
  const canAnnul = !['Cerrado', 'Anulada'].includes(action.status) && canEditInStatus(action.status);
  const validationErrors = getValidationErrors();
  const hasPermissions = canEditInStatus(action.status);

  // Debug log per veure l'estat complet
  React.useEffect(() => {
    if (action.status === 'Pendiente de Cierre') {
      console.log('FloatingActionButtons: Estat complet de l\'acció', {
        status: action.status,
        canProceed,
        hasPermissions,
        validationErrors,
        action: {
          tipoCierre: action.tipoCierre,
          closureData: action.closureData
        }
      });
    }
  }, [action.status, canProceed, hasPermissions, validationErrors, action.tipoCierre, action.closureData]);

  const handleAdvance = () => {
    if (nextStatus && canProceed) {
      onStatusChange(nextStatus);
    }
  };

  const handleAnnul = () => {
    onStatusChange('Anulada');
    setIsAnnulDialogOpen(false);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  // No mostrar botons si l'acció està tancada o anul·lada
  if (['Cerrado', 'Anulada'].includes(action.status)) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {/* Botó principal d'avançament */}
        {nextStatus && (
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleAdvance}
                  disabled={!canProceed}
                  size="lg"
                  className={`
                    h-14 px-6 text-white font-semibold shadow-xl transition-all duration-300
                    ${canProceed 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105' 
                      : 'bg-gray-400 cursor-not-allowed'
                    }
                    ${!hasPermissions ? 'opacity-50' : ''}
                  `}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  {getNextActionText()}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                {!hasPermissions ? (
                  <p>No tens permisos per editar aquesta acció</p>
                ) : !canProceed ? (
                  <p>Cal completar tots els camps obligatoris abans de continuar</p>
                ) : (
                  <p>Avançar l'acció al següent estat: {nextStatus}</p>
                )}
              </TooltipContent>
            </Tooltip>
            
            {/* Badge d'errors de validació */}
            {validationErrors > 0 && hasPermissions && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
              >
                {validationErrors}
              </Badge>
            )}
          </div>
        )}

        {/* Botó de guardar */}
        {shouldShowSaveButton() && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleSave}
                size="lg"
                className="h-12 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Save className="w-4 h-4 mr-2" />
                {getSaveButtonText()}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Guardar els canvis realitzats</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Botó d'anul·lació */}
        {canAnnul && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setIsAnnulDialogOpen(true)}
                variant="destructive"
                size="lg"
                className={`
                  h-12 px-4 shadow-lg transition-all duration-300 hover:scale-105
                  ${!hasPermissions ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={!hasPermissions}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Anul·lar
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {!hasPermissions ? (
                <p>No tens permisos per anul·lar aquesta acció</p>
              ) : (
                <p>Anul·lar definitivament aquesta acció correctiva</p>
              )}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Diàleg de confirmació d'anul·lació */}
        <Dialog open={isAnnulDialogOpen} onOpenChange={setIsAnnulDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                Confirmar Anul·lació
              </DialogTitle>
              <DialogDescription>
                Estàs segur que vols anul·lar aquesta acció correctiva? 
                Aquesta acció no es pot desfer i l'acció quedarà marcada com a anul·lada definitivament.
              </DialogDescription>
            </DialogHeader>
            <div className="flex space-x-2 justify-end mt-4">
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
      </div>
    </TooltipProvider>
  );
};

export default FloatingActionButtons;
