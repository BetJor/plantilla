import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Save, X, User, Calendar, Split, Sparkles, Clock } from 'lucide-react';
import { type ProposedActionItem } from '@/types';
import { useGeminiSuggestions } from '@/hooks/useGeminiSuggestions';

interface ProposedActionsListProps {
  actions: ProposedActionItem[];
  onChange: (actions: ProposedActionItem[]) => void;
  readOnly?: boolean;
  showVerificationControls?: boolean;
  onVerificationUpdate?: (actionId: string, updates: Partial<ProposedActionItem>) => void;
}

const ProposedActionsList = ({ 
  actions, 
  onChange, 
  readOnly = false,
  showVerificationControls = false,
  onVerificationUpdate
}: ProposedActionsListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAction, setNewAction] = useState({
    description: '',
    assignedTo: '',
    dueDate: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const { generateMultipleProposedActions, isLoading } = useGeminiSuggestions();

  const handleAddAction = () => {
    if (!newAction.description.trim() || !newAction.assignedTo.trim() || !newAction.dueDate) {
      return;
    }

    const action: ProposedActionItem = {
      id: Date.now().toString(),
      description: newAction.description.trim(),
      assignedTo: newAction.assignedTo.trim(),
      dueDate: newAction.dueDate,
      status: 'pending'
    };

    onChange([...actions, action]);
    setNewAction({ description: '', assignedTo: '', dueDate: '' });
    setShowNewForm(false);
  };

  const handleEditAction = (id: string, updates: Partial<ProposedActionItem>) => {
    onChange(actions.map(action => 
      action.id === id ? { ...action, ...updates } : action
    ));
    setEditingId(null);
  };

  const handleDeleteAction = (id: string) => {
    onChange(actions.filter(action => action.id !== id));
  };

  const handleVerificationUpdate = (actionId: string, updates: Partial<ProposedActionItem>) => {
    const updatedAction = {
      ...updates,
      verificationDate: new Date().toISOString(),
      verificationBy: 'current-user'
    };

    if (onVerificationUpdate) {
      onVerificationUpdate(actionId, updatedAction);
    }
  };

  const handleSplitAction = async (actionToSplit: ProposedActionItem) => {
    try {
      const mockAction = {
        id: `mock-${Date.now()}`,
        title: `Divisió d'acció: ${actionToSplit.description.substring(0, 50)}...`,
        description: actionToSplit.description,
        type: 'sense-categoria',
        category: 'sense-categoria',
        subCategory: 'general',
        status: 'Borrador' as const,
        centre: 'Centre actual',
        department: 'Departament actual',
        priority: 'mitjana' as const,
        assignedTo: actionToSplit.assignedTo,
        dueDate: actionToSplit.dueDate,
        attachments: [],
        createdBy: 'current-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const splitActions = await generateMultipleProposedActions({
        action: mockAction,
        rootCauses: `Divisió de l'acció original: ${actionToSplit.description}`,
        targetCount: 2
      });

      const updatedActions = actions.filter(action => action.id !== actionToSplit.id);
      onChange([...updatedActions, ...splitActions]);
    } catch (error) {
      console.error('Error splitting action:', error);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationStatusColor = (status?: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'partially-implemented': return 'bg-yellow-100 text-yellow-800';
      case 'not-implemented': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationStatusText = (status?: string) => {
    switch (status) {
      case 'implemented': return 'Implementada';
      case 'partially-implemented': return 'Parcialment implementada';
      case 'not-implemented': return 'No implementada';
      default: return 'Pendent de verificació';
    }
  };

  return (
    <div className="space-y-4">
      {actions.length > 0 && (
        <div className="space-y-3">
          {actions.map((action) => (
            <ActionCard
              key={action.id}
              action={action}
              editingId={editingId}
              onEdit={(updates) => handleEditAction(action.id, updates)}
              onDelete={() => handleDeleteAction(action.id)}
              onSplit={() => handleSplitAction(action)}
              onStartEdit={() => setEditingId(action.id)}
              onCancelEdit={() => setEditingId(null)}
              readOnly={readOnly}
              showVerificationControls={showVerificationControls}
              onVerificationUpdate={handleVerificationUpdate}
              isLoading={isLoading}
              getStatusColor={getStatusColor}
              getVerificationStatusColor={getVerificationStatusColor}
              getVerificationStatusText={getVerificationStatusText}
            />
          ))}
        </div>
      )}

      {!readOnly && (
        <>
          {showNewForm ? (
            <Card className="border border-blue-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newDescription">Descripció de l'acció</Label>
                    <Textarea
                      id="newDescription"
                      value={newAction.description}
                      onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                      placeholder="Descriure l'acció específica a implementar..."
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="newAssignedTo">Responsable</Label>
                      <Input
                        id="newAssignedTo"
                        value={newAction.assignedTo}
                        onChange={(e) => setNewAction({ ...newAction, assignedTo: e.target.value })}
                        placeholder="Nom del responsable"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newDueDate">Data límit</Label>
                      <Input
                        id="newDueDate"
                        type="date"
                        value={newAction.dueDate}
                        onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleAddAction}
                      disabled={!newAction.description.trim() || !newAction.assignedTo.trim() || !newAction.dueDate}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Afegir Acció
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowNewForm(false);
                        setNewAction({ description: '', assignedTo: '', dueDate: '' });
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel·lar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewForm(true)}
              className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Afegir nova acció
            </Button>
          )}
        </>
      )}

      {actions.length === 0 && readOnly && (
        <p className="text-gray-500 text-sm italic">
          No s'han definit accions específiques
        </p>
      )}
    </div>
  );
};

interface ActionCardProps {
  action: ProposedActionItem;
  editingId: string | null;
  onEdit: (updates: Partial<ProposedActionItem>) => void;
  onDelete: () => void;
  onSplit: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  readOnly: boolean;
  showVerificationControls: boolean;
  onVerificationUpdate: (actionId: string, updates: Partial<ProposedActionItem>) => void;
  isLoading: boolean;
  getStatusColor: (status?: string) => string;
  getVerificationStatusColor: (status?: string) => string;
  getVerificationStatusText: (status?: string) => string;
}

const ActionCard = ({
  action,
  editingId,
  onEdit,
  onDelete,
  onSplit,
  onStartEdit,
  onCancelEdit,
  readOnly,
  showVerificationControls,
  onVerificationUpdate,
  isLoading,
  getStatusColor,
  getVerificationStatusColor,
  getVerificationStatusText
}: ActionCardProps) => {
  const [verificationComments, setVerificationComments] = useState(
    action.verificationComments || ''
  );

  const handleStatusChange = (status: ProposedActionItem['verificationStatus']) => {
    onVerificationUpdate(action.id, {
      verificationStatus: status,
      verificationComments
    });
  };

  const handleCommentsChange = () => {
    onVerificationUpdate(action.id, {
      verificationComments
    });
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        {editingId === action.id && !readOnly ? (
          <EditActionForm
            action={action}
            onSave={onEdit}
            onCancel={onCancelEdit}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {action.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{action.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(action.dueDate).toLocaleDateString('ca-ES')}</span>
                  </div>
                  {action.status && (
                    <Badge variant="outline" className={getStatusColor(action.status)}>
                      {action.status}
                    </Badge>
                  )}
                  {action.id.includes('ai-') && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      IA
                    </Badge>
                  )}
                  {showVerificationControls && (
                    <Badge 
                      variant="outline" 
                      className={getVerificationStatusColor(action.verificationStatus)}
                    >
                      {getVerificationStatusText(action.verificationStatus)}
                    </Badge>
                  )}
                </div>
              </div>
              {!readOnly && !showVerificationControls && (
                <div className="flex gap-2 ml-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onSplit}
                    disabled={isLoading}
                    title="Dividir aquesta acció en múltiples accions més específiques"
                  >
                    <Split className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onStartEdit}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Controls de verificació integrats */}
            {showVerificationControls && !readOnly && (
              <div className="space-y-3 border-t pt-3">
                <div>
                  <Label className="text-sm font-medium">Estat de verificació</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={action.verificationStatus === 'implemented' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange('implemented')}
                    >
                      Implementada
                    </Button>
                    <Button
                      type="button"
                      variant={action.verificationStatus === 'partially-implemented' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange('partially-implemented')}
                    >
                      Parcial
                    </Button>
                    <Button
                      type="button"
                      variant={action.verificationStatus === 'not-implemented' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange('not-implemented')}
                    >
                      No implementada
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`comments-${action.id}`} className="text-sm font-medium">
                    Comentaris de verificació
                  </Label>
                  <Textarea
                    id={`comments-${action.id}`}
                    value={verificationComments}
                    onChange={(e) => setVerificationComments(e.target.value)}
                    onBlur={handleCommentsChange}
                    placeholder="Afegeix comentaris sobre l'estat de la implementació..."
                    rows={2}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Informació de verificació en mode només lectura */}
            {showVerificationControls && readOnly && action.verificationComments && (
              <div className="border-t pt-3">
                <Label className="text-sm font-medium">Comentaris de verificació</Label>
                <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
                  {action.verificationComments}
                </p>
              </div>
            )}

            {/* Data de verificació */}
            {action.verificationDate && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                Verificat el {new Date(action.verificationDate).toLocaleString('ca-ES')}
                {action.verificationBy && (
                  <>
                    <User className="w-3 h-3 ml-2 mr-1" />
                    per {action.verificationBy}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface EditActionFormProps {
  action: ProposedActionItem;
  onSave: (updates: Partial<ProposedActionItem>) => void;
  onCancel: () => void;
}

const EditActionForm = ({ action, onSave, onCancel }: EditActionFormProps) => {
  const [formData, setFormData] = useState({
    description: action.description,
    assignedTo: action.assignedTo,
    dueDate: action.dueDate,
    status: action.status || 'pending'
  });

  const handleSave = () => {
    if (!formData.description.trim() || !formData.assignedTo.trim() || !formData.dueDate) {
      return;
    }
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="editDescription">Descripció de l'acció</Label>
        <Textarea
          id="editDescription"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="editAssignedTo">Responsable</Label>
          <Input
            id="editAssignedTo"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="editDueDate">Data límit</Label>
          <Input
            id="editDueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="editStatus">Estat</Label>
          <select
            id="editStatus"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProposedActionItem['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pendent</option>
            <option value="in-progress">En progrés</option>
            <option value="completed">Completada</option>
            <option value="cancelled">Cancel·lada</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={!formData.description.trim() || !formData.assignedTo.trim() || !formData.dueDate}
        >
          <Save className="w-4 h-4 mr-2" />
          Guardar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel·lar
        </Button>
      </div>
    </div>
  );
};

export default ProposedActionsList;
