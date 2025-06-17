
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText, Clock, User } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface DescriptionSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const DescriptionSection = ({ action, onUpdate, readOnly = false }: DescriptionSectionProps) => {
  const [description, setDescription] = React.useState(action.description);

  const handleSave = () => {
    onUpdate({ description });
  };

  const isComplete = action.description.trim().length > 0;
  const hasChanges = description !== action.description;

  return (
    <Card className={`${readOnly ? 'bg-gray-50' : ''} ${isComplete ? 'border-green-200' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Descripció de l'Acció
            {isComplete && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>}
          </div>
          {readOnly && action.createdAt && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(action.createdAt).toLocaleDateString('ca-ES')}
              <User className="w-4 h-4 ml-2 mr-1" />
              {action.createdBy}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="description">Descripció detallada</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descriure la situació que ha motivat aquesta acció correctiva..."
            rows={6}
            disabled={readOnly}
            className={readOnly ? 'bg-gray-100' : ''}
          />
        </div>
        {!readOnly && (
          <Button onClick={handleSave} disabled={!hasChanges}>
            Guardar Descripció
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DescriptionSection;
