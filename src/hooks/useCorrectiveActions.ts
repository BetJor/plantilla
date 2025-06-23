import { useState, useEffect } from 'react';
import { CorrectiveAction } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { useActionStorage } from './useActionStorage';
import { useActionCRUD } from './useActionCRUD';
import { useComments } from './useComments';
import { useDashboardMetrics } from './useDashboardMetrics';

export const useCorrectiveActions = () => {
  const [loading, setLoading] = useState(false);
  const { checkOverdueAndUpcoming } = useNotifications();
  const { loadActions, clearAllStorage } = useActionStorage();
  const { 
    actions, 
    addAction, 
    updateAction, 
    clearAllActions, 
    initializeActions 
  } = useActionCRUD();
  const { 
    comments, 
    addComment, 
    clearComments, 
    initializeComments 
  } = useComments();
  const { getDashboardMetrics } = useDashboardMetrics(actions);

  // Carregar dades del localStorage a l'inici
  useEffect(() => {
    const loadedActions = loadActions();
    initializeActions(loadedActions);
    initializeComments();
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
        origen: 'Auditoria',
        statusHistory: [
          {
            status: 'Borrador',
            date: new Date('2024-01-15T10:00:00Z').toISOString(),
            userId: 'current-user',
            userName: 'Joan García',
            notes: 'Acció creada després de l\'auditoria'
          }
        ]
      },
      
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
        origen: 'Auditoria',
        statusHistory: [
          {
            status: 'Borrador',
            date: new Date('2024-05-12T13:16:16Z').toISOString(),
            userId: 'sara.fortea',
            userName: 'Sara Fortea',
            notes: 'Acció creada'
          },
          {
            status: 'Pendiente de Análisis',
            date: new Date('2024-05-12T14:30:00Z').toISOString(),
            userId: 'supervisor',
            userName: 'Supervisor Qualitat',
            notes: 'Enviada per anàlisi'
          }
        ]
      },
      
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
        origen: 'Auditoria',
        statusHistory: [
          {
            status: 'Borrador',
            date: new Date('2024-05-10T13:55:44Z').toISOString(),
            userId: 'edgard.ansola',
            userName: 'Edgard Ansola',
            notes: 'Acció creada'
          },
          {
            status: 'Pendiente de Análisis',
            date: new Date('2024-05-10T14:00:00Z').toISOString(),
            userId: 'supervisor',
            userName: 'Supervisor Qualitat',
            notes: 'Enviada per anàlisi'
          },
          {
            status: 'Pendiente de Comprobación',
            date: new Date('2024-05-10T13:57:33Z').toISOString(),
            userId: 'edgard.ansola',
            userName: 'Edgard Ansola',
            notes: 'Anàlisi completada, enviada per verificació'
          }
        ],
        analysisData: {
          rootCauses: 'Tras la revisión de los distintos sistemas de tratamiento de datos de carácter personal únicamente cabe considerar, en este supuesto, el fichero mensual de trabajadores remitido por la Tesorería General de la Seguridad Social. Dado el volumen de comunicaciones que supondría el cumplimiento del deber de información se considera la necesidad de acogernos a la excepción del artículo 5.5 LO 15/1999.',
          proposedAction: 'La excepción debe ser sometida al criterio de la AEPD. Se sugiere plantear este caso a la AEPD a través de AMAT para que evalúe y dictamine la posibilidad de acogernos a la excepción del artículo 5.5 LO 15/1999.',
          analysisDate: '2024-05-10',
          analysisBy: 'edgard.ansola',
          signedBy: 'EDGARD ANSOLA MUNUERA',
          signedAt: '2024-05-10T13:57:33Z'
        }
      },
      
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
        origen: 'Auditoria',
        statusHistory: [
          {
            status: 'Borrador',
            date: new Date('2007-09-25T17:58:33Z').toISOString(),
            userId: 'edgard.ansola',
            userName: 'Edgard Ansola',
            notes: 'Detecció durant auditoria'
          },
          {
            status: 'Pendiente de Análisis',
            date: new Date('2007-09-26T08:00:00Z').toISOString(),
            userId: 'supervisor',
            userName: 'Supervisor Qualitat'
          },
          {
            status: 'Pendiente de Comprobación',
            date: new Date('2007-09-27T17:34:56Z').toISOString(),
            userId: 'edgard.ansola',
            userName: 'Edgard Ansola',
            notes: 'Anàlisi de causes completada'
          },
          {
            status: 'Pendiente de Cierre',
            date: new Date('2007-10-05T12:55:20Z').toISOString(),
            userId: 'eva.mendoza',
            userName: 'Eva Mendoza',
            notes: 'Verificació completada, pendent tancament'
          }
        ],
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
    initializeActions(allActions);
    
    toast({
      title: "Accions de prova creades",
      description: `S'han creat ${testActions.length} accions de prova amb diferents estats.`
    });
    
    console.log('addTestActions: Creades', testActions.length, 'accions de prova');
  };

  const clearAllActions = () => {
    clearAllActions();
    clearComments();
    clearAllStorage();
  };

  const loadActions = () => {
    const loadedActions = loadActions();
    initializeActions(loadedActions);
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
