import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageSquare, Paperclip, Calendar, User, Building, AlertCircle } from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { CorrectiveAction } from '@/types';
import DescriptionSection from '@/components/ActionFormSections/DescriptionSection';
import AnalysisSection from '@/components/ActionFormSections/AnalysisSection';
import VerificationSection from '@/components/ActionFormSections/VerificationSection';
import ClosureSection from '@/components/ActionFormSections/ClosureSection';
import StatusProgress from '@/components/ActionFormSections/StatusProgress';
import StatusControls from '@/components/ActionFormSections/StatusControls';

const ActionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions, addComment, updateAction } = useCorrectiveActions();
  const [newComment, setNewComment] = useState('');
  
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
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment({
        actionId: action.id,
        userId: 'current-user',
        userName: 'Usuari Actual',
        content: newComment,
        attachments: []
      });
      setNewComment('');
    }
  };

  const handleActionUpdate = (updates: Partial<CorrectiveAction>) => {
    updateAction(action.id, updates);
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
      />
    );

    // Show analysis section if status is beyond Borrador
    if (['Pendiente de Análisis', 'Pendiente de Comprobación', 'Pendiente de Cierre', 'Cerrado'].includes(action.status)) {
      sections.push(
        <AnalysisSection 
          key="analysis"
          action={action} 
          onUpdate={handleActionUpdate}
          readOnly={action.status !== 'Pendiente de Análisis'}
        />
      );
    }

    // Show verification section if status is beyond Pendiente de Análisis
    if (['Pendiente de Comprobación', 'Pendiente de Cierre', 'Cerrado'].includes(action.status)) {
      sections.push(
        <VerificationSection 
          key="verification"
          action={action} 
          onUpdate={handleActionUpdate}
          readOnly={action.status !== 'Pendiente de Comprobación'}
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

  return (
    <div className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Comentaris</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment">Afegir comentari</Label>
                <Textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escriu el teu comentari..."
                />
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  Afegir Comentari
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <StatusProgress action={action} />
          
          <StatusControls 
            action={action} 
            onStatusChange={handleStatusChange}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informació General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Data Límit</p>
                  <p className="text-sm text-gray-900">{new Date(action.dueDate).toLocaleDateString('ca-ES')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Assignat a</p>
                  <p className="text-sm text-gray-900">{action.assignedTo}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Centre</p>
                  <p className="text-sm text-gray-900">{action.centre}</p>
                </div>
              </div>
              {action.department && (
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Departament</p>
                    <p className="text-sm text-gray-900">{action.department}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Paperclip className="w-5 h-5 mr-2" />
                Adjunts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {action.attachments.length > 0 ? (
                <div className="space-y-2">
                  {action.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 border rounded-lg">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{attachment}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No hi ha adjunts</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActionDetail;
