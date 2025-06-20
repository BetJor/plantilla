
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, User, Paperclip, Upload } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface VerificationSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const VerificationSection = ({ action, onUpdate, readOnly = false }: VerificationSectionProps) => {
  const [implementationCheck, setImplementationCheck] = React.useState(action.verificationData?.implementationCheck || '');
  const [evidenceAttachments, setEvidenceAttachments] = React.useState<string[]>(action.verificationData?.evidenceAttachments || []);

  const handleSave = () => {
    onUpdate({
      verificationData: {
        ...action.verificationData,
        implementationCheck,
        evidenceAttachments,
        verificationDate: new Date().toISOString(),
        verificationBy: 'current-user',
        signedBy: 'current-user',
        signedAt: new Date().toISOString()
      }
    });
  };

  const handleAddEvidence = () => {
    // Simulem l'afegir un fitxer d'evidència
    const fileName = `Evidencia_${Date.now()}.pdf`;
    setEvidenceAttachments([...evidenceAttachments, fileName]);
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceAttachments(evidenceAttachments.filter((_, i) => i !== index));
  };

  const isFormValid = implementationCheck.trim();
  const isComplete = action.verificationData?.implementationCheck;
  const hasChanges = implementationCheck !== (action.verificationData?.implementationCheck || '') ||
                     JSON.stringify(evidenceAttachments) !== JSON.stringify(action.verificationData?.evidenceAttachments || []);

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

        <div>
          <Label>Evidències de verificació</Label>
          <div className="space-y-3">
            {evidenceAttachments.length > 0 && (
              <div className="space-y-2">
                {evidenceAttachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{attachment}</span>
                    </div>
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEvidence(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                onClick={handleAddEvidence}
                className="w-full border-dashed border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Afegir evidència
              </Button>
            )}
          </div>
        </div>

        {readOnly && action.verificationData?.signedBy && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center text-sm text-blue-700">
              <User className="w-4 h-4 mr-1" />
              <span className="font-medium">Signat per:</span>
              <span className="ml-1">{action.verificationData.signedBy}</span>
              {action.verificationData.signedAt && (
                <>
                  <Clock className="w-4 h-4 ml-3 mr-1" />
                  <span>{new Date(action.verificationData.signedAt).toLocaleString('ca-ES')}</span>
                </>
              )}
            </div>
          </div>
        )}

        {!readOnly && (
          <Button onClick={handleSave} disabled={!isFormValid || !hasChanges}>
            Guardar i Signar Verificació
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default VerificationSection;
