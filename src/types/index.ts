export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'centre_user' | 'quality';
  centre?: string;
  department?: string;
}

export interface CorrectiveAction {
  id: string;
  title: string;
  description: string;
  type: string;
  category?: string;
  subCategory: string;
  status: 'Borrador' | 'Pendiente de Análisis' | 'Pendiente de Comprobación' | 'Pendiente de Cierre' | 'Cerrado' | 'Anulada';
  dueDate: string;
  assignedTo: string;
  priority: 'baixa' | 'mitjana' | 'alta' | 'crítica';
  centre: string;
  department: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // New fields for different status sections
  analysisData?: {
    rootCauses: string;
    proposedAction: string;
    analysisDate?: string;
    analysisBy?: string;
  };
  verificationData?: {
    implementationCheck: string;
    verificationDate?: string;
    verificationBy?: string;
    evidenceAttachments: string[];
  };
  closureData?: {
    closureNotes: string;
    closureDate?: string;
    closureBy?: string;
    effectivenessEvaluation: string;
  };
}

export interface Comment {
  id: string;
  actionId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  attachments: string[];
}

export interface DashboardMetrics {
  totalActions: number;
  pendingActions: number;
  overdueActions: number;
  closedThisMonth: number;
  actionsByStatus: { status: string; count: number }[];
  actionsByType: { type: string; count: number }[];
  actionsByCentre: { centre: string; count: number }[];
}
