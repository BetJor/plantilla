
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ACTION_TYPES } from '@/types/categories';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface CategorySelectorsProps {
  selectedType: string;
  selectedCategory: string;
  selectedSubcategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  currentStatus: string;
  allowedTypes?: string[];
  readOnly?: boolean;
}

const CategorySelectors = ({
  selectedType,
  selectedCategory,
  selectedSubcategory,
  onTypeChange,
  onCategoryChange,
  onSubcategoryChange,
  currentStatus,
  allowedTypes = [],
  readOnly = false
}: CategorySelectorsProps) => {
  const isReadOnly = readOnly || !['Borrador'].includes(currentStatus);
  
  // Filtrar tipus d'accions segons permisos
  const availableTypes = allowedTypes.length > 0 
    ? ACTION_TYPES.filter(type => allowedTypes.includes(type.code))
    : ACTION_TYPES;

  const selectedTypeData = ACTION_TYPES.find(type => type.code === selectedType);
  const availableCategories = selectedTypeData ? selectedTypeData.categories : [];
  
  const selectedCategoryData = availableCategories.find(cat => cat.code === selectedCategory);
  const availableSubcategories = selectedCategoryData ? selectedCategoryData.subcategories : [];

  if (availableTypes.length === 0) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          No tens permisos per crear cap tipus d'acció correctiva. Contacta amb l'administrador.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classificació de l'Acció</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="type">Tipus d'Acció</Label>
          <Select 
            value={selectedType} 
            onValueChange={onTypeChange}
            disabled={isReadOnly}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecciona el tipus d'acció" />
            </SelectTrigger>
            <SelectContent>
              {availableTypes.map((type) => (
                <SelectItem key={type.code} value={type.code}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedTypeData && (
            <p className="text-sm text-gray-600 mt-1">{selectedTypeData.description}</p>
          )}
        </div>

        {selectedType && availableCategories.length > 0 && (
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={selectedCategory} 
              onValueChange={onCategoryChange}
              disabled={isReadOnly}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona la categoria" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category.code} value={category.code}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedCategory && availableSubcategories.length > 0 && (
          <div>
            <Label htmlFor="subcategory">Subcategoria</Label>
            <Select 
              value={selectedSubcategory} 
              onValueChange={onSubcategoryChange}
              disabled={isReadOnly}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona la subcategoria" />
              </SelectTrigger>
              <SelectContent>
                {availableSubcategories.map((subcategory) => (
                  <SelectItem key={subcategory.code} value={subcategory.code}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedType && availableCategories.length === 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Aquest tipus d'acció no té categories específiques definides.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CategorySelectors;
