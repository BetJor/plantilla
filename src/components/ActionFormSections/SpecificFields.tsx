
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useWorkflow } from '@/hooks/useWorkflow';

interface SpecificFieldsProps {
  actionType: string;
  centre: string;
  department: string;
  origin?: string;
  areasImplicadas?: string[];
  areasHospital?: string[];
  onFieldChange: (field: string, value: any) => void;
  user: any;
  isDraft?: boolean;
}

const SpecificFields = ({
  actionType,
  centre,
  department,
  origin,
  areasImplicadas = [],
  areasHospital = [],
  onFieldChange,
  user = { specificRoles: ['direccio-qualitat'] },
  isDraft = true
}: SpecificFieldsProps) => {
  const { getRequiredFields, getAvailableCentres } = useWorkflow({ user });
  const requiredFields = getRequiredFields(actionType);
  const availableCentres = getAvailableCentres();

  const hospitalAreas = [
    'Quiròfans', 'Reanimació', 'Esterilització', 'UCI', 'Urgències',
    'Consultes Externes', 'Hospitalització', 'Laboratori', 'Radiologia',
    'Farmàcia', 'Manteniment', 'Neteja', 'Cuina'
  ];

  const functionalAreas = [
    'Atenció al Pacient', 'Sistemes d\'Informació', 'Recursos Humans',
    'Gestió Econòmica', 'Qualitat', 'Seguretat', 'Manteniment',
    'Gestió Medioambiental', 'Formació', 'Comunicació'
  ];

  const originOptions = {
    'sau': ['usuario-interno', 'usuario-externo'],
    'ac-qualitat-total': ['Auditoria', 'Seguimiento Indicadores/objetivos', 'Revisión del sistema', 'Incidencias', 'Otros'],
    'acm-h': ['Auditoria', 'Incidencias', 'Revisión del sistema'],
    'acm-isl': ['Auditoria', 'Incidencias', 'Revisión del sistema'],
    'acm-ot': ['Auditoria', 'Incidencias', 'Revisión del sistema'],
    'amsgp': ['auditoria-interna', 'auditoria-externa', 'incidencias', 'verificaciones'],
    'acsgsi': ['Auditoria', 'Incidencias'],
    'acpsi': ['Auditoria', 'Incidencias']
  };

  const handleAreaToggle = (area: string, type: 'functional' | 'hospital') => {
    const currentAreas = type === 'functional' ? areasImplicadas : areasHospital;
    const newAreas = currentAreas.includes(area)
      ? currentAreas.filter(a => a !== area)
      : [...currentAreas, area];
    
    onFieldChange(type === 'functional' ? 'areasImplicadas' : 'areasHospital', newAreas);
  };

  if (!actionType) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Camps Específics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="centre">Centre</Label>
            <Select value={centre} onValueChange={(value) => onFieldChange('centre', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona centre" />
              </SelectTrigger>
              <SelectContent>
                {availableCentres.map((center) => (
                  <SelectItem key={center} value={center}>
                    {center}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isDraft && (
            <div>
              <Label htmlFor="department">Departament</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => onFieldChange('department', e.target.value)}
                className="mt-1"
              />
            </div>
          )}
        </div>

        {originOptions[actionType as keyof typeof originOptions] && (
          <div>
            <Label htmlFor="origin">Origen</Label>
            <Select value={origin} onValueChange={(value) => onFieldChange('origen', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona origen" />
              </SelectTrigger>
              <SelectContent>
                {originOptions[actionType as keyof typeof originOptions]?.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label>Àrees Funcionals Implicades</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {functionalAreas.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={`functional-${area}`}
                  checked={areasImplicadas.includes(area)}
                  onCheckedChange={() => handleAreaToggle(area, 'functional')}
                />
                <Label htmlFor={`functional-${area}`} className="text-sm">
                  {area}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {requiredFields.showAreasHospital && (
          <div>
            <Label>Àrees Hospital Implicades</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {hospitalAreas.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`hospital-${area}`}
                    checked={areasHospital.includes(area)}
                    onCheckedChange={() => handleAreaToggle(area, 'hospital')}
                  />
                  <Label htmlFor={`hospital-${area}`} className="text-sm">
                    {area}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {requiredFields.showSpecificCenter && actionType === 'acm-isl' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Aquest tipus d'acció només està disponible per al centre 4104 Sevilla-Cartuja.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpecificFields;
