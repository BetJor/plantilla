
import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CorrectiveAction, ProposedActionItem } from '@/types';

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
      // Obtenir la clau d'API del localStorage
      const apiKey = localStorage.getItem('gemini-api-key');
      if (!apiKey) {
        throw new Error('Clau d\'API de Gemini no configurada. Configura-la a Configuració.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Ets un expert en qualitat sanitària i accions correctives. Basant-te en la següent informació, proposa una acció correctiva específica, realitzable i adequada per a un entorn sanitari:

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
1. Proposa una acció correctiva específica i detallada
2. Assegura't que sigui realitzable dins l'entorn sanitari
3. Considera els recursos disponibles al departament
4. Inclou mesures de seguiment si és apropiat
5. Escriu en català
6. Sigues concís però específic
7. Centra't en prevenir la repetició de l'incident

ACCIÓ PROPOSADA:`;

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
        
        // Validar i processar les accions
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
        
        // Fallback: crear accions bàsiques
        return [{
          id: `ai-fallback-${Date.now()}`,
          description: 'Acció correctiva generada automàticament. Cal revisar i personalitzar.',
          assignedTo: action.assignedTo || 'Per assignar',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'pending'
        }];
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconegut';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateSuggestion,
    generateMultipleProposedActions,
    isLoading,
    error
  };
};
