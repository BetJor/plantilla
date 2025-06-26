import { useState, useEffect, useCallback } from 'react';
import { CorrectiveAction } from '@/types';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  actionId: string;
  type: 'pendiente-analisis' | 'pendiente-comprobacion' | 'pendiente-cierre' | 'cerrada' | 'retraso' | 'proximo-vencimiento' | 'bis-generated' | 'multiple-bis-warning' | 'director-review-required';
  title: string;
  message: string;
  recipient: string;
  isRead: boolean;
  createdAt: string;
  actionTitle?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

const STORAGE_KEY = 'notifications-data';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Carregar notificacions del localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  // Guardar notificacions al localStorage
  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotifications));
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, []);

  // Simular enviament de correu electrònic
  const simulateEmailSend = useCallback((notification: Notification) => {
    console.log(`📧 Email sent to ${notification.recipient}:`, {
      subject: notification.title,
      body: notification.message
    });
    
    toast({
      title: "Notificació enviada",
      description: `Email enviat a ${notification.recipient}`,
    });
  }, []);

  // Crear notificació
  const createNotification = useCallback((
    actionId: string,
    type: Notification['type'],
    recipient: string,
    actionTitle?: string,
    priority: Notification['priority'] = 'medium'
  ) => {
    const getNotificationContent = (type: Notification['type'], actionTitle?: string) => {
      switch (type) {
        case 'pendiente-analisis':
          return {
            title: 'Acció pendent d\'anàlisi',
            message: `L'acció "${actionTitle}" està pendent d'anàlisi i requereix la teva atenció.`
          };
        case 'pendiente-comprobacion':
          return {
            title: 'Acció pendent de comprovació',
            message: `L'acció "${actionTitle}" està pendent de comprovació de la implantació.`
          };
        case 'pendiente-cierre':
          return {
            title: 'Acció pendent de tancament',
            message: `L'acció "${actionTitle}" està pendent de tancament definitiu.`
          };
        case 'cerrada':
          return {
            title: 'Acció tancada',
            message: `L'acció "${actionTitle}" ha estat tancada correctament.`
          };
        case 'retraso':
          return {
            title: 'Acció amb retard',
            message: `L'acció "${actionTitle}" ha superat la data límit prevista.`
          };
        case 'proximo-vencimiento':
          return {
            title: 'Acció amb venciment proper',
            message: `L'acció "${actionTitle}" venç en els propers 10 dies.`
          };
        case 'bis-generated':
          return {
            title: 'Acció BIS generada automàticament',
            message: `S'ha generat automàticament l'acció BIS "${actionTitle}" degut al tancament NO CONFORME d'una acció relacionada.`
          };
        case 'multiple-bis-warning':
          return {
            title: '⚠️ Múltiples accions BIS detectades',
            message: `S'han detectat múltiples accions BIS per "${actionTitle}". Cal revisar el patró d'incidències.`
          };
        case 'director-review-required':
          return {
            title: '👔 Revisió de direcció requerida',
            message: `L'acció "${actionTitle}" requereix revisió de direcció abans del tancament com a NO CONFORME.`
          };
        default:
          return {
            title: 'Notificació',
            message: 'Nova notificació disponible'
          };
      }
    };

    const content = getNotificationContent(type, actionTitle);
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      actionId,
      type,
      title: content.title,
      message: content.message,
      recipient,
      isRead: false,
      createdAt: new Date().toISOString(),
      actionTitle,
      priority
    };

    const updatedNotifications = [...notifications, notification];
    saveNotifications(updatedNotifications);
    simulateEmailSend(notification);

    return notification;
  }, [notifications, saveNotifications, simulateEmailSend]);

  // Notificar generació d'acció BIS
  const notifyBisGenerated = useCallback((originalAction: CorrectiveAction, bisAction: CorrectiveAction) => {
    // Notificar al responsable de l'acció original
    if (originalAction.createdBy) {
      createNotification(
        bisAction.id, 
        'bis-generated', 
        originalAction.createdBy, 
        bisAction.title, 
        'high'
      );
    }
    
    // Notificar al responsable de la nova acció BIS
    if (bisAction.assignedTo && bisAction.assignedTo !== originalAction.createdBy) {
      createNotification(
        bisAction.id, 
        'bis-generated', 
        bisAction.assignedTo, 
        bisAction.title, 
        'high'
      );
    }
  }, [createNotification]);

  // Detectar múltiples accions BIS
  const checkMultipleBisActions = useCallback((actions: CorrectiveAction[], newBisAction: CorrectiveAction) => {
    const relatedBisActions = actions.filter(action => 
      action.esBis && 
      (action.type === newBisAction.type || 
       action.department === newBisAction.department ||
       action.centre === newBisAction.centre)
    );

    if (relatedBisActions.length >= 2) {
      // Notificar a la direcció
      createNotification(
        newBisAction.id,
        'multiple-bis-warning',
        'direccio-qualitat',
        `${newBisAction.type} - ${newBisAction.centre}`,
        'critical'
      );
    }
  }, [createNotification]);

  // Notificar necessitat de revisió de direcció
  const notifyDirectorReviewRequired = useCallback((action: CorrectiveAction) => {
    createNotification(
      action.id,
      'director-review-required',
      'direccio-qualitat',
      action.title,
      'high'
    );
  }, [createNotification]);

  // Marcar com a llegida
  const markAsRead = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    );
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Marcar totes com a llegides
  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, isRead: true }));
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Esborrar notificació
  const deleteNotification = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
    saveNotifications(updatedNotifications);
  }, [notifications, saveNotifications]);

  // Comprovar retards i venciments propers
  const checkOverdueAndUpcoming = useCallback((actions: CorrectiveAction[]) => {
    const now = new Date();
    const tenDaysFromNow = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

    actions.forEach(action => {
      if (action.status === 'Cerrado' || action.status === 'Anulada') return;

      const dueDate = new Date(action.dueDate);
      const actionId = action.id;

      // Comprovar retards
      if (dueDate < now) {
        const hasOverdueNotif = notifications.some(
          notif => notif.actionId === actionId && notif.type === 'retraso'
        );
        if (!hasOverdueNotif && action.assignedTo) {
          createNotification(actionId, 'retraso', action.assignedTo, action.title);
        }
      }

      // Comprovar venciments propers
      if (dueDate > now && dueDate <= tenDaysFromNow) {
        const hasUpcomingNotif = notifications.some(
          notif => notif.actionId === actionId && notif.type === 'proximo-vencimiento'
        );
        if (!hasUpcomingNotif && action.assignedTo) {
          createNotification(actionId, 'proximo-vencimiento', action.assignedTo, action.title);
        }
      }
    });
  }, [notifications, createNotification]);

  // Notificar canvi d'estat
  const notifyStatusChange = useCallback((action: CorrectiveAction, newStatus: CorrectiveAction['status']) => {
    let recipient = '';
    let notificationType: Notification['type'] | null = null;

    switch (newStatus) {
      case 'Pendiente de Análisis':
        recipient = action.responsableAnalisis || '';
        notificationType = 'pendiente-analisis';
        break;
      case 'Pendiente de Comprobación':
        recipient = action.responsableImplantacion || '';
        notificationType = 'pendiente-comprobacion';
        break;
      case 'Pendiente de Cierre':
        recipient = action.responsableCierre || action.createdBy || '';
        notificationType = 'pendiente-cierre';
        break;
      case 'Cerrado':
        recipient = action.createdBy || '';
        notificationType = 'cerrada';
        break;
    }

    if (recipient && notificationType) {
      createNotification(action.id, notificationType, recipient, action.title);
    }
  }, [createNotification]);

  // Obtenir mètriques
  const getMetrics = useCallback(() => {
    const unreadCount = notifications.filter(notif => !notif.isRead).length;
    const overdueCount = notifications.filter(notif => notif.type === 'retraso').length;
    const upcomingCount = notifications.filter(notif => notif.type === 'proximo-vencimiento').length;

    return {
      unreadCount,
      overdueCount,
      upcomingCount,
      totalCount: notifications.length
    };
  }, [notifications]);

  return {
    notifications,
    createNotification,
    notifyBisGenerated,
    checkMultipleBisActions,
    notifyDirectorReviewRequired,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    checkOverdueAndUpcoming,
    notifyStatusChange,
    getMetrics
  };
};
