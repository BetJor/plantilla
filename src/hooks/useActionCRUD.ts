
import { useState } from 'react';
import { CorrectiveAction, StatusHistoryEntry } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useActionStorage } from './useActionStorage';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuditHistory } from '@/hooks/useAuditHistory';
import { useBisActions } from '@/hooks/useBisActions';

export const useActionCRUD = () => {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const { saveToStorage } = useActionStorage();
  const { 
    notifyStatusChange,
    notifyBisGenerated,
    checkMultipleBisActions,
    notifyDirectorReviewRequired
  } = useNotifications();
  const { 
    logActionCreated, 
    logActionUpdated, 
    logStatusChanged, 
    logActionClosed 
  } = useAuditHistory();
  const { createBisAction } = useBisActions();

  const initializeActions = (loadedActions: CorrectiveAction[]) => {
    setActions(loadedActions);
  };

  const addAction = (action: Omit<CorrectiveAction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAction: CorrectiveAction = {
      ...action,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [{
        status: action.status,
        date: new Date().toISOString(),
        userId: action.createdBy,
        userName: 'Usuari Actual'
      }]
    };
    
    console.log('addAction: Creant nova acció amb ID:', newAction.id);
    
    const updatedActions = [...actions, newAction];
    setActions(updatedActions);
    saveToStorage(updatedActions);
    
    logActionCreated(newAction, newAction.createdBy, 'System User');
    
    // Notificacions BIS específiques
    if (newAction.esBis) {
      // Trobar l'acció original per notificar correctament
      const originalAction = actions.find(a => a.id === newAction.accionOriginal);
      if (originalAction) {
        notifyBisGenerated(originalAction, newAction);
        checkMultipleBisActions(updatedActions, newAction);
      }
    } else if (newAction.status === 'Pendiente de Análisis' && newAction.responsableAnalisis) {
      notifyStatusChange(newAction, 'Pendiente de Análisis');
    }
    
    toast({
      title: newAction.esBis ? "Acció BIS creada" : "Acció creada",
      description: newAction.esBis 
        ? "L'acció BIS s'ha creat automàticament degut al tancament NO CONFORME."
        : "L'acció correctiva s'ha creat correctament."
    });
    
    return newAction;
  };

  const updateAction = (id: string, updates: Partial<CorrectiveAction>) => {
    console.log('updateAction: Actualitzant acció amb ID:', id);
    
    const originalAction = actions.find(action => action.id === id);
    if (!originalAction) {
      console.error('updateAction: Acció no trobada amb ID:', id);
      return;
    }

    let updatedStatusHistory = originalAction.statusHistory || [];
    
    // Si hi ha canvi d'estat, afegir nova entrada a l'historial
    if (updates.status && updates.status !== originalAction.status) {
      const newHistoryEntry: StatusHistoryEntry = {
        status: updates.status,
        date: new Date().toISOString(),
        userId: 'current-user',
        userName: 'Usuari Actual'
      };
      updatedStatusHistory = [...updatedStatusHistory, newHistoryEntry];
    }

    const updatedAction = { 
      ...originalAction, 
      ...updates, 
      updatedAt: new Date().toISOString(),
      statusHistory: updatedStatusHistory
    } as CorrectiveAction;
    
    const updatedActions = actions.map(action => 
      action.id === id ? updatedAction : action
    );
    setActions(updatedActions);
    saveToStorage(updatedActions);

    const changes: Record<string, { from: any; to: any }> = {};
    Object.keys(updates).forEach(key => {
      const oldValue = (originalAction as any)[key];
      const newValue = (updates as any)[key];
      if (oldValue !== newValue) {
        changes[key] = { from: oldValue, to: newValue };
      }
    });

    if (Object.keys(changes).length > 0) {
      logActionUpdated(id, changes, 'current-user', 'Current User');
    }

    if (updates.status && updates.status !== originalAction.status) {
      logStatusChanged(id, originalAction.status, updates.status, 'current-user', 'Current User');
      notifyStatusChange(updatedAction, updates.status);
      
      // Notificar si es requereix revisió de direcció per tancament no conforme
      if (updates.status === 'Pendiente de Cierre' && updates.tipoCierre === 'no-conforme') {
        notifyDirectorReviewRequired(updatedAction);
      }
    }

    // Comprovar si s'ha de generar una acció BIS
    // Això pot passar en dos casos:
    // 1. L'estat canvia a 'Cerrado' i ja té tipoCierre 'no-conforme'
    // 2. El tipoCierre canvia a 'no-conforme' i ja està en estat 'Cerrado'
    const shouldGenerateBis = (
      // Cas 1: estat canvia a Cerrado i ja té tipoCierre no-conforme
      (updates.status === 'Cerrado' && updatedAction.tipoCierre === 'no-conforme') ||
      // Cas 2: tipoCierre canvia a no-conforme i ja està Cerrado
      (updates.tipoCierre === 'no-conforme' && updatedAction.status === 'Cerrado')
    ) && !updatedAction.esBis; // No generar BIS d'una acció que ja és BIS

    if (shouldGenerateBis) {
      // Verificar que no existeixi ja una acció BIS per aquesta acció
      const existingBisAction = actions.find(a => a.esBis && a.accionOriginal === updatedAction.id);
      
      if (!existingBisAction) {
        console.log('🔄 Generant acció BIS per tancament NO CONFORME:', updatedAction.id);
        const bisAction = createBisAction(updatedAction, addAction);
        if (bisAction) {
          checkMultipleBisActions([...updatedActions, bisAction], bisAction);
        }
      } else {
        console.log('ℹ️ Ja existeix una acció BIS per aquesta acció:', updatedAction.id);
      }
    }

    if (updates.status === 'Cerrado' && updates.tipoCierre) {
      logActionClosed(id, updates.tipoCierre, 'current-user', 'Current User');
    }
    
    toast({
      title: "Acció actualitzada",
      description: "Els canvis s'han guardat correctament."
    });
  };

  const clearAllActions = () => {
    setActions([]);
  };

  return {
    actions,
    addAction,
    updateAction,
    clearAllActions,
    initializeActions
  };
};
