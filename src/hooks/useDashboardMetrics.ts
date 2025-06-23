
import { CorrectiveAction, DashboardMetrics } from '@/types';

export const useDashboardMetrics = (actions: CorrectiveAction[]) => {
  const getDashboardMetrics = (): DashboardMetrics => {
    const totalActions = actions.length;
    const pendingActions = actions.filter(a => 
      ['Pendiente de Análisis', 'Pendiente de Comprobación', 'Pendiente de Cierre'].includes(a.status)
    ).length;
    const overdueActions = actions.filter(a => 
      new Date(a.dueDate) < new Date() && a.status !== 'Cerrado'
    ).length;
    const closedThisMonth = actions.filter(a => 
      a.status === 'Cerrado' && 
      new Date(a.updatedAt).getMonth() === new Date().getMonth()
    ).length;

    const actionsByStatus = Object.entries(
      actions.reduce((acc, action) => {
        acc[action.status] = (acc[action.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([status, count]) => ({ status, count }));

    const actionsByType = Object.entries(
      actions.reduce((acc, action) => {
        acc[action.type] = (acc[action.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([type, count]) => ({ type, count }));

    const actionsByCentre = Object.entries(
      actions.reduce((acc, action) => {
        acc[action.centre] = (acc[action.centre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([centre, count]) => ({ centre, count }));

    const actionsByOrigin = Object.entries(
      actions.reduce((acc, action) => {
        const origin = action.origen || 'sense-especificar';
        acc[origin] = (acc[origin] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([origin, count]) => ({ origin, count }));

    const overdueByType = Object.entries(
      actions.filter(a => new Date(a.dueDate) < new Date() && a.status !== 'Cerrado')
             .reduce((acc, action) => {
               acc[action.type] = (acc[action.type] || 0) + 1;
               return acc;
             }, {} as Record<string, number>)
    ).map(([type, count]) => ({ type, count }));

    const conformeVsNoConforme = actions
      .filter(a => a.status === 'Cerrado')
      .reduce((acc, action) => {
        if (action.tipoCierre === 'conforme') acc.conforme++;
        else if (action.tipoCierre === 'no-conforme') acc.noConforme++;
        return acc;
      }, { conforme: 0, noConforme: 0 });

    return {
      totalActions,
      pendingActions,
      overdueActions,
      closedThisMonth,
      actionsByStatus,
      actionsByType,
      actionsByCentre,
      actionsByOrigin,
      overdueByType,
      conformeVsNoConforme
    };
  };

  return { getDashboardMetrics };
};
