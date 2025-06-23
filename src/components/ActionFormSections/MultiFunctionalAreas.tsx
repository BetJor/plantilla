
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MultiFunctionalAreasProps {
  selectedAreas: string[];
  onUpdate: (areas: string[]) => void;
  readOnly?: boolean;
}

const MultiFunctionalAreas = ({ selectedAreas, onUpdate, readOnly = false }: MultiFunctionalAreasProps) => {
  const [selectedValue, setSelectedValue] = useState('');

  const predefinedAreas = [
    'Direcció Gestió de Qualitat i Medi Ambient',
    'Direcció Compres',
    'Direcció del Centre',
    'Direcció Assistencial',
    'Direcció Mèdica',
    'Direcció d\'Infermeria',
    'Departament de Qualitat',
    'Departament de Prevenció',
    'Recursos Humans'
  ];

  const handleAddArea = (area: string) => {
    if (area && !selectedAreas.includes(area)) {
      onUpdate([...selectedAreas, area]);
      setSelectedValue('');
    }
  };

  const handleRemoveArea = (area: string) => {
    onUpdate(selectedAreas.filter(a => a !== area));
  };

  const availableAreas = predefinedAreas.filter(area => !selectedAreas.includes(area));

  return (
    <div className="space-y-3">
      <Label>Àrees Funcionals Implicades</Label>
      
      {selectedAreas.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedAreas.map((area, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {area}
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveArea(area)}
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {!readOnly && availableAreas.length > 0 && (
        <div className="flex gap-2">
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Seleccionar àrees..." />
            </SelectTrigger>
            <SelectContent>
              {availableAreas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAddArea(selectedValue)}
            disabled={!selectedValue}
          >
            Afegir
          </Button>
        </div>
      )}
    </div>
  );
};

export default MultiFunctionalAreas;
