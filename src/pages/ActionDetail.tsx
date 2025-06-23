import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertCircle, Paperclip, MessageSquare, Activity } from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { CorrectiveAction } from '@/types';
import DescriptionSection from '@/components/ActionFormSections/DescriptionSection';
import AnalysisSection from '@/components/ActionFormSections/AnalysisSection';
import ClosureSection from '@/components/ActionFormSections/ClosureSection';
import AttachmentsSection from '@/components/ActionFormSections/AttachmentsSection';
import CommentsSection from '@/components/ActionFormSections/CommentsSection';
import StatusProgress from '@/components/ActionFormSections/StatusProgress';
import ControlPanelSection from '@/components/ControlPanelSection';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import { useToast } from '@/hooks/use-toast';

const ActionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { actions, updateAction, comments } = useCorrectiveActions();
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  
  // Refs to access save functions from child components
  const descriptionSaveRef = useRef<(() => void) | null>(null);
  const analysisSaveRef = useRef<(() => void) | null>(null);
  const analysisSaveOnlyRef = useRef<(() => void) | null>(null);
  const closureSaveRef = useRef<(() => void) | null>(null);
  const closureSaveOnlyRef = useRef<(() => void) | null>(null);
  
  console.log('ActionDetail: ID de la ruta:', id);
  console.log('ActionDetail: Accions disponibles:', actions.map(a => ({ id: a.id, title: a.title })));
  
  const action = actions.find(a => a.id === id);
  
  console.log('ActionDetail: Acció trobada:', action ? `${action.id} - ${action.title}` : 'No trobada');

  if (!action) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/actions')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tornar
          </Button>
        </div>
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acció no trobada</h3>
            <p className="text-gray-600">
              L'acció amb ID "{id}" no existeix o ha estat eliminada.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Accions disponibles: {actions.length > 0 ? actions.map(a => a.id).join(', ') : 'Cap'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Borrador': return 'secondary';
      case 'Pendiente de Análisis': return 'default';
      case 'Pendiente de Comprobación': return 'default';
      case 'Pendiente de Cierre': return 'destructive';
      case 'Cerrado': return 'secondary';
      case 'Anulada': return 'destructive';
      default: return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'crítica': return 'destructive';
      case 'alta': return 'destructive';
      case 'mitjana': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  const handleStatusChange = (newStatus: CorrectiveAction['status']) => {
    updateAction(action.id, { status: newStatus });
    setHasPendingChanges(false);
    
    // Show success toast
    toast({
      title: "Estat actualitzat",
      description: `L'acció s'ha actualitzat a l'estat: ${newStatus}`,
    });
    
    // Navigate back to actions list after a short delay
    setTimeout(() => {
      navigate('/actions');
    }, 1500);
  };

  const handleActionUpdate = (updates: Partial<CorrectiveAction>) => {
    updateAction(action.id, updates);
    setHasPendingChanges(false);
  };

  const handleAttachmentsUpdate = (attachments: string[]) => {
    updateAction(action.id, { attachments });
  };

  const handleSave = () => {
    // Call the appropriate save function based on current status
    switch (action.status) {
      case 'Borrador':
        if (descriptionSaveRef.current) {
          descriptionSaveRef.current();
        }
        break;
      case 'Pendiente de Análisis':
        if (analysisSaveOnlyRef.current) {
          analysisSaveOnlyRef.current();
        }
        break;
      case 'Pendiente de Cierre':
        if (closureSaveOnlyRef.current) {
          closureSaveOnlyRef.current();
        }
        break;
    }
    setHasPendingChanges(false);
    
    // Show success toast
    toast({
      title: "Canvis guardats",
      description: "Les modificacions s'han desat correctament.",
    });
    
    // Navigate back to actions list after a short delay
    setTimeout(() => {
      navigate('/actions');
    }, 1500);
  };

  const renderCumulativeSections = () => {
    const sections = [];
    
    // Always show description section
    sections.push(
      <DescriptionSection 
        key="description"
        action={action} 
        onUpdate={handleActionUpdate}
        readOnly={action.status !== 'Borrador'}
        saveRef={descriptionSaveRef}
        onChangesDetected={() => setHasPendingChanges(true)}
      />
    );

    // Show analysis section if status is beyond Borrador
    if (['Pendiente de Análisis', 'Pendiente de Comprobación', 'Pendiente de Cierre', 'Cerrado'].includes(action.status)) {
      sections.push(
        <AnalysisSection 
          key="analysis"
          action={action} 
          onUpdate={handleActionUpdate}
          readOnly={!['Pendiente de Análisis', 'Pendiente de Comprobación'].includes(action.status)}
          saveRef={analysisSaveRef}
          saveOnlyRef={analysisSaveOnlyRef}
          onChangesDetected={() => setHasPendingChanges(true)}
        />
      );
    }

    // Show closure section if status is Pendiente de Cierre or Cerrado
    if (['Pendiente de Cierre', 'Cerrado'].includes(action.status)) {
      sections.push(
        <ClosureSection 
          key="closure"
          action={action} 
          onUpdate={handleActionUpdate}
          readOnly={action.status !== 'Pendiente de Cierre'}
          saveRef={closureSaveRef}
          saveOnlyRef={closureSaveOnlyRef}
          onChangesDetected={() => setHasPendingChanges(true)}
        />
      );
    }

    // Show closed message if action is closed or annulled
    if (['Cerrado', 'Anulada'].includes(action.status)) {
      sections.push(
        <Card key="status-message">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Acció {action.status === 'Cerrado' ? 'Tancada' : 'Anul·lada'}
            </h3>
            <p className="text-gray-600">
              Aquesta acció ja està {action.status === 'Cerrado' ? 'tancada' : 'anul·lada'} i no es pot modificar.
            </p>
          </CardContent>
        </Card>
      );
    }

    return sections;
  };

  // Get counts for summaries
  const actionComments = comments.filter(c => c.actionId === action.id);
  const attachmentCount = action.attachments.length;
  const commentCount = actionComments.length;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/actions')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Tornar a Accions
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{action.title}</h1>
            <p className="text-gray-600">ID: {action.id}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Badge variant={getPriorityVariant(action.priority)} className="px-3 py-1">
            Prioritat: {action.priority}
          </Badge>
          <Badge variant={getStatusVariant(action.status)} className="px-3 py-1">
            {action.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {renderCumulativeSections()}
        </div>

        <div className="space-y-6">
          <CollapsibleSection
            id="status-progress"
            title="Progrés de l'Acció"
            defaultOpen={true}
            summary={<span>Estat actual: <strong>{action.status}</strong></span>}
          >
            <StatusProgress action={action} />
          </CollapsibleSection>

          <CollapsibleSection
            id="control-panel"
            title="Control Panel"
            icon={<Activity className="w-5 h-5" />}
            defaultOpen={false}
            summary={
              <div className="flex items-center gap-4 text-sm">
                <span>Assignat: <strong>{action.assignedTo}</strong></span>
                <span>•</span>
                <span>Centre: <strong>{action.centre}</strong></span>
              </div>
            }
          >
            <ControlPanelSection 
              action={action} 
              onUpdate={handleActionUpdate}
            />
          </CollapsibleSection>

          <CollapsibleSection
            id="attachments"
            title="Adjunts"
            icon={<Paperclip className="w-5 h-5" />}
            badge={attachmentCount > 0 && <Badge variant="secondary" className="ml-2">{attachmentCount}</Badge>}
            defaultOpen={attachmentCount > 0}
            summary={attachmentCount > 0 ? `${attachmentCount} fitxer${attachmentCount > 1 ? 's' : ''}` : 'Cap adjunt'}
          >
            <AttachmentsSection
              attachments={action.attachments}
              onUpdate={handleAttachmentsUpdate}
              readOnly={['Cerrado', 'Anulada'].includes(action.status)}
            />
          </CollapsibleSection>

          <CollapsibleSection
            id="comments"
            title="Comentaris"
            icon={<MessageSquare className="w-5 h-5" />}
            badge={commentCount > 0 && <Badge variant="secondary" className="ml-2">{commentCount}</Badge>}
            defaultOpen={commentCount > 0}
            summary={commentCount > 0 ? `${commentCount} comentari${commentCount > 1 ? 's' : ''}` : 'Sense comentaris'}
          >
            <CommentsSection 
              actionId={action.id} 
              readOnly={['Cerrado', 'Anulada'].includes(action.status)}
            />
          </CollapsibleSection>
        </div>
      </div>

      {/* Botons flotants per les accions d'estat */}
      <FloatingActionButtons 
        action={action}
        onStatusChange={handleStatusChange}
        onSave={handleSave}
        hasPendingChanges={hasPendingChanges}
      />
    </div>
  );
};

export default ActionDetail;
