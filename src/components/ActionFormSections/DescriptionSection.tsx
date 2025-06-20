
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, User, X } from 'lucide-react';
import { CorrectiveAction } from '@/types';
import CategorySelectors from './CategorySelectors';

interface DescriptionSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const DescriptionSection = ({ action, onUpdate, readOnly = false }: DescriptionSectionProps) => {
  const [description, setDescription] = React.useState(action.description);
  const [selectedType, setSelectedType] = React.useState(action.type || '');
  const [selectedCategory, setSelectedCategory] = React.useState(action.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = React.useState(action.subCategory || '');
  const [auditDate, setAuditDate] = React.useState(action.auditDate || '');
  const [sector, setSector] = React.useState(action.sector || '');
  const [selectedAreas, setSelectedAreas] = React.useState<string[]>(action.areasImplicadas || []);
  const [newArea, setNewArea] = React.useState('');

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

  const handleAddArea = () => {
    if (newArea.trim() && !selectedAreas.includes(newArea.trim())) {
      setSelectedAreas([...selectedAreas, newArea.trim()]);
      setNewArea('');
    }
  };

  const handleRemoveArea = (area: string) => {
    setSelectedAreas(selectedAreas.filter(a => a !== area));
  };

  const handleSave = () => {
    onUpdate({ 
      description,
      type: selectedType,
      category: selectedCategory,
      subCategory: selectedSubcategory,
      auditDate,
      sector,
      areasImplicadas: selectedAreas
    });
  };

  const isComplete = action.description.trim().length > 0 && 
                    action.type && 
                    (action.category || selectedCategory) && 
                    action.subCategory.trim().length > 0;
  
  const hasChanges = description !== action.description ||
                    selectedType !== action.type ||
                    selectedCategory !== (action.category || '') ||
                    selectedSubcategory !== action.subCategory ||
                    auditDate !== (action.auditDate || '') ||
                    sector !== (action.sector || '') ||
                    JSON.stringify(selectedAreas) !== JSON.stringify(action.areasImplicadas || []);

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
        <CategorySelectors
          selectedType={selectedType}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          onTypeChange={setSelectedType}
          onCategoryChange={setSelectedCategory}
          onSubcategoryChange={setSelectedSubcategory}
          readOnly={readOnly}
          currentStatus={action.status}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="auditDate">Data d'auditoria/origen</Label>
            <Input
              id="auditDate"
              type="date"
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
              disabled={readOnly}
              className={readOnly ? 'bg-gray-100' : ''}
            />
          </div>
          <div>
            <Label htmlFor="sector">Sector/Àrea</Label>
            <Input
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              placeholder="Ex: KA, Qualitat, Assistencial..."
              disabled={readOnly}
              className={readOnly ? 'bg-gray-100' : ''}
            />
          </div>
        </div>

        <div>
          <Label>Àrees Funcionals Implicades</Label>
          <div className="space-y-3">
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
            
            {!readOnly && (
              <div className="flex gap-2">
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar àrea predefinida...</option>
                  {predefinedAreas
                    .filter(area => !selectedAreas.includes(area))
                    .map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                </select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddArea}
                  disabled={!newArea}
                >
                  Afegir
                </Button>
              </div>
            )}
            
            {!readOnly && (
              <div className="flex gap-2">
                <Input
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  placeholder="O escriu una nova àrea..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddArea()}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddArea}
                  disabled={!newArea.trim()}
                >
                  Afegir
                </Button>
              </div>
            )}
          </div>
        </div>
        
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
