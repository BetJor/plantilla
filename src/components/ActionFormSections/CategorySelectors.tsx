
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';
import { ACTION_TYPES, ActionType, ActionCategory } from '@/types/categories';
import { usePermissions } from '@/hooks/usePermissions';
import { User } from '@/types';

interface CategorySelectorsProps {
  selectedType: string;
  selectedCategory: string;
  selectedSubcategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  readOnly?: boolean;
  currentStatus?: string;
  user?: User; // Nou paràmetre per verificar permisos
}

const CategorySelectors = ({
  selectedType,
  selectedCategory,
  selectedSubcategory,
  onTypeChange,
  onCategoryChange,
  onSubcategoryChange,
  readOnly = false,
  currentStatus = 'Borrador',
  user
}: CategorySelectorsProps) => {
  
  // Utilitzar hook de permisos si tenim usuari
  const permissions = user ? usePermissions({ user }) : null;

  const selectedTypeData = ACTION_TYPES.find(type => type.code === selectedType);
  const selectedCategoryData = selectedTypeData?.categories.find(cat => cat.code === selectedCategory);

  // Determine if selectors should be enabled based on status
  const canEdit = !readOnly && ['Borrador', 'Pendiente de Análisis'].includes(currentStatus);

  // Filtrar tipus d'accions segons permisos de l'usuari
  const availableActionTypes = permissions 
    ? permissions.allowedActionTypes 
    : ACTION_TYPES;

  // Mostrar informació sobre restriccions si escau
  const getTypeRestrictionInfo = (actionType: ActionType) => {
    if (actionType.specificCentres && actionType.specificCentres.length > 0) {
      return `Només disponible per: ${actionType.specificCentres.join(', ')}`;
    }
    return null;
  };

  if (readOnly) {
    const typeData = ACTION_TYPES.find(t => t.code === selectedType);
    const categoryData = typeData?.categories.find(c => c.code === selectedCategory);
    const subcategoryData = categoryData?.subcategories.find(s => s.code === selectedSubcategory);

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-gray-700 font-medium">Tipus d'Acció</Label>
          <div className="mt-1 p-3 bg-gray-100 border border-gray-300 rounded-md">
            <div className="font-medium">{typeData?.shortName}</div>
            <div className="text-sm text-gray-600 mt-1">{typeData?.name}</div>
          </div>
        </div>
        {selectedCategory && (
          <div>
            <Label className="text-gray-700 font-medium">Categoria</Label>
            <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded-md text-sm">
              {categoryData?.name || selectedCategory}
            </div>
          </div>
        )}
        {selectedSubcategory && (
          <div>
            <Label className="text-gray-700 font-medium">Subcategoria</Label>
            <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded-md text-sm">
              {subcategoryData?.name || selectedSubcategory}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Type Selector */}
      <div>
        <Label htmlFor="actionType" className="text-gray-700 font-medium">
          Tipus d'Acció Correctiva
        </Label>
        <Select value={selectedType} onValueChange={onTypeChange} disabled={!canEdit}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecciona el tipus d'acció correctiva" />
          </SelectTrigger>
          <SelectContent className="z-[70] max-h-80 overflow-y-auto">
            {availableActionTypes.map((type) => (
              <SelectItem key={type.code} value={type.code}>
                <div className="flex flex-col">
                  <div className="font-medium">{type.shortName}</div>
                  <div className="text-xs text-gray-500 truncate max-w-96">
                    {type.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Mostrar informació del tipus seleccionat */}
        {selectedTypeData && (
          <div className="mt-2">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {selectedTypeData.description}
                {getTypeRestrictionInfo(selectedTypeData) && (
                  <div className="mt-1 text-orange-600">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    {getTypeRestrictionInfo(selectedTypeData)}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>

      {/* Category Selector - Only show if type is selected */}
      {selectedType && selectedTypeData ? (
        <div>
          <Label htmlFor="category" className="text-gray-700 font-medium">
            Categoria
          </Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange} disabled={!canEdit}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecciona la categoria" />
            </SelectTrigger>
            <SelectContent className="z-[70] max-h-60 overflow-y-auto">
              {selectedTypeData.categories.map((category) => (
                <SelectItem key={category.code} value={category.code}>
                  <div className="flex flex-col">
                    <div className="font-medium">{category.code} - {category.name}</div>
                    {category.subcategories.length > 0 && (
                      <div className="text-xs text-gray-500">
                        {category.subcategories.length} subcategories
                      </div>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : selectedType === '' ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Primer selecciona un tipus d'acció correctiva per veure les categories disponibles
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No s'ha trobat el tipus seleccionat: "{selectedType}"
          </AlertDescription>
        </Alert>
      )}

      {/* Subcategory Selector - Only show if category is selected and has subcategories */}
      {selectedCategory && selectedCategoryData && selectedCategoryData.subcategories.length > 0 ? (
        <div>
          <Label htmlFor="subcategory" className="text-gray-700 font-medium">
            Subcategoria
          </Label>
          <Select value={selectedSubcategory} onValueChange={onSubcategoryChange} disabled={!canEdit}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecciona la subcategoria" />
            </SelectTrigger>
            <SelectContent className="z-[70] max-h-60 overflow-y-auto">
              {selectedCategoryData.subcategories.map((subcategory) => (
                <SelectItem key={subcategory.code} value={subcategory.code}>
                  {subcategory.code} - {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        selectedCategory && selectedCategoryData && selectedCategoryData.subcategories.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              ✅ Aquesta categoria no té subcategories. Pots continuar amb el formulari.
            </AlertDescription>
          </Alert>
        )
      )}

      {/* Mostrar informació sobre rols autoritzats */}
      {selectedTypeData && permissions && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Rols autoritzats:</strong> {selectedTypeData.allowedRoles.join(', ')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CategorySelectors;
