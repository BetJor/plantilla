
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

  // Actualitzar immediatament quan canvien els valors
  React.useEffect(() => {
    console.log('ClosureSection: Actualitzant dades automàticament', {
      closureNotes,
      effectivenessEvaluation,
      isConforme,
      tipoCierre: isConforme ? 'conforme' : 'no-conforme'
    });
    
    if (closureNotes || effectivenessEvaluation) {
      onUpdate({
        closureData: {
          ...action.closureData,
          closureNotes,
          effectivenessEvaluation,
          isConforme
        },
        tipoCierre: isConforme ? 'conforme' : 'no-conforme'
      });
    }
  }, [closureNotes, effectivenessEvaluation, isConforme]);

  const handleSave = () => {
    console.log('ClosureSection: Guardant i signant', {
      closureNotes,
      effectivenessEvaluation,
      isConforme,
      tipoCierre: isConforme ? 'conforme' : 'no-conforme'
    });
    
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
    console.log('ClosureSection: Guardant només sense signar', {
      closureNotes,
      effectivenessEvaluation,
      isConforme,
      tipoCierre: isConforme ? 'conforme' : 'no-conforme'
    });
    
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

  const handleClosureNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setClosureNotes(e.target.value);
    if (onChangesDetected) onChangesDetected();
  };

  const handleEffectivenessChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEffectivenessEvaluation(e.target.value);
    if (onChangesDetected) onChangesDetected();
  };

  const handleConformeChange = (newIsConforme: boolean) => {
    setIsConforme(newIsConforme);
    if (onChangesDetected) onChangesDetected();
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

  // Debug log per verificar l'estat actual
  React.useEffect(() => {
    console.log('ClosureSection: Estat actual', {
      actionTipoCierre: action.tipoCierre,
      closureNotesLength: closureNotes.length,
      effectivenessLength: effectivenessEvaluation.length,
      isConforme,
      isFormValid,
      hasChanges
    });
  }, [action.tipoCierre, closureNotes, effectivenessEvaluation, isConforme, isFormValid, hasChanges]);

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
                onChange={() => handleConformeChange(true)}
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
                onChange={() => handleConformeChange(false)}
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
            onChange={handleClosureNotesChange}
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
            onChange={handleEffectivenessChange}
            placeholder="Avaluar si l'acció correctiva ha estat eficaç per solucionar el problema..."
            rows={4}
            disabled={readOnly}
            className={readOnly ? 'bg-gray-100' : ''}
          />
        </div>

        {/* Debug info - només visible en desenvolupament */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
            <strong>Debug Info:</strong>
            <div>tipoCierre: {action.tipoCierre || 'undefined'}</div>
            <div>closureNotes: {closureNotes.length} chars</div>
            <div>effectiveness: {effectivenessEvaluation.length} chars</div>
            <div>isFormValid: {isFormValid.toString()}</div>
          </div>
        )}

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
