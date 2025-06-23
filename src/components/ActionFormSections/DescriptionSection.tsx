
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Clock, User } from 'lucide-react';
import { CorrectiveAction } from '@/types';
import CategorySelectors from './CategorySelectors';
import MultiFunctionalAreas from './MultiFunctionalAreas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DescriptionSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const DescriptionSection = ({ action, onUpdate, readOnly = false }: DescriptionSectionProps) => {
  const [origen, setOrigen] = React.useState<CorrectiveAction['origen']>(action.origen);
  const [description, setDescription] = React.useState(action.description);
  const [selectedType, setSelectedType] = React.useState(action.type || '');
  const [selectedCategory, setSelectedCategory] = React.useState(action.category || '');
  const [selectedSubcategory, setSelectedSubcategory] = React.useState(action.subCategory || '');
  const [auditDate, setAuditDate] = React.useState(action.auditDate || '');
  const [sector, setSector] = React.useState(action.sector || '');
  const [selectedAreas, setSelectedAreas] = React.useState<string[]>(action.areasImplicadas || []);
  const [responsableAnalisis, setResponsableAnalisis] = React.useState(action.responsableAnalisis || '');

  // Carregar dades des de l'acció quan canviï
  React.useEffect(() => {
    console.log('DescriptionSection useEffect: action changed', { 
      actionId: action.id, 
      actionOrigen: action.origen 
    });
    setOrigen(action.origen);
    setDescription(action.description);
    setSelectedType(action.type || '');
    setSelectedCategory(action.category || '');
    setSelectedSubcategory(action.subCategory || '');
    setAuditDate(action.auditDate || '');
    setSector(action.sector || '');
    setSelectedAreas(action.areasImplicadas || []);
    setResponsableAnalisis(action.responsableAnalisis || '');
  }, [action]);

  const origenOptions = [
    'Auditoria',
    'Incidencias',
    'Seguimiento Indicadores/objetivos',
    'Revisión del sistema',
    'Otros'
  ];

  const handleSave = () => {
    console.log('DescriptionSection handleSave: saving with origen:', origen);
    onUpdate({ 
      origen,
      description,
      type: selectedType,
      category: selectedCategory,
      subCategory: selectedSubcategory,
      auditDate,
      sector,
      areasImplicadas: selectedAreas,
      responsableAnalisis
    });
  };

  const isComplete = action.description.trim().length > 0 && 
                    action.type && 
                    (action.category || selectedCategory) && 
                    action.subCategory.trim().length > 0 &&
                    action.responsableAnalisis;
  
  const hasChanges = origen !== action.origen ||
                    description !== action.description ||
                    selectedType !== action.type ||
                    selectedCategory !== (action.category || '') ||
                    selectedSubcategory !== action.subCategory ||
                    auditDate !== (action.auditDate || '') ||
                    sector !== (action.sector || '') ||
                    JSON.stringify(selectedAreas) !== JSON.stringify(action.areasImplicadas || []) ||
                    responsableAnalisis !== (action.responsableAnalisis || '');

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
          <Label htmlFor="origen">Origen</Label>
          <Select 
            value={origen || ''} 
            onValueChange={(value) => {
              console.log('DescriptionSection: origen changed to:', value);
              setOrigen(value as CorrectiveAction['origen']);
            }} 
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar origen..." />
            </SelectTrigger>
            <SelectContent>
              {origenOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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

        <MultiFunctionalAreas
          selectedAreas={selectedAreas}
          onUpdate={setSelectedAreas}
          readOnly={readOnly}
        />

        <div>
          <Label htmlFor="responsableAnalisis">Responsable d'anàlisi</Label>
          <Input
            id="responsableAnalisis"
            value={responsableAnalisis}
            onChange={(e) => setResponsableAnalisis(e.target.value)}
            placeholder="Nom del responsable de l'anàlisi..."
            disabled={readOnly}
            className={readOnly ? 'bg-gray-100' : ''}
          />
        </div>

        {!readOnly && (
          <Button onClick={handleSave} disabled={!hasChanges}>
            Guardar
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DescriptionSection;
