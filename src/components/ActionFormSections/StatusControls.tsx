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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowRight, XCircle, AlertTriangle, Search, Info } from 'lucide-react';
import { CorrectiveAction } from '@/types';
import { useWorkflow } from '@/hooks/useWorkflow';

interface StatusControlsProps {
  action: CorrectiveAction;
  onStatusChange: (newStatus: CorrectiveAction['status']) => void;
  user?: any;
  hasCheckedSimilarity?: boolean;
  onCheckSimilarity?: () => void;
  isCheckingSimilarity?: boolean;
}

const StatusControls = ({ 
  action, 
  onStatusChange, 
  user = { id: 'current-user', specificRoles: ['direccio-qualitat'] },
  hasCheckedSimilarity = false,
  onCheckSimilarity,
  isCheckingSimilarity = false
}: StatusControlsProps) => {
  const [isAnnulDialogOpen, setIsAnnulDialogOpen] = useState(false);
  const { canEditInStatus } = useWorkflow({ user, action });

  // Debug logs detallats
  console.log('=== STATUS CONTROLS DEBUG ===');
  console.log('Action ID:', action.id);
  console.log('Action status:', action.status);
  console.log('Has checked similarity:', hasCheckedSimilarity);
  console.log('Root causes:', action.analysisData?.rootCauses?.length || 0, 'characters');
  console.log('Proposed actions:', action.analysisData?.proposedActions?.length || 0);
  
  if (action.analysisData?.proposedActions) {
    action.analysisData.proposedActions.forEach((proposedAction, index) => {
      console.log(`Proposed action ${index + 1}:`, {
        id: proposedAction.id,
        hasDescription: !!proposedAction.description?.trim(),
        hasAssignedTo: !!proposedAction.assignedTo?.trim(),
        hasDueDate: !!proposedAction.dueDate,
        description: proposedAction.description?.substring(0, 50) + '...',
        assignedTo: proposedAction.assignedTo,
        dueDate: proposedAction.dueDate
      });
    });
  }
  console.log('=== END STATUS CONTROLS DEBUG ===');

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
               !!action.responsableAnalisis;
      case 'Pendiente de Análisis':
        // Validació detallada per anàlisi
        const hasRootCauses = !!(action.analysisData?.rootCauses?.trim());
        const proposedActions = action.analysisData?.proposedActions || [];
        const hasValidProposedActions = proposedActions.length > 0 && 
          proposedActions.every(proposedAction => 
            proposedAction.description?.trim() &&
            proposedAction.assignedTo?.trim() &&
            proposedAction.dueDate
          );
        
        // Només validar similituds per accions no-BIS
        const needsSimilarityCheck = !action.esBis;
        const similarityCheckPassed = !needsSimilarityCheck || hasCheckedSimilarity;
        
        console.log('Validation for Pendiente de Análisis:');
        console.log('- hasRootCauses:', hasRootCauses);
        console.log('- hasValidProposedActions:', hasValidProposedActions);
        console.log('- needsSimilarityCheck:', needsSimilarityCheck);
        console.log('- similarityCheckPassed:', similarityCheckPassed);
        
        return hasRootCauses && hasValidProposedActions && similarityCheckPassed;
      case 'Pendiente de Comprobación':
        const proposedActionsForVerification = action.analysisData?.proposedActions || [];
        const allActionsVerified = proposedActionsForVerification.every(proposedAction => 
          proposedAction.verificationStatus && proposedAction.verificationStatus !== 'not-verified'
        );
        return !!(allActionsVerified && 
                 proposedActionsForVerification.length > 0);
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
            missingAnalysis.push(`dades completes per ${incompleteActions.length} acció${incompleteActions.length > 1 ? 'ns' : ''}`);
          }
        }

        // Només afegir similituds si no és BIS
        if (!action.esBis && !hasCheckedSimilarity) {
          missingAnalysis.push('revisió d\'accions similars');
        }
        
        return `Cal completar: ${missingAnalysis.join(', ')}`;
      case 'Pendiente de Comprobación':
        const missingVerification = [];
        const proposedActionsForVerification = action.analysisData?.proposedActions || [];
        const unverifiedActions = proposedActionsForVerification.filter(proposedAction => 
          !proposedAction.verificationStatus || proposedAction.verificationStatus === 'not-verified'
        );
        
        if (unverifiedActions.length > 0) {
          missingVerification.push(`verificació de ${unverifiedActions.length} acció${unverifiedActions.length > 1 ? 'ns' : ''}`);
        }
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

  // Debug tooltip condition
  console.log('StatusControls: Button state debug', {
    nextStatus,
    canProceed,
    canAdvance: canAdvance(),
    canEditInStatus: canEditInStatus(action.status),
    validationMessage: getValidationMessage()
  });

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
        {/* Botó de revisió de similituds per a "Pendiente de Análisis" i no-BIS */}
        {action.status === 'Pendiente de Análisis' && !action.esBis && onCheckSimilarity && (
          <div className="space-y-2">
            <Button 
              onClick={onCheckSimilarity}
              disabled={isCheckingSimilarity}
              variant={hasCheckedSimilarity ? "secondary" : "outline"}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              {isCheckingSimilarity ? 'Cercant...' : hasCheckedSimilarity ? 'Similituds Revisades' : 'Revisar Accions Similars'}
            </Button>
            {!hasCheckedSimilarity && (
              <p className="text-sm text-orange-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Cal revisar accions similars abans de continuar
              </p>
            )}
          </div>
        )}

        {nextStatus && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleAdvance}
                disabled={!canProceed}
                className="flex-1"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                {getNextActionText()}
              </Button>
              {!canProceed && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 w-10 h-10 p-0 bg-orange-100 hover:bg-orange-200 border-2 border-orange-300 text-orange-700 hover:text-orange-800 rounded-full"
                      title="Passa el cursor per veure els detalls de validació"
                    >
                      <Info className="w-5 h-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    side="top" 
                    className="w-80 bg-orange-50 border-orange-200 z-50"
                    sideOffset={8}
                  >
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold mb-1 text-orange-900">No es pot continuar</p>
                        <p className="text-sm text-orange-800">{getValidationMessage()}</p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
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
