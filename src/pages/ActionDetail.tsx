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

const ActionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { actions, addComment, updateAction } = useCorrectiveActions();
  const [newComment, setNewComment] = useState('');
  
  const action = actions.find(a => a.id === id);

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
            <p className="text-gray-600">L'acció que cerques no existeix o ha estat eliminada.</p>
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

  const statusOptions: CorrectiveAction['status'][] = [
    'Borrador',
    'Pendiente de Análisis',
    'Pendiente de Comprobación',
    'Pendiente de Cierre',
    'Cerrado',
    'Anulada'
  ];

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Detalls de l'Acció
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Descripció</Label>
                <p className="mt-1 text-gray-900">{action.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Tipus</Label>
                  <p className="mt-1 text-gray-900">{action.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Subcategoria</Label>
                  <p className="mt-1 text-gray-900">{action.subCategory}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestió d'Estat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    variant={action.status === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(status)}
                    className="text-xs"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

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
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Departament</p>
                  <p className="text-sm text-gray-900">{action.department}</p>
                </div>
              </div>
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
