
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface VerificationSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
}

const VerificationSection = ({ action, onUpdate }: VerificationSectionProps) => {
  const [implementationCheck, setImplementationCheck] = React.useState(action.verificationData?.implementationCheck || '');

  const handleSave = () => {
    onUpdate({
      verificationData: {
        ...action.verificationData,
        implementationCheck,
        verificationDate: new Date().toISOString(),
        verificationBy: 'current-user',
        evidenceAttachments: action.verificationData?.evidenceAttachments || []
      }
    });
  };

  const isFormValid = implementationCheck.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Comprovació de la Implantació
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="implementationCheck">Verificació de la implantació</Label>
          <Textarea
            id="implementationCheck"
            value={implementationCheck}
            onChange={(e) => setImplementationCheck(e.target.value)}
            placeholder="Descriure com s'ha verificat que l'acció correctiva s'ha implementat correctament..."
            rows={5}
          />
        </div>
        <Button onClick={handleSave} disabled={!isFormValid}>
          Guardar Verificació
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerificationSection;
