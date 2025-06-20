export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'centre_user' | 'quality';
  centre?: string;
  department?: string;
  // Nous camps per als rols específics
  specificRoles?: string[]; // Array de rols específics segons USER_ROLES
  territorialScope?: string; // Àmbit geogràfic o funcional
}

export interface ProposedActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
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
  department?: string; // Made optional
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  
  // Nous camps segons requeriments
  origin?: string; // Origen de l'acció (auditoria, incidències, etc.)
  auditDate?: string; // Data d'auditoria/origen
  sector?: string; // Sector/Àrea
  areasImplicadas?: string[]; // Àrees funcionals implicades
  areasHospital?: string[]; // Àrees implicades del hospital (per ACM-H)
  responsableAnalisis?: string; // Responsable de l'anàlisi
  responsableImplantacion?: string; // Responsable de la implantació
  responsableCierre?: string; // Responsable del tancament
  fechaLimiteAnalisis?: string; // Data límit per a l'anàlisi
  fechaLimiteImplantacion?: string; // Data límit per a la implantació
  fechaLimiteCierre?: string; // Data límit per al tancament
  
  // Camps per a les notificacions
  notificacionesEnviadas?: NotificationRecord[];
  
  // Camp per indicar si és una acció "Bis" (generada automàticament)
  esBis?: boolean;
  accionOriginal?: string; // ID de l'acció original si és Bis
  
  // Tipus de tancament
  tipoCierre?: 'conforme' | 'no-conforme';
  
  // Dades existents per a cada fase
  analysisData?: {
    rootCauses: string;
    proposedAction?: string; // Mantenim per compatibilitat amb dades existents
    proposedActions?: ProposedActionItem[]; // Nova estructura
    analysisDate?: string;
    analysisBy?: string;
    signedBy?: string; // Signature for analysis phase
    signedAt?: string;
  };
  verificationData?: {
    implementationCheck: string;
    verificationDate?: string;
    verificationBy?: string;
    evidenceAttachments: string[];
    signedBy?: string; // Signature for verification phase
    signedAt?: string;
  };
  closureData?: {
    closureNotes: string;
    closureDate?: string;
    closureBy?: string;
    effectivenessEvaluation: string;
    isConforme?: boolean; // Si/No per conforme
    signedBy?: string; // Signature for closure phase
    signedAt?: string;
  };
}

export interface NotificationRecord {
  type: 'pendiente-analisis' | 'pendiente-comprobacion' | 'pendiente-cierre' | 'cerrada' | 'retraso' | 'proximo-vencimiento';
  sentDate: string;
  recipient: string;
  actionId: string;
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
  // Noves mètriques segons requeriments
  actionsByOrigin: { origin: string; count: number }[];
  overdueByType: { type: string; count: number }[];
  conformeVsNoConforme: { conforme: number; noConforme: number };
}
