import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, Clock, User, CheckCircle, AlertTriangle } from 'lucide-react';
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
  const [nonConformanceJustification, setNonConformanceJustification] = React.useState('');

  // Actualitzar immediatament quan canvien els valors
  React.useEffect(() => {
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
    if (!newIsConforme) {
      // Resetear justificació quan es canvia a no conforme
      setNonConformanceJustification('');
    }
    if (onChangesDetected) onChangesDetected();
  };

  const handleJustificationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNonConformanceJustification(e.target.value);
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

  const isFormValid = closureNotes.trim() && 
                     effectivenessEvaluation.trim() && 
                     (isConforme || nonConformanceJustification.trim());
  const isComplete = action.closureData?.closureNotes && action.closureData?.effectivenessEvaluation;
  const hasChanges = closureNotes !== (action.closureData?.closureNotes || '') || 
                     effectivenessEvaluation !== (action.closureData?.effectivenessEvaluation || '') ||
                     isConforme !== (action.closureData?.isConforme ?? true);

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
                <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                <span>No Conforme</span>
              </div>
            </label>
          </div>
          
          {/* Alerta per tancament no conforme */}
          {!isConforme && !readOnly && (
            <Alert className="mt-3 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Atenció:</strong> El tancament com a NO CONFORME generarà automàticament una nova acció BIS (Business Improvement System) 
                que requerirà un nou anàlisi i implementació.
              </AlertDescription>
            </Alert>
          )}
          
          {readOnly && action.closureData?.isConforme !== undefined && (
            <Badge 
              variant={action.closureData.isConforme ? 'default' : 'destructive'} 
              className="mt-2"
            >
              {action.closureData.isConforme ? 'Conforme' : 'No Conforme'}
            </Badge>
          )}
        </div>

        {/* Camp de justificació per tancament no conforme */}
        {!isConforme && !readOnly && (
          <div>
            <Label htmlFor="nonConformanceJustification" className="text-red-700 font-medium">
              Justificació del tancament NO CONFORME *
            </Label>
            <Textarea
              id="nonConformanceJustification"
              value={nonConformanceJustification}
              onChange={handleJustificationChange}
              placeholder="Explica detalladament per què aquesta acció no es pot considerar conforme i quines circumstàncies ho justifiquen..."
              rows={4}
              className="mt-1 border-red-200 focus:border-red-400"
              required
            />
            <p className="text-sm text-red-600 mt-1">
              Aquest camp és obligatori per justificar el tancament no conforme
            </p>
          </div>
        )}

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

        {/* Mostrar justificació en mode només lectura */}
        {readOnly && !action.closureData?.isConforme && nonConformanceJustification && (
          <div>
            <Label className="text-red-700 font-medium">Justificació del tancament NO CONFORME</Label>
            <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{nonConformanceJustification}</p>
            </div>
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
