
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
}

const CategorySelectors = ({
  selectedType,
  selectedCategory,
  selectedSubcategory,
  onTypeChange,
  onCategoryChange,
  onSubcategoryChange,
  readOnly = false
}: CategorySelectorsProps) => {
  const selectedTypeData = ACTION_TYPES.find(type => type.code === selectedType);
  const selectedCategoryData = selectedTypeData?.categories.find(cat => cat.code === selectedCategory);

  const handleTypeChange = (typeCode: string) => {
    console.log('Type changed to:', typeCode);
    onTypeChange(typeCode);
    onCategoryChange('');
    onSubcategoryChange('');
  };

  const handleCategoryChange = (categoryCode: string) => {
    console.log('Category changed to:', categoryCode);
    onCategoryChange(categoryCode);
    onSubcategoryChange('');
  };

  const handleSubcategoryChange = (subcategoryCode: string) => {
    console.log('Subcategory changed to:', subcategoryCode);
    onSubcategoryChange(subcategoryCode);
  };

  // Debug information
  console.log('CategorySelectors render:', {
    selectedType,
    selectedCategory,
    selectedSubcategory,
    selectedTypeData: selectedTypeData?.name,
    categoriesAvailable: selectedTypeData?.categories.length || 0,
    subcategoriesAvailable: selectedCategoryData?.subcategories.length || 0
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
        <Label htmlFor="actionType" className="text-gray-700 font-medium">Tipus d'Acció</Label>
        <Select value={selectedType} onValueChange={handleTypeChange}>
          <SelectTrigger className="mt-1 bg-white border-2 border-gray-300">
            <SelectValue placeholder="Selecciona el tipus d'acció" />
          </SelectTrigger>
          <SelectContent className="z-[60] bg-white border-2 border-gray-300 shadow-lg">
            {ACTION_TYPES.map((type) => (
              <SelectItem key={type.code} value={type.code} className="hover:bg-blue-50">
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Selector - Only show if type is selected */}
      {selectedType && selectedTypeData && (
        <div>
          <Label htmlFor="category" className="text-gray-700 font-medium">
            Categoria 
            <span className="text-sm text-gray-500 ml-2">
              ({selectedTypeData.categories.length} disponibles)
            </span>
          </Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="mt-1 bg-white border-2 border-blue-300">
              <SelectValue placeholder="Selecciona la categoria" />
            </SelectTrigger>
            <SelectContent className="z-[60] bg-white border-2 border-gray-300 shadow-lg max-h-60 overflow-y-auto">
              {selectedTypeData.categories.map((category) => (
                <SelectItem key={category.code} value={category.code} className="hover:bg-blue-50">
                  {category.code} - {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Subcategory Selector - Only show if category is selected and has subcategories */}
      {selectedCategory && selectedCategoryData && selectedCategoryData.subcategories.length > 0 && (
        <div>
          <Label htmlFor="subcategory" className="text-gray-700 font-medium">
            Subcategoria
            <span className="text-sm text-gray-500 ml-2">
              ({selectedCategoryData.subcategories.length} disponibles)
            </span>
          </Label>
          <Select value={selectedSubcategory} onValueChange={handleSubcategoryChange}>
            <SelectTrigger className="mt-1 bg-white border-2 border-green-300">
              <SelectValue placeholder="Selecciona la subcategoria" />
            </SelectTrigger>
            <SelectContent className="z-[60] bg-white border-2 border-gray-300 shadow-lg max-h-60 overflow-y-auto">
              {selectedCategoryData.subcategories.map((subcategory) => (
                <SelectItem key={subcategory.code} value={subcategory.code} className="hover:bg-blue-50">
                  {subcategory.code} - {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Debug information in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <strong>Debug:</strong> Type: {selectedType} | Category: {selectedCategory} | Subcategory: {selectedSubcategory}
        </div>
      )}
    </div>
  );
};

export default CategorySelectors;
