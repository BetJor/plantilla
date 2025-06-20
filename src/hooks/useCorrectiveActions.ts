
import { useState, useEffect } from 'react';
import { CorrectiveAction, Comment, DashboardMetrics } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuditHistory } from '@/hooks/useAuditHistory';
import { useBisActions } from '@/hooks/useBisActions';
import { TEST_ACTIONS } from '@/data/testData';

// Dades de mostra per al prototipus amb exemples dels nous tipus d'accions
const mockActions: CorrectiveAction[] = [
  {
    id: '1',
    title: 'Revisió protocol higiene quirúrgica',
    description: 'Implementar millores en el protocol de higiene per reduir infeccions post-operatòries detectades en auditoria interna',
    type: 'ac-qualitat-total',
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
    origin: 'auditoria',
    areasImplicadas: ['Quiròfans', 'Esterilització', 'Infermeria'],
    responsableAnalisis: 'Dr. Maria García',
    fechaLimiteAnalisis: '2024-07-01',
    analysisData: {
      rootCauses: 'Manca de formació actualitzada del personal sanitari sobre els nous protocols de higiene. Protocol antic que no inclou les darreres recomanacions de la OMS.',
      proposedActions: [
        {
          id: '1',
          description: 'Implementar programa de formació continuada en higiene quirúrgica',
          assignedTo: 'Dr. Maria García',
          dueDate: '2024-07-10',
          status: 'pending'
        },
        {
          id: '2',
          description: 'Actualitzar el protocol seguint les guies més recents de la OMS',
          assignedTo: 'Coordinador Qualitat',
          dueDate: '2024-07-05',
          status: 'pending'
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Gestió inadequada de residus sanitaris',
    description: 'Detecció de deficiències en la segregació i emmagatzematge temporal de residus sanitaris al Bloc Quirúrgic',
    type: 'acm-h',
    category: '3',
    subCategory: '3.2',
    status: 'Pendiente de Comprobación',
    dueDate: '2024-07-30',
    assignedTo: 'Joan Martínez',
    priority: 'mitjana',
    centre: 'Hospital de Coslada',
    department: 'Gestió Medioambiental',
    attachments: [],
    createdBy: 'user2',
    createdAt: '2024-06-10',
    updatedAt: '2024-06-20',
    origin: 'auditoria',
    areasImplicadas: ['Bloc Quirúrgic', 'Neteja', 'Gestió de Residus'],
    areasHospital: ['Quiròfans', 'Reanimació', 'Esterilització'],
    responsableAnalisis: 'Joan Martínez',
    responsableImplantacion: 'Anna López',
    fechaLimiteAnalisis: '2024-06-20',
    fechaLimiteImplantacion: '2024-07-15',
    analysisData: {
      rootCauses: 'Personal no format adequadament en la nova normativa de residus. Contenidors insuficients en algunes zones.',
      proposedActions: [
        {
          id: '1',
          description: 'Formació específica al personal sobre nova normativa de residus',
          assignedTo: 'Responsable Formació',
          dueDate: '2024-07-10',
          status: 'in-progress'
        },
        {
          id: '2',
          description: 'Instal·lació de contenidors addicionals en zones deficitàries',
          assignedTo: 'Joan Martínez',
          dueDate: '2024-07-08',
          status: 'completed'
        }
      ],
      analysisDate: '2024-06-22',
      analysisBy: 'Joan Martínez'
    },
    verificationData: {
      implementationCheck: 'Formació completada al 90% del personal. Contenidors instal·lats i funcionant correctament.',
      verificationDate: '2024-07-10',
      verificationBy: 'Anna López',
      evidenceAttachments: []
    }
  },
  {
    id: '3',
    title: 'Vulnerabilitat en sistema de gestió de pacients',
    description: 'Detecció d\'accés no autoritzat a dades de pacients a través de terminal no securitzat',
    type: 'acsgsi',
    category: '1',
    subCategory: '1.3',
    status: 'Cerrado',
    dueDate: '2024-06-30',
    assignedTo: 'Carlos Ruiz',
    priority: 'crítica',
    centre: 'CAP Gràcia',
    department: 'Sistemes d\'Informació',
    attachments: [],
    createdBy: 'user3',
    createdAt: '2024-05-15',
    updatedAt: '2024-06-28',
    origin: 'auditoria',
    areasImplicadas: ['Sistemes', 'Seguretat', 'Atenció al Pacient'],
    responsableAnalisis: 'Carlos Ruiz',
    responsableImplantacion: 'Maria Fernández',
    responsableCierre: 'user3',
    fechaLimiteAnalisis: '2024-05-20',
    fechaLimiteImplantacion: '2024-06-15',
    fechaLimiteCierre: '2024-06-25',
    tipoCierre: 'conforme',
    analysisData: {
      rootCauses: 'Terminal no configurat amb bloqueig automàtic. Política de contrasenyes no aplicada correctament.',
      proposedAction: 'Configurar bloqueig automàtic en tots els terminals i aplicar política de contrasenyes fortes.',
      analysisDate: '2024-05-20',
      analysisBy: 'Carlos Ruiz'
    },
    verificationData: {
      implementationCheck: 'Tots els terminals configurats amb bloqueig automàtic. Política de contrasenyes implementada i verificada.',
      verificationDate: '2024-06-15',
      verificationBy: 'Maria Fernández',
      evidenceAttachments: []
    },
    closureData: {
      closureNotes: 'Vulnerabilitat solucionada completament. Totes les mesures de seguretat implementades i verificades.',
      closureDate: '2024-06-28',
      closureBy: 'user3',
      effectivenessEvaluation: 'Molt efectiu - eliminació completa de la vulnerabilitat detectada'
    }
  },
  {
    id: '4',
    title: 'Queixa usuari extern - temps d\'espera',
    description: 'Usuari extern reporta temps d\'espera excessius en consultes externes de traumatologia',
    type: 'sau',
    category: '1',
    subCategory: '1.2',
    status: 'Pendiente de Análisis',
    dueDate: '2024-08-15',
    assignedTo: 'Laura Pérez',
    priority: 'mitjana',
    centre: 'Hospital Central Barcelona',
    department: 'Atenció al Usuari',
    attachments: [],
    createdBy: 'user4',
    createdAt: '2024-07-01',
    updatedAt: '2024-07-01',
    origin: 'usuario-externo',
    areasImplicadas: ['Consultes Externes', 'Traumatologia', 'Planificació'],
    responsableAnalisis: 'Laura Pérez',
    fechaLimiteAnalisis: '2024-07-15'
  },
  {
    id: '5',
    title: 'Incidència gestió medioambiental Sevilla-Cartuja',
    description: 'Emissió no controlada detectada en sistema de ventilació del laboratori',
    type: 'acm-isl',
    category: '3',
    subCategory: '3.4',
    status: 'Pendiente de Comprobación',
    dueDate: '2024-08-30',
    assignedTo: 'Antonio García',
    priority: 'alta',
    centre: '4104 Sevilla-Cartuja',
    department: 'Laboratori',
    attachments: [],
    createdBy: 'user5',
    createdAt: '2024-07-10',
    updatedAt: '2024-07-20',
    origin: 'incidencias',
    areasImplicadas: ['Laboratori', 'Manteniment', 'Seguretat'],
    responsableAnalisis: 'Antonio García',
    responsableImplantacion: 'José López',
    fechaLimiteAnalisis: '2024-07-20',
    fechaLimiteImplantacion: '2024-08-15',
    analysisData: {
      rootCauses: 'Filtre del sistema de ventilació saturat i manteniment preventiu no realitzat segons programa.',
      proposedAction: 'Substitució immediata dels filtres i revisió del programa de manteniment preventiu.',
      analysisDate: '2024-07-20',
      analysisBy: 'Antonio García'
    }
  }
];

const STORAGE_KEY = 'corrective-actions-data';

export const useCorrectiveActions = () => {
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { notifyStatusChange, checkOverdueAndUpcoming } = useNotifications();
  const { 
    logActionCreated, 
    logActionUpdated, 
    logStatusChanged, 
    logActionClosed 
  } = useAuditHistory();
  const { createBisAction } = useBisActions();

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

  // Funció per carregar dades del localStorage amb integració de dades de prova
  const loadActions = () => {
    try {
      console.log('loadActions: Carregant dades del localStorage...');
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        console.log('loadActions: Dades trobades:', parsedData.length, 'accions');
        
        // Combinar dades existents amb dades de prova si no existeixen ja
        const existingIds = parsedData.map((action: CorrectiveAction) => action.id);
        const newTestActions = TEST_ACTIONS.filter(testAction => 
          !existingIds.includes(testAction.id)
        );
        
        if (newTestActions.length > 0) {
          console.log('loadActions: Afegint', newTestActions.length, 'accions de prova noves');
          const combinedActions = [...parsedData, ...newTestActions];
          setActions(combinedActions);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedActions));
        } else {
          setActions(parsedData);
        }
      } else {
        console.log('loadActions: No hi ha dades guardades, carregant dades inicials amb dades de prova');
        const initialActions = [...mockActions, ...TEST_ACTIONS];
        setActions(initialActions);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialActions));
      }
    } catch (error) {
      console.error('loadActions: Error loading data from localStorage:', error);
      const fallbackActions = [...mockActions, ...TEST_ACTIONS];
      setActions(fallbackActions);
      toast({
        title: "Avís",
        description: "Error carregant les dades guardades. S'han carregat les dades per defecte.",
        variant: "destructive"
      });
    }
  };

  // Carregar dades del localStorage a l'inici
  useEffect(() => {
    loadActions();
  }, []);

  // Comprovar retards i venciments cada vegada que canvien les accions
  useEffect(() => {
    if (actions.length > 0) {
      checkOverdueAndUpcoming(actions);
    }
  }, [actions, checkOverdueAndUpcoming]);

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
    
    // Log audit entry
    logActionCreated(newAction, newAction.createdBy, 'System User');
    
    // Enviar notificació si té responsable d'anàlisi assignat
    if (newAction.status === 'Pendiente de Análisis' && newAction.responsableAnalisis) {
      notifyStatusChange(newAction, 'Pendiente de Análisis');
    }
    
    toast({
      title: "Acció creada",
      description: "L'acció correctiva s'ha creat correctament."
    });
    
    return newAction;
  };

  const updateAction = (id: string, updates: Partial<CorrectiveAction>) => {
    const originalAction = actions.find(action => action.id === id);
    if (!originalAction) return;

    const updatedAction = { ...originalAction, ...updates, updatedAt: new Date().toISOString() } as CorrectiveAction;
    
    const updatedActions = actions.map(action => 
      action.id === id ? updatedAction : action
    );
    setActions(updatedActions);
    saveToStorage(updatedActions);

    // Log audit entries for changes
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

    // Enviar notificació si hi ha canvi d'estat
    if (updates.status && updates.status !== originalAction.status) {
      logStatusChanged(id, originalAction.status, updates.status, 'current-user', 'Current User');
      notifyStatusChange(updatedAction, updates.status);
      
      // Si es tanca com NO CONFORME, crear acció BIS
      if (updates.status === 'Cerrado' && updates.tipoCierre === 'no-conforme') {
        createBisAction(updatedAction, addAction);
      }
    }

    // Log closure if action is being closed
    if (updates.status === 'Cerrado' && updates.tipoCierre) {
      logActionClosed(id, updates.tipoCierre, 'current-user', 'Current User');
    }
    
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

    // Noves mètriques
    const actionsByOrigin = Object.entries(
      actions.reduce((acc, action) => {
        const origin = action.origin || 'sense-especificar';
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

  return {
    actions,
    comments,
    loading,
    addAction,
    updateAction,
    addComment,
    getDashboardMetrics,
    loadActions
  };
};
