

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Check, AlertTriangle, X } from 'lucide-react';
import { ProposedActionItem } from '@/types';

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

  // Debug detallat per cada acció
  console.log('=== PROPOSED ACTIONS LIST DEBUG ===');
  console.log('Total actions:', actions.length);
  console.log('ReadOnly:', readOnly);
  console.log('ShowVerificationControls:', showVerificationControls);
  actions.forEach((action, index) => {
    console.log(`Action ${index + 1} (ID: ${action.id}):`);
    console.log('  - Description:', action.description);
    console.log('  - VerificationStatus:', action.verificationStatus);
    console.log('  - Will show verification controls:', showVerificationControls && !readOnly);
  });
  console.log('=== END PROPOSED ACTIONS DEBUG ===');

  const addAction = () => {
    const newAction: ProposedActionItem = {
      id: Date.now().toString(),
      description: '',
      assignedTo: '',
      dueDate: '',
      status: 'pending',
      verificationStatus: 'not-verified'
    };
    onChange([...actions, newAction]);
  };

  const updateAction = (id: string, updates: Partial<ProposedActionItem>) => {
    const updatedActions = actions.map(action =>
      action.id === id ? { ...action, ...updates } : action
    );
    onChange(updatedActions);
  };

  const removeAction = (id: string) => {
    onChange(actions.filter(action => action.id !== id));
  };

  const handleVerificationChange = (actionId: string, status: ProposedActionItem['verificationStatus'], comments?: string) => {
    const updates: Partial<ProposedActionItem> = {
      verificationStatus: status,
      verificationComments: comments || '',
      verificationDate: new Date().toISOString(),
      verificationBy: 'current-user'
    };

    if (onVerificationUpdate) {
      onVerificationUpdate(actionId, updates);
    } else {
      updateAction(actionId, updates);
    }
  };

  const getVerificationStatusBadge = (status: ProposedActionItem['verificationStatus']) => {
    switch (status) {
      case 'implemented':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Implementada</Badge>;
      case 'partially-implemented':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Parcial</Badge>;
      case 'not-implemented':
        return <Badge className="bg-red-100 text-red-800 border-red-200">No implementada</Badge>;
      default:
        return <Badge variant="outline">Pendent verificació</Badge>;
    }
  };

  if (actions.length === 0 && readOnly) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hi ha accions proposades
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((action, index) => (
        <ActionCard
          key={action.id}
          action={action}
          index={index}
          readOnly={readOnly}
          showVerificationControls={showVerificationControls}
          onUpdate={updateAction}
          onRemove={removeAction}
          onVerificationChange={handleVerificationChange}
          getVerificationStatusBadge={getVerificationStatusBadge}
        />
      ))}
      
      {!readOnly && !showVerificationControls && (
        <Button
          type="button"
          variant="outline"
          onClick={addAction}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Afegir Acció
        </Button>
      )}
    </div>
  );
};

interface ActionCardProps {
  action: ProposedActionItem;
  index: number;
  readOnly: boolean;
  showVerificationControls: boolean;
  onUpdate: (id: string, updates: Partial<ProposedActionItem>) => void;
  onRemove: (id: string) => void;
  onVerificationChange: (actionId: string, status: ProposedActionItem['verificationStatus'], comments?: string) => void;
  getVerificationStatusBadge: (status: ProposedActionItem['verificationStatus']) => JSX.Element;
}

const ActionCard = ({
  action,
  index,
  readOnly,
  showVerificationControls,
  onUpdate,
  onRemove,
  onVerificationChange,
  getVerificationStatusBadge
}: ActionCardProps) => {
  const [verificationComments, setVerificationComments] = useState(action.verificationComments || '');

  // Debug per cada ActionCard
  console.log(`ActionCard ${action.id} - showVerificationControls:`, showVerificationControls);
  console.log(`ActionCard ${action.id} - readOnly:`, readOnly);
  console.log(`ActionCard ${action.id} - verificationStatus:`, action.verificationStatus);

  return (
    <Card key={action.id} className="border-l-4 border-l-blue-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-gray-900">Acció {index + 1}</h4>
          <div className="flex items-center space-x-2">
            {action.verificationStatus && getVerificationStatusBadge(action.verificationStatus)}
            {!readOnly && !showVerificationControls && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(action.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor={`description-${action.id}`}>Descripció</Label>
            <Textarea
              id={`description-${action.id}`}
              value={action.description}
              onChange={(e) => onUpdate(action.id, { description: e.target.value })}
              placeholder="Descripció de l'acció a implementar..."
              disabled={readOnly}
              className={readOnly ? 'bg-gray-100' : ''}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`assignedTo-${action.id}`}>Assignat a</Label>
              <Input
                id={`assignedTo-${action.id}`}
                value={action.assignedTo}
                onChange={(e) => onUpdate(action.id, { assignedTo: e.target.value })}
                placeholder="Responsable"
                disabled={readOnly}
                className={readOnly ? 'bg-gray-100' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor={`dueDate-${action.id}`}>Data límit</Label>
              <Input
                id={`dueDate-${action.id}`}
                type="date"
                value={action.dueDate}
                onChange={(e) => onUpdate(action.id, { dueDate: e.target.value })}
                disabled={readOnly}
                className={readOnly ? 'bg-gray-100' : ''}
              />
            </div>
          </div>
          
          {/* CONTROLS DE VERIFICACIÓ - AQUÍ ÉS ON HAN D'APARÈIXER */}
          {showVerificationControls && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-3">Verificació de la implementació</h5>
              
              {/* Botons de verificació */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Button
                  type="button"
                  size="sm"
                  variant={action.verificationStatus === 'implemented' ? 'default' : 'outline'}
                  onClick={() => onVerificationChange(action.id, 'implemented', verificationComments)}
                  className={action.verificationStatus === 'implemented' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Implementada
                </Button>
                
                <Button
                  type="button"
                  size="sm"
                  variant={action.verificationStatus === 'partially-implemented' ? 'default' : 'outline'}
                  onClick={() => onVerificationChange(action.id, 'partially-implemented', verificationComments)}
                  className={action.verificationStatus === 'partially-implemented' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Parcial
                </Button>
                
                <Button
                  type="button"
                  size="sm"
                  variant={action.verificationStatus === 'not-implemented' ? 'default' : 'outline'}
                  onClick={() => onVerificationChange(action.id, 'not-implemented', verificationComments)}
                  className={action.verificationStatus === 'not-implemented' ? 'bg-red-600 hover:bg-red-700' : ''}
                >
                  <X className="w-4 h-4 mr-1" />
                  No implementada
                </Button>
              </div>
              
              {/* Camp de comentaris */}
              <div>
                <Label htmlFor={`verification-comments-${action.id}`}>Comentaris de verificació</Label>
                <Textarea
                  id={`verification-comments-${action.id}`}
                  value={verificationComments}
                  onChange={(e) => setVerificationComments(e.target.value)}
                  placeholder="Comentaris sobre la verificació de la implementació..."
                  rows={2}
                />
              </div>
            </div>
          )}
          
          {/* Mostrar informació de verificació si ja està verificada */}
          {readOnly && action.verificationStatus && action.verificationStatus !== 'not-verified' && (
            <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">Estat de verificació:</span>
                {getVerificationStatusBadge(action.verificationStatus)}
              </div>
              {action.verificationComments && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Comentaris:</strong> {action.verificationComments}
                </p>
              )}
              {action.verificationDate && (
                <p className="text-xs text-gray-500">
                  Verificat el {new Date(action.verificationDate).toLocaleString('ca-ES')} 
                  {action.verificationBy && ` per ${action.verificationBy}`}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProposedActionsList;

