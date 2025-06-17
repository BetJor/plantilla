
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ACTION_TYPES, ActionType, ActionCategory } from '@/types/categories';

interface CategorySelectorsProps {
  selectedType: string;
  selectedCategory: string;
  selectedSubcategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  readOnly?: boolean;
  currentStatus?: string;
}

const CategorySelectors = ({
  selectedType,
  selectedCategory,
  selectedSubcategory,
  onTypeChange,
  onCategoryChange,
  onSubcategoryChange,
  readOnly = false,
  currentStatus = 'Borrador'
}: CategorySelectorsProps) => {
  const selectedTypeData = ACTION_TYPES.find(type => type.code === selectedType);
  const selectedCategoryData = selectedTypeData?.categories.find(cat => cat.code === selectedCategory);

  // Determine if selectors should be enabled based on status
  const canEdit = !readOnly && ['Borrador', 'Pendiente de Análisis'].includes(currentStatus);

  if (readOnly) {
    const typeData = ACTION_TYPES.find(t => t.code === selectedType);
    const categoryData = typeData?.categories.find(c => c.code === selectedCategory);
    const subcategoryData = categoryData?.subcategories.find(s => s.code === selectedSubcategory);

    return (
      <div className="space-y-4">
        <div>
          <Label className="text-gray-700 font-medium">Tipus d'Acció</Label>
          <div className="mt-1 p-2 bg-gray-100 border border-gray-300 rounded-md text-sm">
            {typeData?.name || selectedType}
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
          Tipus d'Acció
        </Label>
        <Select value={selectedType} onValueChange={onTypeChange} disabled={!canEdit}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecciona el tipus d'acció" />
          </SelectTrigger>
          <SelectContent className="z-[70]">
            {ACTION_TYPES.map((type) => (
              <SelectItem key={type.code} value={type.code}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                  {category.code} - {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : selectedType === '' ? (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
          ℹ️ Primer selecciona un tipus d'acció per veure les categories disponibles
        </div>
      ) : (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          ⚠️ No s'ha trobat el tipus seleccionat: "{selectedType}"
        </div>
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
          <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
            ✅ Aquesta categoria no té subcategories. Pots continuar amb el formulari.
          </div>
        )
      )}
    </div>
  );
};

export default CategorySelectors;
