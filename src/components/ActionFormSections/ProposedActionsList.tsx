
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit2, Save, X, User, Calendar } from 'lucide-react';
import { ProposedActionItem } from '@/types';

interface ProposedActionsListProps {
  actions: ProposedActionItem[];
  onChange: (actions: ProposedActionItem[]) => void;
  readOnly?: boolean;
}

const ProposedActionsList = ({ actions, onChange, readOnly = false }: ProposedActionsListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAction, setNewAction] = useState({
    description: '',
    assignedTo: '',
    dueDate: ''
  });
  const [showNewForm, setShowNewForm] = useState(false);

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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {actions.length > 0 && (
        <div className="space-y-3">
          {actions.map((action) => (
            <Card key={action.id} className="border border-gray-200">
              <CardContent className="p-4">
                {editingId === action.id && !readOnly ? (
                  <EditActionForm
                    action={action}
                    onSave={(updates) => handleEditAction(action.id, updates)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
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
                      </div>
                    </div>
                    {!readOnly && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(action.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAction(action.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
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
