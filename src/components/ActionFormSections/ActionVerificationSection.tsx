
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, User, Calendar, AlertCircle } from 'lucide-react';
import { CorrectiveAction, ProposedActionItem } from '@/types';

interface ActionVerificationSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const ActionVerificationSection = ({ action, onUpdate, readOnly = false }: ActionVerificationSectionProps) => {
  const proposedActions = action.analysisData?.proposedActions || [];
  
  const handleActionVerification = (actionId: string, updates: Partial<ProposedActionItem>) => {
    const updatedActions = proposedActions.map(proposedAction =>
      proposedAction.id === actionId 
        ? { 
            ...proposedAction, 
            ...updates,
            verificationDate: new Date().toISOString(),
            verificationBy: 'current-user'
          }
        : proposedAction
    );

    onUpdate({
      analysisData: {
        ...action.analysisData,
        proposedActions: updatedActions
      }
    });
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

  const allActionsVerified = proposedActions.every(action => 
    action.verificationStatus && action.verificationStatus !== 'not-verified'
  );

  const isComplete = allActionsVerified && proposedActions.length > 0;

  return (
    <Card className={`${readOnly ? 'bg-gray-50' : ''} ${isComplete ? 'border-green-200' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Verificació d'Accions
            {isComplete && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {proposedActions.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>No hi ha accions proposades per verificar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposedActions.map((proposedAction) => (
              <ActionVerificationItem
                key={proposedAction.id}
                proposedAction={proposedAction}
                onUpdate={(updates) => handleActionVerification(proposedAction.id, updates)}
                readOnly={readOnly}
              />
            ))}
          </div>
        )}

        {!allActionsVerified && !readOnly && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-800 font-medium">
                Cal verificar totes les accions proposades abans de continuar
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface ActionVerificationItemProps {
  proposedAction: ProposedActionItem;
  onUpdate: (updates: Partial<ProposedActionItem>) => void;
  readOnly?: boolean;
}

const ActionVerificationItem = ({ proposedAction, onUpdate, readOnly }: ActionVerificationItemProps) => {
  const [verificationComments, setVerificationComments] = useState(
    proposedAction.verificationComments || ''
  );

  const handleStatusChange = (status: ProposedActionItem['verificationStatus']) => {
    onUpdate({
      verificationStatus: status,
      verificationComments
    });
  };

  const handleCommentsChange = () => {
    onUpdate({
      verificationComments
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-100 text-green-800';
      case 'partially-implemented': return 'bg-yellow-100 text-yellow-800';
      case 'not-implemented': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'implemented': return 'Implementada';
      case 'partially-implemented': return 'Parcialment implementada';
      case 'not-implemented': return 'No implementada';
      default: return 'Pendent';
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">{proposedAction.description}</h4>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{proposedAction.assignedTo}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(proposedAction.dueDate).toLocaleDateString('ca-ES')}</span>
            </div>
            <Badge 
              variant="outline" 
              className={getStatusColor(proposedAction.verificationStatus)}
            >
              {getStatusText(proposedAction.verificationStatus)}
            </Badge>
          </div>
        </div>

        {!readOnly && (
          <>
            <div>
              <Label className="text-sm font-medium">Estat de verificació</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant={proposedAction.verificationStatus === 'implemented' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('implemented')}
                >
                  Implementada
                </Button>
                <Button
                  type="button"
                  variant={proposedAction.verificationStatus === 'partially-implemented' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('partially-implemented')}
                >
                  Parcial
                </Button>
                <Button
                  type="button"
                  variant={proposedAction.verificationStatus === 'not-implemented' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange('not-implemented')}
                >
                  No implementada
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor={`comments-${proposedAction.id}`} className="text-sm font-medium">
                Comentaris de verificació
              </Label>
              <Textarea
                id={`comments-${proposedAction.id}`}
                value={verificationComments}
                onChange={(e) => setVerificationComments(e.target.value)}
                onBlur={handleCommentsChange}
                placeholder="Afegeix comentaris sobre l'estat de la implementació..."
                rows={2}
                className="mt-1"
              />
            </div>
          </>
        )}

        {readOnly && proposedAction.verificationComments && (
          <div>
            <Label className="text-sm font-medium">Comentaris de verificació</Label>
            <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-50 rounded">
              {proposedAction.verificationComments}
            </p>
          </div>
        )}

        {proposedAction.verificationDate && (
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            Verificat el {new Date(proposedAction.verificationDate).toLocaleString('ca-ES')}
            {proposedAction.verificationBy && (
              <>
                <User className="w-3 h-3 ml-2 mr-1" />
                per {proposedAction.verificationBy}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActionVerificationSection;
