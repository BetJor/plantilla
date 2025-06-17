
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, User } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface VerificationSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const VerificationSection = ({ action, onUpdate, readOnly = false }: VerificationSectionProps) => {
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
  const isComplete = action.verificationData?.implementationCheck;
  const hasChanges = implementationCheck !== (action.verificationData?.implementationCheck || '');

  return (
    <Card className={`${readOnly ? 'bg-gray-50' : ''} ${isComplete ? 'border-green-200' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Comprovació de la Implantació
            {isComplete && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>}
          </div>
          {readOnly && action.verificationData?.verificationDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(action.verificationData.verificationDate).toLocaleDateString('ca-ES')}
              <User className="w-4 h-4 ml-2 mr-1" />
              {action.verificationData.verificationBy}
            </div>
          )}
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
            disabled={readOnly}
            className={readOnly ? 'bg-gray-100' : ''}
          />
        </div>
        {!readOnly && (
          <Button onClick={handleSave} disabled={!isFormValid || !hasChanges}>
            Guardar Verificació
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationSection;
