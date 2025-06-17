
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface AnalysisSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
}

const AnalysisSection = ({ action, onUpdate }: AnalysisSectionProps) => {
  const [rootCauses, setRootCauses] = React.useState(action.analysisData?.rootCauses || '');
  const [proposedAction, setProposedAction] = React.useState(action.analysisData?.proposedAction || '');

  const handleSave = () => {
    onUpdate({
      analysisData: {
        ...action.analysisData,
        rootCauses,
        proposedAction,
        analysisDate: new Date().toISOString(),
        analysisBy: 'current-user'
      }
    });
  };

  const isFormValid = rootCauses.trim() && proposedAction.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Anàlisi de les Causes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="rootCauses">Anàlisi de les causes arrel</Label>
          <Textarea
            id="rootCauses"
            value={rootCauses}
            onChange={(e) => setRootCauses(e.target.value)}
            placeholder="Identificar i analitzar les causes que han originat la situació..."
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor="proposedAction">Acció proposada</Label>
          <Textarea
            id="proposedAction"
            value={proposedAction}
            onChange={(e) => setProposedAction(e.target.value)}
            placeholder="Descriure l'acció correctiva proposada per solucionar el problema..."
            rows={4}
          />
        </div>
        <Button onClick={handleSave} disabled={!isFormValid}>
          Guardar Anàlisi
        </Button>
      </CardContent>
    </Card>
  );
};

export default AnalysisSection;
