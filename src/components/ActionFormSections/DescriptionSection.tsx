
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface DescriptionSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
}

const DescriptionSection = ({ action, onUpdate }: DescriptionSectionProps) => {
  const [description, setDescription] = React.useState(action.description);

  const handleSave = () => {
    onUpdate({ description });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Descripció de l'Acció
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
          />
        </div>
        <Button onClick={handleSave} disabled={description === action.description}>
          Guardar Descripció
        </Button>
      </CardContent>
    </Card>
  );
};

export default DescriptionSection;
