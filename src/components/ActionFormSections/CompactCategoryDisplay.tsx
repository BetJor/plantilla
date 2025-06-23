
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ACTION_TYPES } from '@/types/categories';
import { ChevronRight, Tag } from 'lucide-react';

interface CompactCategoryDisplayProps {
  selectedType: string;
  selectedCategory: string;
  selectedSubcategory: string;
}

const CompactCategoryDisplay = ({
  selectedType,
  selectedCategory,
  selectedSubcategory
}: CompactCategoryDisplayProps) => {
  const selectedTypeData = ACTION_TYPES.find(type => type.code === selectedType);
  const selectedCategoryData = selectedTypeData?.categories.find(cat => cat.code === selectedCategory);
  const selectedSubcategoryData = selectedCategoryData?.subcategories.find(sub => sub.code === selectedSubcategory);

  const getTypeBadgeVariant = (type: string) => {
    if (type.includes('lopd')) return 'destructive';
    if (type.includes('qualitat')) return 'default';
    if (type.includes('incidencias')) return 'orange';
    return 'secondary';
  };

  return (
    <div className="flex items-center gap-2 py-2">
      <Tag className="w-4 h-4 text-gray-500" />
      <div className="flex items-center gap-2 flex-wrap">
        {selectedTypeData && (
          <>
            <Badge variant={getTypeBadgeVariant(selectedType)} className="text-xs">
              {selectedTypeData.name}
            </Badge>
            {selectedCategoryData && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <Badge variant="outline" className="text-xs">
                  {selectedCategoryData.name}
                </Badge>
              </>
            )}
            {selectedSubcategoryData && (
              <>
                <ChevronRight className="w-3 h-3 text-gray-400" />
                <Badge variant="secondary" className="text-xs">
                  {selectedSubcategoryData.name}
                </Badge>
              </>
            )}
          </>
        )}
        
        {!selectedTypeData && selectedType && (
          <Badge variant="outline" className="text-xs">
            {selectedType}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default CompactCategoryDisplay;
