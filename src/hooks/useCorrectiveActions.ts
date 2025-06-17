
import { useState, useEffect } from 'react';
import { CorrectiveAction, Incident, Comment, DashboardMetrics } from '@/types';

// Dades de mostra per al prototipus
const mockActions: CorrectiveAction[] = [
  {
    id: '1',
    title: 'Revisió protocol higiene quirúrgica',
    description: 'Implementar millores en el protocol de higiene per reduir infeccions post-operatòries',
    type: 'Calidad Total',
    subCategory: 'Protocols assistencials',
    status: 'Pendiente de Análisis',
    dueDate: '2024-07-15',
    assignedTo: 'Dr. Maria García',
    incidentId: '1',
    priority: 'alta',
    centre: 'Hospital Central Barcelona',
    department: 'Cirurgia',
    attachments: [],
    createdBy: 'user1',
    createdAt: '2024-06-15',
    updatedAt: '2024-06-16'
  },
  {
    id: '2',
    title: 'Actualització sistema informàtic',
    description: 'Migració del sistema de gestió de pacients a la nova versió',
    type: 'Sistemas de Información',
    subCategory: 'Infraestructura TI',
    status: 'Pendiente de Comprobación',
    dueDate: '2024-07-30',
    assignedTo: 'Joan Martínez',
    priority: 'mitjana',
    centre: 'CAP Gràcia',
    department: 'Sistemes',
    attachments: [],
    createdBy: 'user2',
    createdAt: '2024-06-10',
    updatedAt: '2024-06-20'
  },
  {
    id: '3',
    title: 'Formació en prevenció de riscos',
    description: 'Programa de formació per al personal sobre nous protocols de seguretat',
    type: 'Sistema de gestión de la prevención',
    subCategory: 'Formació',
    status: 'Cerrado',
    dueDate: '2024-06-30',
    assignedTo: 'Anna López',
    priority: 'mitjana',
    centre: 'Clínica Diagonal',
    department: 'Recursos Humans',
    attachments: [],
    createdBy: 'user3',
    createdAt: '2024-05-15',
    updatedAt: '2024-06-28'
  }
];

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Incident d\'infecció post-operatòria',
    description: 'S\'ha detectat un augment en les infeccions post-operatòries al departament de cirurgia',
    origin: 'Seguimiento Indicadores/Objetivos',
    centre: 'Hospital Central Barcelona',
    department: 'Cirurgia',
    detectionDate: '2024-06-15',
    severity: 'alta',
    status: 'en_proces',
    attachments: [],
    createdBy: 'user1',
    createdAt: '2024-06-15'
  }
];

export const useCorrectiveActions = () => {
  const [actions, setActions] = useState<CorrectiveAction[]>(mockActions);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const addAction = (action: Omit<CorrectiveAction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAction: CorrectiveAction = {
      ...action,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setActions(prev => [...prev, newAction]);
    return newAction;
  };

  const updateAction = (id: string, updates: Partial<CorrectiveAction>) => {
    setActions(prev => prev.map(action => 
      action.id === id 
        ? { ...action, ...updates, updatedAt: new Date().toISOString() }
        : action
    ));
  };

  const addIncident = (incident: Omit<Incident, 'id' | 'createdAt'>) => {
    const newIncident: Incident = {
      ...incident,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setIncidents(prev => [...prev, newIncident]);
    return newIncident;
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    return newComment;
  };

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

    return {
      totalActions,
      pendingActions,
      overdueActions,
      closedThisMonth,
      actionsByStatus,
      actionsByType,
      actionsByCentre
    };
  };

  return {
    actions,
    incidents,
    comments,
    loading,
    addAction,
    updateAction,
    addIncident,
    addComment,
    getDashboardMetrics
  };
};
