
import { useState, useCallback } from 'react';
import { CorrectiveAction } from '@/types';

export interface AuditEntry {
  id: string;
  actionId: string;
  userId: string;
  userName: string;
  timestamp: string;
  action: 'created' | 'updated' | 'status_changed' | 'commented' | 'assigned' | 'closed';
  details: {
    field?: string;
    oldValue?: any;
    newValue?: any;
    description?: string;
  };
  changes?: Record<string, { from: any; to: any }>;
}

const AUDIT_STORAGE_KEY = 'audit-history-data';

export const useAuditHistory = () => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>(() => {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading audit history:', error);
      return [];
    }
  });

  const saveAuditEntries = useCallback((entries: AuditEntry[]) => {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(entries));
      setAuditEntries(entries);
    } catch (error) {
      console.error('Error saving audit history:', error);
    }
  }, []);

  const logAuditEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString()
    };

    const updatedEntries = [newEntry, ...auditEntries].slice(0, 1000); // Mantenir només els últims 1000 registres
    saveAuditEntries(updatedEntries);

    console.log('📝 Audit entry logged:', newEntry);
    return newEntry;
  }, [auditEntries, saveAuditEntries]);

  const logActionCreated = useCallback((action: CorrectiveAction, userId: string, userName: string) => {
    logAuditEntry({
      actionId: action.id,
      userId,
      userName,
      action: 'created',
      details: {
        description: `Acció creada: "${action.title}"`
      }
    });
  }, [logAuditEntry]);

  const logActionUpdated = useCallback((
    actionId: string, 
    changes: Record<string, { from: any; to: any }>, 
    userId: string, 
    userName: string
  ) => {
    const changesDescription = Object.entries(changes)
      .map(([field, change]) => `${field}: "${change.from}" → "${change.to}"`)
      .join(', ');

    logAuditEntry({
      actionId,
      userId,
      userName,
      action: 'updated',
      details: {
        description: `Camps actualitzats: ${changesDescription}`
      },
      changes
    });
  }, [logAuditEntry]);

  const logStatusChanged = useCallback((
    actionId: string, 
    oldStatus: string, 
    newStatus: string, 
    userId: string, 
    userName: string
  ) => {
    logAuditEntry({
      actionId,
      userId,
      userName,
      action: 'status_changed',
      details: {
        field: 'status',
        oldValue: oldStatus,
        newValue: newStatus,
        description: `Estat canviat de "${oldStatus}" a "${newStatus}"`
      }
    });
  }, [logAuditEntry]);

  const logActionAssigned = useCallback((
    actionId: string, 
    oldAssignee: string, 
    newAssignee: string, 
    userId: string, 
    userName: string
  ) => {
    logAuditEntry({
      actionId,
      userId,
      userName,
      action: 'assigned',
      details: {
        field: 'assignedTo',
        oldValue: oldAssignee,
        newValue: newAssignee,
        description: `Reassignat de "${oldAssignee}" a "${newAssignee}"`
      }
    });
  }, [logAuditEntry]);

  const logActionClosed = useCallback((
    actionId: string, 
    closureType: string, 
    userId: string, 
    userName: string
  ) => {
    logAuditEntry({
      actionId,
      userId,
      userName,
      action: 'closed',
      details: {
        field: 'tipoCierre',
        newValue: closureType,
        description: `Acció tancada com "${closureType}"`
      }
    });
  }, [logAuditEntry]);

  const logComment = useCallback((
    actionId: string, 
    commentContent: string, 
    userId: string, 
    userName: string
  ) => {
    logAuditEntry({
      actionId,
      userId,
      userName,
      action: 'commented',
      details: {
        description: `Comentari afegit: "${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}"`
      }
    });
  }, [logAuditEntry]);

  const getActionHistory = useCallback((actionId: string): AuditEntry[] => {
    return auditEntries
      .filter(entry => entry.actionId === actionId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [auditEntries]);

  const getUserActivity = useCallback((userId: string): AuditEntry[] => {
    return auditEntries
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [auditEntries]);

  const getActivityMetrics = useCallback(() => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = auditEntries.filter(entry => 
      new Date(entry.timestamp) >= weekAgo
    );

    const thisMonth = auditEntries.filter(entry => 
      new Date(entry.timestamp) >= monthAgo
    );

    const activityByAction = auditEntries.reduce((acc, entry) => {
      acc[entry.action] = (acc[entry.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const activityByUser = auditEntries.reduce((acc, entry) => {
      acc[entry.userName] = (acc[entry.userName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEntries: auditEntries.length,
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      activityByAction,
      activityByUser,
      mostActiveUsers: Object.entries(activityByUser)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    };
  }, [auditEntries]);

  return {
    auditEntries,
    logActionCreated,
    logActionUpdated,
    logStatusChanged,
    logActionAssigned,
    logActionClosed,
    logComment,
    getActionHistory,
    getUserActivity,
    getActivityMetrics
  };
};
