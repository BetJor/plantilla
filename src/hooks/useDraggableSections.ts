
import { useState, useEffect } from 'react';

export interface SectionConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  summary?: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

const SECTIONS_ORDER_KEY = 'sections-order';

export const useDraggableSections = (sections: SectionConfig[]) => {
  const [sectionOrder, setSectionOrder] = useState<string[]>([]);

  // Carregar ordre de localStorage a l'inici
  useEffect(() => {
    const savedOrder = localStorage.getItem(SECTIONS_ORDER_KEY);
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        if (Array.isArray(parsedOrder)) {
          setSectionOrder(parsedOrder);
        } else {
          setSectionOrder(sections.map(s => s.id));
        }
      } catch (error) {
        setSectionOrder(sections.map(s => s.id));
      }
    } else {
      setSectionOrder(sections.map(s => s.id));
    }
  }, [sections]);

  // Guardar ordre a localStorage
  const saveSectionOrder = (newOrder: string[]) => {
    setSectionOrder(newOrder);
    localStorage.setItem(SECTIONS_ORDER_KEY, JSON.stringify(newOrder));
  };

  // Ordenar seccions segons l'ordre guardat
  const orderedSections = sectionOrder
    .map(id => sections.find(s => s.id === id))
    .filter(Boolean) as SectionConfig[];

  // Afegir seccions noves que no estiguin a l'ordre
  const newSections = sections.filter(s => !sectionOrder.includes(s.id));
  const allOrderedSections = [...orderedSections, ...newSections];

  const resetOrder = () => {
    const defaultOrder = sections.map(s => s.id);
    saveSectionOrder(defaultOrder);
  };

  return {
    orderedSections: allOrderedSections,
    sectionOrder,
    saveSectionOrder,
    resetOrder
  };
};
