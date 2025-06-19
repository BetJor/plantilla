import { useState, useEffect } from 'react';
import { CorrectiveAction, Comment, DashboardMetrics } from '@/types';
import { toast } from '@/hooks/use-toast';

// Dades de mostra per al prototipus amb exemples d'anàlisi
const mockActions: CorrectiveAction[] = [
  {
    id: '1',
    title: 'Revisió protocol higiene quirúrgica',
    description: 'Implementar millores en el protocol de higiene per reduir infeccions post-operatòries',
    type: 'calidad-total',
    category: '1',
    subCategory: '1.14',
    status: 'Pendiente de Análisis',
    dueDate: '2024-07-15',
    assignedTo: 'Dr. Maria García',
    priority: 'alta',
    centre: 'Hospital Central Barcelona',
    department: 'Cirurgia',
    attachments: [],
    createdBy: 'user1',
    createdAt: '2024-06-15',
    updatedAt: '2024-06-16',
    analysisData: {
      rootCauses: 'Manca de formació actualitzada del personal sanitari sobre els nous protocols de higiene. Protocol antic que no inclou les darreres recomanacions de la OMS.',
      proposedAction: 'Implementar programa de formació continuada en higiene quirúrgica i actualitzar el protocol seguint les guies més recents.'
    }
  },
  {
    id: '2',
    title: 'Actualització sistema informàtic',
    description: 'Migració del sistema de gestió de pacients a la nova versió',
    type: 'sistemas-informacion',
    category: '1',
    subCategory: '1.6',
    status: 'Pendiente de Comprobación',
    dueDate: '2024-07-30',
    assignedTo: 'Joan Martínez',
    priority: 'mitjana',
    centre: 'CAP Gràcia',
    department: 'Sistemes',
    attachments: [],
    createdBy: 'user2',
    createdAt: '2024-06-10',
    updatedAt: '2024-06-20',
    analysisData: {
      rootCauses: 'Sistema informàtic obsolet amb incompatibilitats amb les noves actualitzacions de seguretat.',
      proposedAction: 'Migració gradual a la nova versió amb proves pilot en un departament abans de la implementació general.',
      analysisDate: '2024-06-22',
      analysisBy: 'Joan Martínez'
    },
    verificationData: {
      implementationCheck: 'Migració completada amb èxit al departament pilot. Funcionament correcte verificat.',
      verificationDate: '2024-06-25',
      verificationBy: 'Anna López',
      evidenceAttachments: []
    }
  },
  {
    id: '3',
    title: 'Formació en prevenció de riscos',
    description: 'Programa de formació per al personal sobre nous protocols de seguretat',
    type: 'medioambiental-hospitales',
    category: '5',
    subCategory: '',
    status: 'Cerrado',
    dueDate: '2024-06-30',
    assignedTo: 'Anna López',
    priority: 'mitjana',
    centre: 'Clínica Diagonal',
    department: 'Recursos Humans',
    attachments: [],
    createdBy: 'user3',
    createdAt: '2024-05-15',
    updatedAt: '2024-06-28',
    analysisData: {
      rootCauses: 'Manca de coneixement dels nous protocols de seguretat per part del personal.',
      proposedAction: 'Organitzar sessions de formació obligatòries per a tot el personal.',
      analysisDate: '2024-05-20',
      analysisBy: 'Anna López'
    },
    verificationData: {
      implementationCheck: 'Sessions de formació completades. Assistència del 95% del personal.',
      verificationDate: '2024-06-15',
      verificationBy: 'Dr. Pérez',
      evidenceAttachments: []
    },
    closureData: {
      closureNotes: 'Formació completada amb èxit. Personal format adequadament en els nous protocols.',
      closureDate: '2024-06-28',
      closureBy: 'Anna López',
      effectivenessEvaluation: 'Molt efectiu - millora significativa en el compliment dels protocols de seguretat'
    }
  }
];

const STORAGE_KEY = 'corrective-actions-data';

export const useCorrectiveActions = () => {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar dades del localStorage a l'inici
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setActions(parsedData);
      } else {
        // Si no hi ha dades guardades, usar les dades mock
        setActions(mockActions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockActions));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      setActions(mockActions);
      toast({
        title: "Avís",
        description: "Error carregant les dades guardades. S'han carregat les dades per defecte.",
        variant: "destructive"
      });
    }
  }, []);

  // Funció per guardar a localStorage
  const saveToStorage = (updatedActions: CorrectiveAction[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActions));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        title: "Error",
        description: "No s'han pogut guardar les dades.",
        variant: "destructive"
      });
    }
  };

  const addAction = (action: Omit<CorrectiveAction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAction: CorrectiveAction = {
      ...action,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedActions = [...actions, newAction];
    setActions(updatedActions);
    saveToStorage(updatedActions);
    
    toast({
      title: "Acció creada",
      description: "L'acció s'ha creat correctament."
    });
    
    return newAction;
  };

  const updateAction = (id: string, updates: Partial<CorrectiveAction>) => {
    const updatedActions = actions.map(action => 
      action.id === id 
        ? { ...action, ...updates, updatedAt: new Date().toISOString() }
        : action
    );
    setActions(updatedActions);
    saveToStorage(updatedActions);
    
    toast({
      title: "Acció actualitzada",
      description: "Els canvis s'han guardat correctament."
    });
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
    comments,
    loading,
    addAction,
    updateAction,
    addComment,
    getDashboardMetrics
  };
};
