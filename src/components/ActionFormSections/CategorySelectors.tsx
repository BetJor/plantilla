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
  // Debug logging for props received
  console.log('📥 CategorySelectors props received:', {
    selectedType,
    selectedCategory,
    selectedSubcategory,
    currentStatus,
    readOnly
  });

  const selectedTypeData = ACTION_TYPES.find(type => type.code === selectedType);
  const selectedCategoryData = selectedTypeData?.categories.find(cat => cat.code === selectedCategory);

  // Determine if selectors should be enabled based on status
  const canEdit = !readOnly && ['Borrador', 'Pendiente de Análisis'].includes(currentStatus);

  const handleTypeChange = (typeCode: string) => {
    console.log('🔧 CategorySelectors handleTypeChange called with:', typeCode);
    onTypeChange(typeCode);
  };

  const handleCategoryChange = (categoryCode: string) => {
    console.log('🔧 CategorySelectors handleCategoryChange called with:', categoryCode);
    onCategoryChange(categoryCode);
  };

  const handleSubcategoryChange = (subcategoryCode: string) => {
    console.log('🔧 CategorySelectors handleSubcategoryChange called with:', subcategoryCode);
    onSubcategoryChange(subcategoryCode);
  };

  // Enhanced debug information
  console.log('🔍 CategorySelectors detailed state:', {
    selectedType,
    selectedCategory,
    selectedSubcategory,
    currentStatus,
    canEdit,
    selectedTypeData: selectedTypeData?.name,
    categoriesAvailable: selectedTypeData?.categories.length || 0,
    subcategoriesAvailable: selectedCategoryData?.subcategories.length || 0,
    actionTypesTotal: ACTION_TYPES.length
  });

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
          <span className="text-blue-600 font-bold ml-2">← Comença aquí</span>
        </Label>
        <Select value={selectedType} onValueChange={handleTypeChange} disabled={!canEdit}>
          <SelectTrigger className="mt-1 bg-white border-2 border-blue-400 focus:border-blue-600">
            <SelectValue placeholder="Selecciona el tipus d'acció" />
          </SelectTrigger>
          <SelectContent className="z-[70] bg-white border-2 border-blue-300 shadow-xl">
            {ACTION_TYPES.map((type) => (
              <SelectItem key={type.code} value={type.code} className="hover:bg-blue-50 focus:bg-blue-100">
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Debug info for type selector */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-1 text-xs text-gray-500">
            Debug: selectedType="{selectedType}", canEdit={canEdit.toString()}, types available: {ACTION_TYPES.length}
          </div>
        )}
      </div>

      {/* Category Selector - Only show if type is selected */}
      {selectedType && selectedTypeData ? (
        <div>
          <Label htmlFor="category" className="text-gray-700 font-medium">
            Categoria 
            <span className="text-sm text-gray-500 ml-2">
              ({selectedTypeData.categories.length} disponibles)
            </span>
            <span className="text-green-600 font-bold ml-2">← Després selecciona categoria</span>
          </Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange} disabled={!canEdit}>
            <SelectTrigger className="mt-1 bg-white border-2 border-green-400 focus:border-green-600">
              <SelectValue placeholder="Selecciona la categoria" />
            </SelectTrigger>
            <SelectContent className="z-[70] bg-white border-2 border-green-300 shadow-xl max-h-60 overflow-y-auto">
              {selectedTypeData.categories.map((category) => (
                <SelectItem key={category.code} value={category.code} className="hover:bg-green-50 focus:bg-green-100">
                  {category.code} - {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Debug info for category selector */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-1 text-xs text-gray-500">
              Debug: selectedCategory="{selectedCategory}", categories: {selectedTypeData.categories.length}
            </div>
          )}
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
            <span className="text-sm text-gray-500 ml-2">
              ({selectedCategoryData.subcategories.length} disponibles)
            </span>
            <span className="text-purple-600 font-bold ml-2">← Finalment subcategoria</span>
          </Label>
          <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange} disabled={!canEdit}>
            <SelectTrigger className="mt-1 bg-white border-2 border-purple-400 focus:border-purple-600">
              <SelectValue placeholder="Selecciona la subcategoria" />
            </SelectTrigger>
            <SelectContent className="z-[70] bg-white border-2 border-purple-300 shadow-xl max-h-60 overflow-y-auto">
              {selectedCategoryData.subcategories.map((subcategory) => (
                <SelectItem key={subcategory.code} value={subcategory.code} className="hover:bg-purple-50 focus:bg-purple-100">
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

      {/* Progress indicator */}
      <div className="flex items-center space-x-2 text-sm">
        <div className={`px-2 py-1 rounded ${selectedType ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
          1. Tipus {selectedType ? '✅' : '⏳'}
        </div>
        <div className={`px-2 py-1 rounded ${selectedCategory ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
          2. Categoria {selectedCategory ? '✅' : '⏳'}
        </div>
        <div className={`px-2 py-1 rounded ${selectedSubcategory ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-500'}`}>
          3. Subcategoria {selectedSubcategory ? '✅' : '⏳'}
        </div>
      </div>

      {/* Enhanced debug information in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>🐛 Debug Status:</strong> {currentStatus} | <strong>Can Edit:</strong> {canEdit ? 'Sí' : 'No'}<br/>
          <strong>Valors rebuts:</strong> Type: "{selectedType}" | Category: "{selectedCategory}" | Subcategory: "{selectedSubcategory}"<br/>
          <strong>Dades trobades:</strong> TypeData: {selectedTypeData ? selectedTypeData.name : 'null'} | 
          Categories disponibles: {selectedTypeData?.categories.length || 0} | 
          Subcategories disponibles: {selectedCategoryData?.subcategories.length || 0}<br/>
          <strong>Handlers:</strong> onTypeChange: {typeof onTypeChange}, onCategoryChange: {typeof onCategoryChange}
        </div>
      )}
    </div>
  );
};

export default CategorySelectors;
