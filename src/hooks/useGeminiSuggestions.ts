
import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CorrectiveAction, ProposedActionItem } from '@/types';
import { parseAIResponseToActions, shouldAutoParseResponse } from '@/utils/aiResponseParser';

interface SuggestionRequest {
  action: CorrectiveAction;
  rootCauses?: string;
}

interface MultipleActionsRequest extends SuggestionRequest {
  targetCount?: number;
}

export const useGeminiSuggestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestion = async ({ action, rootCauses }: SuggestionRequest): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = localStorage.getItem('gemini-api-key');
      if (!apiKey) {
        throw new Error('Clau d\'API de Gemini no configurada. Configura-la a Configuració.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Ets un expert en qualitat sanitària i accions correctives. Basant-te en la següent informació, proposa accions correctives específiques i realitzables per a un entorn sanitari:

INFORMACIÓ DE L'INCIDENT:
- Títol: ${action.title}
- Descripció: ${action.description}
- Tipus: ${action.type}
- Categoria: ${action.category}
- Centre: ${action.centre}
- Departament: ${action.department}
- Prioritat: ${action.priority}

${rootCauses ? `ANÀLISI DE CAUSES ARREL:
${rootCauses}` : ''}

INSTRUCCIONS ESPECÍFIQUES:
1. Proposa múltiples accions correctives numerades clarament (1., 2., 3., 4., etc.)
2. Cada acció ha de ser específica i realitzable dins l'entorn sanitari
3. Per cada acció, indica:
   - Descripció detallada del que cal fer
   - Qui seria el responsable més adequat
   - Termini estimat en dies/setmanes
4. Numera cada acció amb format: "1. **Títol de l'acció:** Descripció detallada..."
5. Assegura't que cada acció sigui independent i completa
6. Inclou mesures de seguiment i avaluació
7. Escriu en català
8. Centra't en prevenir la repetició de l'incident

ACCIONS CORRECTIVES PROPOSADES:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestion = response.text().trim();

      return suggestion;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconegut';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMultipleProposedActions = async ({ action, rootCauses, targetCount = 3 }: MultipleActionsRequest): Promise<ProposedActionItem[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = localStorage.getItem('gemini-api-key');
      if (!apiKey) {
        throw new Error('Clau d\'API de Gemini no configurada. Configura-la a Configuració.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Ets un expert en qualitat sanitària i accions correctives. Basant-te en la següent informació, proposa ${targetCount} accions correctives específiques i complementàries per a un entorn sanitari:

INFORMACIÓ DE L'INCIDENT:
- Títol: ${action.title}
- Descripció: ${action.description}
- Tipus: ${action.type}
- Categoria: ${action.category}
- Centre: ${action.centre}
- Departament: ${action.department}
- Prioritat: ${action.priority}

${rootCauses ? `ANÀLISI DE CAUSES ARREL:
${rootCauses}` : ''}

INSTRUCCIONS:
1. Proposa ${targetCount} accions correctives específiques i complementàries
2. Cada acció ha de ser realitzable dins l'entorn sanitari
3. Assigna un responsable adequat per cada acció segons el departament i tipus
4. Calcula una data límit realista per cada acció (entre 15-90 dies)
5. Ordena les accions per prioritat d'implementació
6. Escriu en català
7. Retorna NOMÉS un JSON vàlid amb aquest format exacte:

[
  {
    "description": "Descripció detallada de l'acció 1",
    "assignedTo": "Nom del responsable",
    "dueDate": "YYYY-MM-DD",
    "status": "pending"
  },
  {
    "description": "Descripció detallada de l'acció 2", 
    "assignedTo": "Nom del responsable",
    "dueDate": "YYYY-MM-DD",
    "status": "pending"
  }
]

IMPORTANT: Retorna NOMÉS el JSON, sense text adicional abans o després.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const jsonText = response.text().trim();

      try {
        const actions = JSON.parse(jsonText);
        
        const proposedActions: ProposedActionItem[] = actions.map((action: any, index: number) => ({
          id: `ai-${Date.now()}-${index}`,
          description: action.description || '',
          assignedTo: action.assignedTo || action.assignedTo || 'Per assignar',
          dueDate: action.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending' as const
        }));

        return proposedActions;
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        console.log('Raw response:', jsonText);
        
        // Fallback: usar el parser automàtic
        const baseDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        return parseAIResponseToActions(jsonText, action.assignedTo || 'Per assignar', baseDate);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconegut';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAndParseActions = async ({ action, rootCauses }: SuggestionRequest): Promise<ProposedActionItem[]> => {
    try {
      console.log('🚀 Generating and parsing actions...');
      const suggestion = await generateSuggestion({ action, rootCauses });
      
      console.log('📝 Generated suggestion length:', suggestion.length);
      console.log('🔍 Checking if should auto-parse...');
      
      if (shouldAutoParseResponse(suggestion)) {
        console.log('✅ Auto-parsing detected, proceeding...');
        const baseDate = action.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const parsedActions = parseAIResponseToActions(suggestion, action.assignedTo || 'Per assignar', baseDate);
        console.log('📊 Parsed actions count:', parsedActions.length);
        return parsedActions;
      } else {
        console.log('📄 Creating single action from response');
        // Si no es detecten múltiples accions, crear una sola
        return [{
          id: `ai-single-${Date.now()}`,
          description: suggestion,
          assignedTo: action.assignedTo || 'Per assignar',
          dueDate: action.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending'
        }];
      }
    } catch (err) {
      throw err;
    }
  };

  return {
    generateSuggestion,
    generateMultipleProposedActions,
    generateAndParseActions,
    isLoading,
    error
  };
};
