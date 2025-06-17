
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'supervisor' | 'centre_user' | 'quality';
  centre?: string;
  department?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  origin: 'Auditoria' | 'Incidencias' | 'Otros' | 'Revisión del Sistema' | 'Seguimiento Indicadores/Objetivos';
  centre: string;
  department: string;
  detectionDate: string;
  severity: 'baixa' | 'mitjana' | 'alta' | 'crítica';
  status: 'oberta' | 'en_proces' | 'tancada';
  attachments: string[];
  createdBy: string;
  createdAt: string;
}

export interface CorrectiveAction {
  id: string;
  title: string;
  description: string;
  type: 'Calidad Total' | 'Gestión de riesgos' | 'Sistema de gestión de seguridad de la información' | 'Sistema de gestión de la prevención' | 'Medioambiental ISL' | 'Medioambiental Organización Territorial' | 'Sistemas de Información' | 'Medioambientales Hospitales' | 'SAU' | 'Responsabilidad Social Corporativa';
  subCategory: string;
  status: 'Borrador' | 'Pendiente de Análisis' | 'Pendiente de Comprobación' | 'Pendiente de Cierre' | 'Cerrado' | 'Anulada';
  dueDate: string;
  assignedTo: string;
  incidentId?: string;
  priority: 'baixa' | 'mitjana' | 'alta' | 'crítica';
  centre: string;
  department: string;
  attachments: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
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
