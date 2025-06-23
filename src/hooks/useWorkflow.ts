import { useMemo } from 'react';
import { CorrectiveAction, User } from '@/types';
import { ACTION_TYPES, USER_ROLES } from '@/types/categories';
import { useCentres } from './useCentres';

interface UseWorkflowProps {
  user: User;
  action?: CorrectiveAction;
}

export const useWorkflow = ({ user, action }: UseWorkflowProps) => {
  const { centres, loading: centresLoading } = useCentres(user.specificRoles);
  
  const workflow = useMemo(() => {
    // Determinar qui pot editar l'acció en cada estat
    const canEditInStatus = (status: CorrectiveAction['status']): boolean => {
      if (!action) return false;
      
      const userRoles = user.specificRoles || [];
      
      switch (status) {
        case 'Borrador':
          return action.createdBy === user.id;
          
        case 'Pendiente de Análisis':
          return action.responsableAnalisis === user.id || 
                 userRoles.includes('direccio-qualitat') ||
                 userRoles.some(role => role.includes('director'));
                 
        case 'Pendiente de Comprobación':
          return action.responsableImplantacion === user.id || 
                 userRoles.includes('direccio-qualitat');
                 
        case 'Pendiente de Cierre':
          return action.responsableCierre === user.id || 
                 action.createdBy === user.id ||
                 userRoles.includes('direccio-qualitat');
                 
        default:
          return false;
      }
    };

    // Determinar els responsables possibles segons el tipus d'acció
    const getResponsibleOptions = (actionType: string, role: 'analisis' | 'implantacion' | 'cierre') => {
      const actionTypeData = ACTION_TYPES.find(type => type.code === actionType);
      if (!actionTypeData) return [];

      // Per ara retornem els rols base, en una implementació real vindria del backend
      return actionTypeData.allowedRoles.map(roleCode => ({
        id: `user-${roleCode}`,
        name: USER_ROLES[roleCode as keyof typeof USER_ROLES] || roleCode,
        role: roleCode
      }));
    };

    // Determinar si cal mostrar camps específics segons el tipus
    const getRequiredFields = (actionType: string) => {
      const fields = {
        showAreasHospital: ['acm-h'].includes(actionType),
        showSpecificCenter: ['acm-isl'].includes(actionType),
        showOriginBreakdown: ['sau'].includes(actionType),
        requiredCategories: actionType ? ['type', 'category', 'subCategory'] : []
      };
      
      return fields;
    };

    // Validar si l'usuari pot crear aquest tipus d'acció
    const canCreateActionType = (actionType: string): boolean => {
      const actionTypeData = ACTION_TYPES.find(type => type.code === actionType);
      if (!actionTypeData) return false;
      
      const userRoles = user.specificRoles || [];
      return actionTypeData.allowedRoles.some(role => userRoles.includes(role));
    };

    // Obtenir centres disponibles des del webservice
    const getAvailableCentres = () => {
      if (centresLoading) {
        return []; // Retornar array buit mentre carrega
      }
      
      return centres.map(centre => centre.name);
    };

    // Obtenir informació detallada d'un centre
    const getCentreInfo = (centreName: string) => {
      return centres.find(centre => centre.name === centreName);
    };

    return {
      canEditInStatus,
      getResponsibleOptions,
      getRequiredFields,
      canCreateActionType,
      getAvailableCentres,
      getCentreInfo,
      centresLoading
    };
  }, [user, action, centres, centresLoading]);

  return workflow;
};
