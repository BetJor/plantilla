
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface ClosureSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
}

const ClosureSection = ({ action, onUpdate }: ClosureSectionProps) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <XCircle className="w-5 h-5 mr-2" />
          Tancament de l'Acció
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
          />
        </div>
        <Button onClick={handleSave} disabled={!isFormValid}>
          Guardar Tancament
        </Button>
      </CardContent>
    </Card>
  );
};

export default ClosureSection;
