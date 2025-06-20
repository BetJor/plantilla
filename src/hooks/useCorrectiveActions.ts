import { useState, useEffect } from 'react';
import { CorrectiveAction, Comment, DashboardMetrics } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuditHistory } from '@/hooks/useAuditHistory';
import { useBisActions } from '@/hooks/useBisActions';

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
      console.log('saveToStorage: Guardades', updatedActions.length, 'accions');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      toast({
        title: "Error",
        description: "No s'han pogut guardar les dades.",
        variant: "destructive"
      });
    }
  };

  // Funció per carregar dades del localStorage
  const loadActions = () => {
    try {
      console.log('loadActions: Carregant accions del localStorage...');
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (savedData) {
        const parsedActions = JSON.parse(savedData);
        if (Array.isArray(parsedActions)) {
          setActions(parsedActions);
          console.log('loadActions: Carregades', parsedActions.length, 'accions del localStorage');
          console.log('loadActions: IDs de les accions carregades:', parsedActions.map(a => a.id));
        } else {
          console.warn('loadActions: Dades invàlides al localStorage, inicialitzant amb array buit');
          setActions([]);
        }
      } else {
        console.log('loadActions: No hi ha dades guardades, inicialitzant amb array buit');
        setActions([]);
      }
    } catch (error) {
      console.error('loadActions: Error carregant del localStorage:', error);
      setActions([]);
      toast({
        title: "Avís",
        description: "Error carregant les dades guardades. S'ha inicialitzat amb estat buit.",
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

  const addTestActions = () => {
    console.log('addTestActions: Creant accions de prova...');
    
    const testActions: CorrectiveAction[] = [
      // 1. Acció en estat Borrador
      {
        id: 'test-draft-001',
        title: 'Solicitud de pendrive BIOS',
        description: 'A raíz de la auditoria del centro se detecta la falta de pendrive para la actualización de las bios. Se realiza solicitud a través de la SS-628097',
        type: '3-incidencias',
        category: '3-incidencias',
        subCategory: '3.1-incidencias',
        status: 'Borrador',
        priority: 'mitjana',
        centre: 'Hospital Central Barcelona',
        department: 'Tecnologías de la Información y Comunicación',
        areasImplicadas: ['Dirección Tecnologías de la Información y Comunicación'],
        attachments: [],
        createdBy: 'current-user',
        assignedTo: 'Gerente Hospital',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        origin: 'auditoria'
      },
      
      // 2. Acció pendent d'anàlisi
      {
        id: 'test-pending-analysis-001',
        title: 'Protocolarizar cancelación/modificación de datos',
        description: 'Establecer protocolo a seguir ante la recepción de este tipo de ejercicio de derechos.',
        type: '2-lopd',
        category: '2-lopd',
        subCategory: '2.2-accion-correctora-desviacion-auditoria-lopd',
        status: 'Pendiente de Análisis',
        priority: 'alta',
        centre: 'Hospital Central Barcelona',
        department: 'Asesoría Jurídica',
        areasImplicadas: ['Dirección Asesoría Jurídica', 'Dirección Asistencia Sanitaria', 'Dirección de Recursos Humanos', 'Dirección Sistemas de Información'],
        attachments: [],
        createdBy: 'sara.fortea',
        assignedTo: 'Gerente Hospital',
        responsableAnalisis: 'Gerente Hospital',
        dueDate: '2024-07-31',
        createdAt: new Date('2024-05-12T13:16:16Z').toISOString(),
        updatedAt: new Date('2024-05-12T13:16:16Z').toISOString(),
        origin: 'auditoria-lopd'
      },
      
      // 3. Acció pendent de comprobació
      {
        id: 'test-pending-verification-001',
        title: 'Información trabajadores (excepción art. 5.5 LOPD)',
        description: 'Informar al afectado cuando se recaban datos de carácter personal por parte de un tercero.',
        type: '2-lopd',
        category: '2-lopd',
        subCategory: '2.2-accion-correctora-desviacion-auditoria-lopd',
        status: 'Pendiente de Comprobación',
        priority: 'alta',
        centre: 'Hospital Central Barcelona',
        department: 'Asesoría Jurídica',
        areasImplicadas: ['Dirección Asesoría Jurídica', 'Dirección Asistencia Sanitaria', 'Dirección de Recursos Humanos', 'Dirección Sistemas de Información'],
        attachments: [],
        createdBy: 'edgard.ansola',
        assignedTo: 'Gerente Hospital',
        responsableAnalisis: 'Gerente Hospital',
        responsableImplantacion: 'sara.fortea',
        dueDate: '2024-05-30',
        createdAt: new Date('2024-05-10T13:55:44Z').toISOString(),
        updatedAt: new Date('2024-05-10T13:57:33Z').toISOString(),
        origin: 'auditoria-lopd',
        analysisData: {
          rootCauses: 'Tras la revisión de los distintos sistemas de tratamiento de datos de carácter personal únicamente cabe considerar, en este supuesto, el fichero mensual de trabajadores remitido por la Tesorería General de la Seguridad Social. Dado el volumen de comunicaciones que supondría el cumplimiento del deber de información se considera la necesidad de acogernos a la excepción del artículo 5.5 LO 15/1999.',
          proposedAction: 'La excepción debe ser sometida al criterio de la AEPD. Se sugiere plantear este caso a la AEPD a través de AMAT para que evalúe y dictamine la posibilidad de acogernos a la excepción del artículo 5.5 LO 15/1999.',
          analysisDate: '2024-05-10',
          analysisBy: 'edgard.ansola',
          signedBy: 'EDGARD ANSOLA MUNUERA',
          signedAt: '2024-05-10T13:57:33Z'
        }
      },
      
      // 4. Acció pendent de tancament
      {
        id: 'test-pending-closure-001',
        title: 'Restricción de acceso sala de informática (AS0827/2007)',
        description: 'Durante la visita al centro se detecta que el acceso a la sala de informática no está restringido.',
        type: 'sense-categoria',
        category: 'sense-categoria',
        subCategory: 'sense-subcategoria',
        status: 'Pendiente de Cierre',
        priority: 'mitjana',
        centre: 'Hospital Central Barcelona',
        department: 'Sistemas de Información',
        areasImplicadas: ['Dirección Sistemas de Información'],
        attachments: [],
        createdBy: 'edgard.ansola',
        assignedTo: 'Gerente Hospital',
        responsableAnalisis: 'Gerente Hospital',
        responsableImplantacion: 'eva.mendoza',
        responsableCierre: 'eva.mendoza',
        dueDate: '2007-11-15',
        createdAt: new Date('2007-09-25T17:58:33Z').toISOString(),
        updatedAt: new Date('2007-10-05T12:55:20Z').toISOString(),
        origin: 'auditoria-seguridad',
        analysisData: {
          rootCauses: 'El acceso a la sala no está restringido puesto que la puerta no está cerrada con llave.',
          proposedAction: 'A pesar de que actualmente no hay equipos de almacenamiento de datos en la sala, la puerta de acceso a la misma debería estar siempre cerrada con llave. La llave de la mencionada sala debe estar custodiada por la Dirección del centro.',
          analysisDate: '2007-09-27',
          analysisBy: 'edgard.ansola',
          signedBy: 'EDGARD ANSOLA MUNUERA',
          signedAt: '2007-09-27T17:34:56Z'
        },
        verificationData: {
          implementationCheck: 'LA POSIBILIDAD DE CERRAR LA PUERTA VIENE CONDICIONA POR LA MEJORA EN LA VENTILIACIÓN. SOLICITUD DE MODIFICACIÓN DE LA PUERTA A DIRECCIÓN DE INSTALACIONES. CORREO FECHA 5 DE OCTUBRE',
          verificationDate: '2007-10-05',
          verificationBy: 'eva.mendoza',
          evidenceAttachments: [],
          signedBy: 'EVA MARIA MENDOZA SEGUI',
          signedAt: '2007-10-05T12:55:20Z'
        }
      }
    ];

    const allActions = [...actions, ...testActions];
    setActions(allActions);
    saveToStorage(allActions);
    
    toast({
      title: "Accions de prova creades",
      description: `S'han creat ${testActions.length} accions de prova amb diferents estats.`
    });
    
    console.log('addTestActions: Creades', testActions.length, 'accions de prova');
  };

  const addAction = (action: Omit<CorrectiveAction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAction: CorrectiveAction = {
      ...action,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('addAction: Creant nova acció amb ID:', newAction.id);
    
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
    console.log('updateAction: Actualitzant acció amb ID:', id);
    console.log('updateAction: Accions disponibles:', actions.map(a => a.id));
    
    const originalAction = actions.find(action => action.id === id);
    if (!originalAction) {
      console.error('updateAction: Acció no trobada amb ID:', id);
      return;
    }

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

  const clearAllActions = () => {
    setActions([]);
    setComments([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      toast({
        title: "Accions eliminades",
        description: "Totes les accions correctives han estat eliminades correctament."
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      toast({
        title: "Error",
        description: "Error en eliminar les dades.",
        variant: "destructive"
      });
    }
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
    clearAllActions,
    getDashboardMetrics,
    loadActions,
    addTestActions
  };
};
