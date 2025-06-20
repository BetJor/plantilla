
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CorrectiveAction } from '@/types';
import { useWorkflow } from '@/hooks/useWorkflow';
import { usePermissions } from '@/hooks/usePermissions';

interface ResponsibleAssignmentProps {
  actionType: string;
  currentStatus: CorrectiveAction['status'];
  responsableAnalisis?: string;
  responsableImplantacion?: string;
  responsableCierre?: string;
  fechaLimiteAnalisis?: string;
  fechaLimiteImplantacion?: string;
  fechaLimiteCierre?: string;
  onResponsableChange: (field: string, value: string) => void;
  onDateChange: (field: string, value: string) => void;
  user: any; // En una implementació real vindria del context
}

const ResponsibleAssignment = ({
  actionType,
  currentStatus,
  responsableAnalisis,
  responsableImplantacion,
  responsableCierre,
  fechaLimiteAnalisis,
  fechaLimiteImplantacion,
  fechaLimiteCierre,
  onResponsableChange,
  onDateChange,
  user = { specificRoles: ['direccio-qualitat'] } // Mock user per testing
}: ResponsibleAssignmentProps) => {
  const { getResponsibleOptions } = useWorkflow({ user });
  const { canCreateActionType } = usePermissions({ user });

  const responsableOptions = getResponsibleOptions(actionType, 'analisis');

  const shouldShowField = (field: 'analisis' | 'implantacion' | 'cierre') => {
    switch (field) {
      case 'analisis':
        return ['Borrador', 'Pendiente de Análisis'].includes(currentStatus);
      case 'implantacion':
        return ['Pendiente de Análisis', 'Pendiente de Comprobación'].includes(currentStatus);
      case 'cierre':
        return ['Pendiente de Comprobación', 'Pendiente de Cierre'].includes(currentStatus);
      default:
        return false;
    }
  };

  const shouldShowDateField = (field: 'analisis' | 'implantacion' | 'cierre') => {
    // No mostrar camps de data per l'estat Borrador
    if (currentStatus === 'Borrador') return false;
    return shouldShowField(field);
  };

  if (!actionType || !canCreateActionType(actionType)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assignació de Responsables</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {shouldShowField('analisis') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsableAnalisis">Responsable d'Anàlisi</Label>
              <Select
                value={responsableAnalisis}
                onValueChange={(value) => onResponsableChange('responsableAnalisis', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona responsable" />
                </SelectTrigger>
                <SelectContent>
                  {responsableOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {shouldShowDateField('analisis') && (
              <div>
                <Label htmlFor="fechaLimiteAnalisis">Data Límit Anàlisi</Label>
                <Input
                  id="fechaLimiteAnalisis"
                  type="date"
                  value={fechaLimiteAnalisis}
                  onChange={(e) => onDateChange('fechaLimiteAnalisis', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}

        {shouldShowField('implantacion') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsableImplantacion">Responsable d'Implantació</Label>
              <Select
                value={responsableImplantacion}
                onValueChange={(value) => onResponsableChange('responsableImplantacion', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona responsable" />
                </SelectTrigger>
                <SelectContent>
                  {responsableOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {shouldShowDateField('implantacion') && (
              <div>
                <Label htmlFor="fechaLimiteImplantacion">Data Límit Implantació</Label>
                <Input
                  id="fechaLimiteImplantacion"
                  type="date"
                  value={fechaLimiteImplantacion}
                  onChange={(e) => onDateChange('fechaLimiteImplantacion', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}

        {shouldShowField('cierre') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsableCierre">Responsable de Tancament</Label>
              <Select
                value={responsableCierre}
                onValueChange={(value) => onResponsableChange('responsableCierre', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecciona responsable" />
                </SelectTrigger>
                <SelectContent>
                  {responsableOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {shouldShowDateField('cierre') && (
              <div>
                <Label htmlFor="fechaLimiteCierre">Data Límit Tancament</Label>
                <Input
                  id="fechaLimiteCierre"
                  type="date"
                  value={fechaLimiteCierre}
                  onChange={(e) => onDateChange('fechaLimiteCierre', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponsibleAssignment;
