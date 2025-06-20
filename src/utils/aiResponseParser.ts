
import { ProposedActionItem } from '@/types';

interface ParsedAction {
  description: string;
  assignedTo?: string;
  dueDate?: string;
  priority?: string;
}

export const parseAIResponseToActions = (aiResponse: string, baseAssignedTo: string = '', baseDueDate: string = ''): ProposedActionItem[] => {
  console.log('🔍 Parsing AI response:', aiResponse.substring(0, 200) + '...');
  
  // Neteja el text inicial
  const cleanText = aiResponse.trim();
  
  // Patrons millorats per identificar accions enumerades
  const numberedPattern = /(?:^|\n)\s*(\d+)\.\s*\*?\*?([^.\n]*(?:[^0-9\n][^\n]*)*?)(?=\n\s*\d+\.|$)/gm;
  const bulletPattern = /(?:^|\n)\s*[•\-\*]\s*([^\n]+(?:\n(?![•\-\*\d])[^\n]*)*)/gm;
  
  let actions: ParsedAction[] = [];
  
  // Prova primer amb punts numerats
  const numberedMatches = [...cleanText.matchAll(numberedPattern)];
  console.log('📋 Numbered matches found:', numberedMatches.length);
  
  if (numberedMatches.length > 1) {
    actions = numberedMatches.map((match, index) => {
      const actionNumber = match[1];
      const actionText = match[2].trim();
      console.log(`📝 Action ${actionNumber}:`, actionText.substring(0, 100) + '...');
      
      return parseIndividualAction(actionText, baseAssignedTo, baseDueDate, index);
    });
  } else {
    // Prova amb bullets si no troba punts numerats
    const bulletMatches = [...cleanText.matchAll(bulletPattern)];
    console.log('🔸 Bullet matches found:', bulletMatches.length);
    
    if (bulletMatches.length > 1) {
      actions = bulletMatches.map((match, index) => {
        const actionText = match[1].trim();
        return parseIndividualAction(actionText, baseAssignedTo, baseDueDate, index);
      });
    }
  }

  // Si no troba patrons clars, busca accions per paraules clau
  if (actions.length === 0) {
    console.log('🔍 Trying keyword-based parsing...');
    actions = parseByKeywords(cleanText, baseAssignedTo, baseDueDate);
  }

  // Si encara no troba res, crea una sola acció
  if (actions.length === 0) {
    console.log('📄 Creating single action from full text');
    actions = [{
      description: cleanText.substring(0, 500) + (cleanText.length > 500 ? '...' : ''),
      assignedTo: baseAssignedTo,
      dueDate: baseDueDate
    }];
  }

  console.log('✅ Total actions parsed:', actions.length);

  // Converteix a ProposedActionItem
  return actions.map((action, index) => ({
    id: `ai-parsed-${Date.now()}-${index}`,
    description: cleanActionText(action.description),
    assignedTo: action.assignedTo || baseAssignedTo || 'Per assignar',
    dueDate: action.dueDate || calculateEscalatedDate(baseDueDate, index),
    status: 'pending' as const
  }));
};

const cleanActionText = (text: string): string => {
  // Neteja el text eliminant formatació markdown i asteriscs
  return text
    .replace(/\*\*/g, '') // Eliminar **
    .replace(/\*/g, '') // Eliminar *
    .replace(/^\d+\.\s*/, '') // Eliminar numeració inicial
    .replace(/^[•\-\*]\s*/, '') // Eliminar bullets inicials
    .trim();
};

const parseIndividualAction = (text: string, baseAssignedTo: string, baseDueDate: string, index: number = 0): ParsedAction => {
  let description = text.trim();
  let assignedTo = baseAssignedTo;
  let dueDate = baseDueDate;

  // Busca responsables mencionats amb patrons millorats
  const responsiblePatterns = [
    /(?:responsable|assignat|encarregat)[:\s]*([^.\n,]+)/i,
    /departament[:\s]*([^.\n,]+)/i,
    /equip[:\s]*([^.\n,]+)/i,
    /personal[:\s]*([^.\n,]+)/i,
  ];

  for (const pattern of responsiblePatterns) {
    const match = description.match(pattern);
    if (match) {
      assignedTo = match[1].trim();
      break;
    }
  }

  // Busca dates mencionades amb patrons millorats
  const datePatterns = [
    /(\d{1,2})\s*dies?/i,
    /(\d{1,2})\s*setmanes?/i,
    /(\d{1,2})\s*mesos?/i,
    /durant\s*els?\s*següents?\s*(\d{1,2})\s*(dies?|setmanes?|mesos?)/i,
  ];

  for (const pattern of datePatterns) {
    const match = description.match(pattern);
    if (match) {
      const num = parseInt(match[1]);
      const unit = match[2] || match[0].toLowerCase();
      let days = num;
      
      if (unit.includes('setman')) days = num * 7;
      else if (unit.includes('mes')) days = num * 30;
      
      dueDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    }
  }

  // Assigna responsables intel·ligents segons el contingut
  if (!assignedTo || assignedTo === baseAssignedTo) {
    assignedTo = inferResponsibleFromContent(description);
  }

  return { description, assignedTo, dueDate };
};

const inferResponsibleFromContent = (description: string): string => {
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('reunir') || lowerDesc.includes('equip')) {
    return 'Coordinador de Qualitat';
  }
  if (lowerDesc.includes('analitzar') || lowerDesc.includes('revisar')) {
    return 'Departament de Qualitat';
  }
  if (lowerDesc.includes('protocol') || lowerDesc.includes('documentar')) {
    return 'Responsable de Protocols';
  }
  if (lowerDesc.includes('formació') || lowerDesc.includes('formar')) {
    return 'Responsable de Formació';
  }
  if (lowerDesc.includes('seguiment') || lowerDesc.includes('monitoritzar')) {
    return 'Supervisor de Qualitat';
  }
  
  return 'Per assignar';
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
  // Comprova si la resposta sembla contenir múltiples accions numerades
  const numberedPattern = /(?:^|\n)\s*\d+\.\s*/gm;
  const bulletPattern = /(?:^|\n)\s*[•\-\*]\s*/gm;
  
  const numberedMatches = [...response.matchAll(numberedPattern)];
  const bulletMatches = [...response.matchAll(bulletPattern)];
  
  console.log('🔍 Auto-parse detection:', {
    numberedMatches: numberedMatches.length,
    bulletMatches: bulletMatches.length,
    length: response.length
  });
  
  // Més estricte: requereix almenys 2 punts numerats O més de 3 bullets
  return numberedMatches.length >= 2 || bulletMatches.length > 3 || response.length > 1000;
};
