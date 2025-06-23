import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { XCircle, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface ClosureSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
  saveRef?: React.MutableRefObject<(() => void) | null>;
  saveOnlyRef?: React.MutableRefObject<(() => void) | null>;
  onChangesDetected?: () => void;
}

const ClosureSection = ({ 
  action, 
  onUpdate, 
  readOnly = false,
  saveRef,
  saveOnlyRef,
  onChangesDetected
}: ClosureSectionProps) => {
  const [closureNotes, setClosureNotes] = React.useState(action.closureData?.closureNotes || '');
  const [effectivenessEvaluation, setEffectivenessEvaluation] = React.useState(action.closureData?.effectivenessEvaluation || '');
  const [isConforme, setIsConforme] = React.useState(action.closureData?.isConforme ?? true);

  const handleSave = () => {
    onUpdate({
      closureData: {
        ...action.closureData,
        closureNotes,
        effectivenessEvaluation,
        isConforme,
        closureDate: new Date().toISOString(),
        closureBy: 'current-user',
        signedBy: 'current-user',
        signedAt: new Date().toISOString()
      },
      tipoCierre: isConforme ? 'conforme' : 'no-conforme'
    });
  };

  const handleSaveOnly = () => {
    // Només guardar sense signatura ni canvi d'estat
    onUpdate({
      closureData: {
        ...action.closureData,
        closureNotes,
        effectivenessEvaluation,
        isConforme
      },
      tipoCierre: isConforme ? 'conforme' : 'no-conforme'
    });
  };

  // Expose save functions via refs
  React.useEffect(() => {
    if (saveRef) {
      saveRef.current = handleSave;
    }
    if (saveOnlyRef) {
      saveOnlyRef.current = handleSaveOnly;
    }
  }, [saveRef, saveOnlyRef, closureNotes, effectivenessEvaluation, isConforme]);

  const isFormValid = closureNotes.trim() && effectivenessEvaluation.trim();
  const isComplete = action.closureData?.closureNotes && action.closureData?.effectivenessEvaluation;
  const hasChanges = closureNotes !== (action.closureData?.closureNotes || '') || 
                     effectivenessEvaluation !== (action.closureData?.effectivenessEvaluation || '') ||
                     isConforme !== (action.closureData?.isConforme ?? true);

  // Notify parent when changes are detected
  React.useEffect(() => {
    if (hasChanges && onChangesDetected) {
      onChangesDetected();
    }
  }, [hasChanges, onChangesDetected]);

  return (
    <Card className={`${readOnly ? 'bg-gray-50' : ''} ${isComplete ? 'border-green-200' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            Tancament de l'Acció
            {isComplete && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>}
          </div>
          {readOnly && action.closureData?.closureDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(action.closureData.closureDate).toLocaleDateString('ca-ES')}
              <User className="w-4 h-4 ml-2 mr-1" />
              {action.closureData.closureBy}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Tipus de tancament</Label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={isConforme}
                onChange={() => setIsConforme(true)}
                disabled={readOnly}
                className="form-radio"
              />
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                <span>Conforme</span>
              </div>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={!isConforme}
                onChange={() => setIsConforme(false)}
                disabled={readOnly}
                className="form-radio"
              />
              <div className="flex items-center">
                <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                <span>No Conforme</span>
              </div>
            </label>
          </div>
          
          {readOnly && action.closureData?.isConforme !== undefined && (
            <Badge 
              variant={action.closureData.isConforme ? 'default' : 'destructive'} 
              className="mt-2"
            >
              {action.closureData.isConforme ? 'Conforme' : 'No Conforme'}
            </Badge>
          )}
        </div>

        <div>
          <Label htmlFor="closureNotes">Notes de tancament</Label>
          <Textarea
            id="closureNotes"
            value={closureNotes}
            onChange={(e) => setClosureNotes(e.target.value)}
            placeholder="Resum final de l'acció correctiva realitzada..."
            rows={4}
            disabled={readOnly}
            className={readOnly ? 'bg-gray-100' : ''}
          />
        </div>
        <div>
          <Label htmlFor="effectivenessEvaluation">Avaluació de l'eficàcia</Label>
          <Textarea
            id="effectivenessEvaluation"
            value={effectivenessEvaluation}
            onChange={(e) => setEffectivenessEvaluation(e.target.value)}
            placeholder="Avaluar si l'acció correctiva ha estat eficaç per solucionar el problema..."
            rows={4}
            disabled={readOnly}
            className={readOnly ? 'bg-gray-100' : ''}
          />
        </div>

        {readOnly && action.closureData?.signedBy && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-blue-700">
              <User className="w-4 h-4 mr-1" />
              <span className="font-medium">Signat per:</span>
              <span className="ml-1">{action.closureData.signedBy}</span>
              {action.closureData.signedAt && (
                <>
                  <Clock className="w-4 h-4 ml-3 mr-1" />
                  <span>{new Date(action.closureData.signedAt).toLocaleString('ca-ES')}</span>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClosureSection;
