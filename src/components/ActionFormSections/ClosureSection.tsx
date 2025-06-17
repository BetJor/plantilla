
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { XCircle, Clock, User } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface ClosureSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const ClosureSection = ({ action, onUpdate, readOnly = false }: ClosureSectionProps) => {
  const [closureNotes, setClosureNotes] = React.useState(action.closureData?.closureNotes || '');
  const [effectivenessEvaluation, setEffectivenessEvaluation] = React.useState(action.closureData?.effectivenessEvaluation || '');

  const handleSave = () => {
    onUpdate({
      closureData: {
        ...action.closureData,
        closureNotes,
        effectivenessEvaluation,
        closureDate: new Date().toISOString(),
        closureBy: 'current-user'
      }
    });
  };

  const isFormValid = closureNotes.trim() && effectivenessEvaluation.trim();
  const isComplete = action.closureData?.closureNotes && action.closureData?.effectivenessEvaluation;
  const hasChanges = closureNotes !== (action.closureData?.closureNotes || '') || 
                     effectivenessEvaluation !== (action.closureData?.effectivenessEvaluation || '');

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
        {!readOnly && (
          <Button onClick={handleSave} disabled={!isFormValid || !hasChanges}>
            Guardar Tancament
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ClosureSection;
