
import { ProposedActionItem } from '@/types';

interface ParsedAction {
  description: string;
  assignedTo?: string;
  dueDate?: string;
  priority?: string;
}

export const parseAIResponseToActions = (aiResponse: string, baseAssignedTo: string = '', baseDueDate: string = ''): ProposedActionItem[] => {
  // Neteja el text inicial
  const cleanText = aiResponse.trim();
  
  // Patrons per identificar accions enumerades
  const patterns = [
    /(?:^|\n)\s*(\d+)\.\s*([^\n]+(?:\n(?!\s*\d+\.)[^\n]*)*)/gm, // 1. Acció
    /(?:^|\n)\s*•\s*([^\n]+(?:\n(?!•)[^\n]*)*)/gm, // • Acció
    /(?:^|\n)\s*-\s*([^\n]+(?:\n(?!-)[^\n]*)*)/gm, // - Acció
    /(?:^|\n)\s*\*\s*([^\n]+(?:\n(?!\*)[^\n]*)*)/gm, // * Acció
  ];

  let actions: ParsedAction[] = [];
  
  // Prova cada patró
  for (const pattern of patterns) {
    const matches = [...cleanText.matchAll(pattern)];
    if (matches.length > 1) { // Si troba més d'una acció
      actions = matches.map(match => {
        const fullText = match[2] || match[1];
        return parseIndividualAction(fullText, baseAssignedTo, baseDueDate);
      });
      break;
    }
  }

  // Si no troba patrons clars, busca accions per paraules clau
  if (actions.length === 0) {
    actions = parseByKeywords(cleanText, baseAssignedTo, baseDueDate);
  }

  // Si encara no troba res, crea una sola acció
  if (actions.length === 0) {
    actions = [{
      description: cleanText.substring(0, 500) + (cleanText.length > 500 ? '...' : ''),
      assignedTo: baseAssignedTo,
      dueDate: baseDueDate
    }];
  }

  // Converteix a ProposedActionItem
  return actions.map((action, index) => ({
    id: `ai-parsed-${Date.now()}-${index}`,
    description: action.description.trim(),
    assignedTo: action.assignedTo || baseAssignedTo || 'Per assignar',
    dueDate: action.dueDate || calculateEscalatedDate(baseDueDate, index),
    status: 'pending' as const
  }));
};

const parseIndividualAction = (text: string, baseAssignedTo: string, baseDueDate: string): ParsedAction => {
  let description = text.trim();
  let assignedTo = baseAssignedTo;
  let dueDate = baseDueDate;

  // Busca responsables mencionats
  const responsiblePatterns = [
    /responsable[:\s]*([^.\n,]+)/i,
    /assignat[:\s]*([^.\n,]+)/i,
    /encarregat[:\s]*([^.\n,]+)/i,
    /departament[:\s]*([^.\n,]+)/i,
  ];

  for (const pattern of responsiblePatterns) {
    const match = description.match(pattern);
    if (match) {
      assignedTo = match[1].trim();
      break;
    }
  }

  // Busca dates mencionades
  const datePatterns = [
    /(\d{1,2})\s*dies?/i,
    /(\d{1,2})\s*setmanes?/i,
    /(\d{1,2})\s*mesos?/i,
  ];

  for (const pattern of datePatterns) {
    const match = description.match(pattern);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[0].toLowerCase();
      let days = num;
      
      if (unit.includes('setman')) days = num * 7;
      else if (unit.includes('mes')) days = num * 30;
      
      dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    }
  }

  return { description, assignedTo, dueDate };
};

const parseByKeywords = (text: string, baseAssignedTo: string, baseDueDate: string): ParsedAction[] => {
  const actionKeywords = [
    'reunir', 'formar', 'revisar', 'analitzar', 'implementar', 'documentar',
    'establir', 'definir', 'redactar', 'monitoritzar', 'avaluar', 'seguiment'
  ];

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const actions: ParsedAction[] = [];

  for (const sentence of sentences) {
    const hasActionKeyword = actionKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword)
    );
    
    if (hasActionKeyword) {
      actions.push(parseIndividualAction(sentence.trim(), baseAssignedTo, baseDueDate));
    }
  }

  return actions;
};

const calculateEscalatedDate = (baseDate: string, index: number): string => {
  const base = baseDate ? new Date(baseDate) : new Date();
  const daysToAdd = (index + 1) * 15; // 15 dies entre accions
  const newDate = new Date(base.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  return newDate.toISOString().split('T')[0];
};

export const shouldAutoParseResponse = (response: string): boolean => {
  // Comprova si la resposta sembla contenir múltiples accions
  const numberPattern = /(?:^|\n)\s*\d+\.\s*/gm;
  const bulletPattern = /(?:^|\n)\s*[•\-\*]\s*/gm;
  
  const numberMatches = [...response.matchAll(numberPattern)];
  const bulletMatches = [...response.matchAll(bulletPattern)];
  
  return numberMatches.length > 1 || bulletMatches.length > 2 || response.length > 800;
};
