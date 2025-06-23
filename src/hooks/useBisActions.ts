
import { useCallback } from 'react';
import { CorrectiveAction } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useBisActions = () => {
  
  const generateBisAction = useCallback((originalAction: CorrectiveAction): Omit<CorrectiveAction, 'id' | 'createdAt' | 'updatedAt'> => {
    const bisAction: Omit<CorrectiveAction, 'id' | 'createdAt' | 'updatedAt'> = {
      title: `${originalAction.title} (BIS)`,
      description: `Acció BIS generada automàticament a partir de l'acció ${originalAction.id} tancada com NO CONFORME.\n\nDescripció original:\n${originalAction.description}`,
      type: originalAction.type,
      category: originalAction.category,
      subCategory: originalAction.subCategory,
      status: 'Pendiente de Análisis',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dies des d'ara
      assignedTo: originalAction.assignedTo,
      priority: originalAction.priority,
      centre: originalAction.centre,
      department: originalAction.department,
      attachments: [],
      createdBy: 'system', // Sistema automàtic
      origen: originalAction.origen,
      areasImplicadas: originalAction.areasImplicadas,
      areasHospital: originalAction.areasHospital,
      responsableAnalisis: originalAction.responsableAnalisis,
      fechaLimiteAnalisis: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 dies per a l'anàlisi
      esBis: true,
      accionOriginal: originalAction.id,
      analysisData: {
        rootCauses: `Acció BIS generada per tancament NO CONFORME de l'acció ${originalAction.id}.\n\nCauses arrel de l'acció original:\n${originalAction.analysisData?.rootCauses || 'No especificades'}`,
        proposedAction: 'S\'ha de revisar i replantejar l\'acció correctiva ja que la implementació anterior no ha estat efectiva.'
      }
    };

    return bisAction;
  }, []);

  const shouldGenerateBisAction = useCallback((action: CorrectiveAction): boolean => {
    return (
      action.status === 'Cerrado' &&
      action.tipoCierre === 'no-conforme' &&
      !action.esBis // No generar BIS d'una acció que ja és BIS
    );
  }, []);

  const createBisAction = useCallback((originalAction: CorrectiveAction, addActionCallback: (action: Omit<CorrectiveAction, 'id' | 'createdAt' | 'updatedAt'>) => CorrectiveAction) => {
    if (!shouldGenerateBisAction(originalAction)) {
      return null;
    }

    const bisAction = generateBisAction(originalAction);
    const createdBisAction = addActionCallback(bisAction);

    toast({
      title: "Acció BIS generada",
      description: `S'ha creat automàticament l'acció BIS "${createdBisAction.title}" degut al tancament NO CONFORME.`,
    });

    console.log('🔄 Acció BIS generada automàticament:', {
      originalId: originalAction.id,
      bisId: createdBisAction.id,
      reason: 'Tancament NO CONFORME'
    });

    return createdBisAction;
  }, [generateBisAction, shouldGenerateBisAction]);

  const getBisHistory = useCallback((actions: CorrectiveAction[], actionId: string): CorrectiveAction[] => {
    // Troba totes les accions BIS relacionades amb aquesta acció
    const relatedActions: CorrectiveAction[] = [];
    
    // Troba l'acció original
    const originalAction = actions.find(a => a.id === actionId);
    if (originalAction) {
      relatedActions.push(originalAction);
      
      // Si és una acció BIS, troba l'original
      if (originalAction.esBis && originalAction.accionOriginal) {
        const realOriginal = actions.find(a => a.id === originalAction.accionOriginal);
        if (realOriginal && !relatedActions.some(a => a.id === realOriginal.id)) {
          relatedActions.unshift(realOriginal);
        }
      }
    }
    
    // Troba totes les accions BIS derivades
    const bisActions = actions.filter(a => 
      a.esBis && 
      (a.accionOriginal === actionId || 
       relatedActions.some(ra => a.accionOriginal === ra.id))
    );
    
    relatedActions.push(...bisActions);
    
    // Ordena per data de creació
    return relatedActions.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, []);

  const getBisMetrics = useCallback((actions: CorrectiveAction[]) => {
    const bisActions = actions.filter(a => a.esBis);
    const originalActionsWithBis = actions.filter(a => 
      !a.esBis && bisActions.some(bis => bis.accionOriginal === a.id)
    );

    return {
      totalBisActions: bisActions.length,
      originalActionsWithBis: originalActionsWithBis.length,
      bisActionsByStatus: bisActions.reduce((acc, action) => {
        acc[action.status] = (acc[action.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      effectivenessRate: originalActionsWithBis.length > 0 
        ? ((originalActionsWithBis.length - bisActions.length) / originalActionsWithBis.length) * 100 
        : 100
    };
  }, []);

  return {
    generateBisAction,
    shouldGenerateBisAction,
    createBisAction,
    getBisHistory,
    getBisMetrics
  };
};
