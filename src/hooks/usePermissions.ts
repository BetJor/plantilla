
import { useMemo } from 'react';
import { User } from '@/types';
import { ACTION_TYPES, USER_ROLES } from '@/types/categories';

interface UsePermissionsProps {
  user: User;
}

export const usePermissions = ({ user }: UsePermissionsProps) => {
  
  const permissions = useMemo(() => {
    // Verificar quins tipus d'accions pot crear l'usuari
    const canCreateActionType = (actionTypeCode: string): boolean => {
      const actionType = ACTION_TYPES.find(type => type.code === actionTypeCode);
      if (!actionType) return false;
      
      // Verificar si l'usuari té algun dels rols permesos
      const userRoles = user.specificRoles || [];
      return actionType.allowedRoles.some(role => userRoles.includes(role));
    };

    // Obtenir tots els tipus d'accions que pot crear
    const allowedActionTypes = ACTION_TYPES.filter(type => 
      canCreateActionType(type.code)
    );

    // Verificar si pot veure accions d'un àmbit específic
    const canViewAction = (action: any): boolean => {
      // Lògica per verificar permisos de visualització segons requeriments
      const userRoles = user.specificRoles || [];
      
      // Directors poden veure tot el seu àmbit
      if (userRoles.includes('director-centre') || 
          userRoles.includes('director-area') || 
          userRoles.includes('director-funcional')) {
        return true;
      }
      
      // Direcció de qualitat pot veure la majoria d'accions
      if (userRoles.includes('direccio-qualitat')) {
        return true;
      }
      
      // Altres rols només poden veure les seves accions
      return action.createdBy === user.id || action.assignedTo === user.id;
    };

    // Verificar si pot editar una acció en un estat específic
    const canEditActionInStatus = (action: any, status: string): boolean => {
      const userRoles = user.specificRoles || [];
      
      switch (status) {
        case 'Borrador':
          return action.createdBy === user.id;
        case 'Pendiente de Análisis':
          return action.responsableAnalisis === user.id || userRoles.includes('direccio-qualitat');
        case 'Pendiente de Comprobación':
          return action.responsableImplantacion === user.id || userRoles.includes('direccio-qualitat');
        case 'Pendiente de Cierre':
          return action.responsableCierre === user.id || action.createdBy === user.id;
        default:
          return false;
      }
    };

    // Verificar permisos per centres específics
    const canAccessCentre = (centreCode: string): boolean => {
      // Lògica per verificar accés a centres específics
      if (user.centre === centreCode) return true;
      
      const userRoles = user.specificRoles || [];
      if (userRoles.includes('direccio-qualitat') || 
          userRoles.includes('director-area')) {
        return true;
      }
      
      return false;
    };

    return {
      canCreateActionType,
      allowedActionTypes,
      canViewAction,
      canEditActionInStatus,
      canAccessCentre,
      isDirector: user.specificRoles?.some(role => 
        role.includes('director') || role.includes('gerente')
      ) || false,
      isQualityManager: user.specificRoles?.includes('direccio-qualitat') || false
    };
  }, [user]);

  return permissions;
};

// Hook per obtenir els responsables possibles segons el tipus d'acció
export const useResponsableOptions = (actionType: string) => {
  return useMemo(() => {
    const actionTypeData = ACTION_TYPES.find(type => type.code === actionType);
    if (!actionTypeData) return [];

    // Retornar els rols que poden ser responsables
    return actionTypeData.allowedRoles.map(roleCode => ({
      code: roleCode,
      name: USER_ROLES[roleCode as keyof typeof USER_ROLES] || roleCode
    }));
  }, [actionType]);
};
