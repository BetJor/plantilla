
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { RotateCcw, GripVertical } from 'lucide-react';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import { SectionConfig, useDraggableSections } from '@/hooks/useDraggableSections';

interface DraggableSectionProps {
  section: SectionConfig;
}

const DraggableSection = ({ section }: DraggableSectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-12 z-10 p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
        title="Arrossegar per reordenar"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <CollapsibleSection
        id={section.id}
        title={section.title}
        icon={section.icon}
        badge={section.badge}
        summary={section.summary}
        defaultOpen={section.defaultOpen}
      >
        {section.content}
      </CollapsibleSection>
    </div>
  );
};

interface DraggableSectionsProps {
  sections: SectionConfig[];
}

const DraggableSections = ({ sections }: DraggableSectionsProps) => {
  const { orderedSections, saveSectionOrder, resetOrder } = useDraggableSections(sections);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = orderedSections.findIndex(s => s.id === active.id);
      const newIndex = orderedSections.findIndex(s => s.id === over?.id);
      
      const newOrder = arrayMove(orderedSections, oldIndex, newIndex).map(s => s.id);
      saveSectionOrder(newOrder);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={resetOrder}
          className="text-xs"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Restaurar ordre
        </Button>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedSections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-6">
            {orderedSections.map((section) => (
              <DraggableSection key={section.id} section={section} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DraggableSections;
