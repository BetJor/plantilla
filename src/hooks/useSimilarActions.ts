
import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CorrectiveAction } from '@/types';
import { useCorrectiveActions } from './useCorrectiveActions';

interface SimilarAction {
  action: CorrectiveAction;
  similarity: number;
  reasons: string[];
}

interface SimilarityRequest {
  title: string;
  description: string;
  type: string;
  category: string;
  centre: string;
  department: string;
}

export const useSimilarActions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { actions } = useCorrectiveActions();

  const findSimilarActions = async (newAction: SimilarityRequest): Promise<SimilarAction[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const apiKey = localStorage.getItem('gemini-api-key');
      if (!apiKey) {
        throw new Error('Clau d\'API de Gemini no configurada. Configura-la a Configuració.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Preparar les accions existents per comparar
      const existingActions = actions.filter(action => action.status !== 'Borrador');
      
      if (existingActions.length === 0) {
        return [];
      }

      const prompt = `
Ets un expert en qualitat sanitària. Analitza aquesta nova acció correctiva i compara-la amb les accions existents per trobar similituds.

NOVA ACCIÓ:
- Títol: ${newAction.title}
- Descripció: ${newAction.description}
- Tipus: ${newAction.type}
- Categoria: ${newAction.category}
- Centre: ${newAction.centre}
- Departament: ${newAction.department}

ACCIONS EXISTENTS:
${existingActions.map((action, index) => `
${index + 1}. ID: ${action.id}
   Títol: ${action.title}
   Descripció: ${action.description}
   Tipus: ${action.type}
   Categoria: ${action.category}
   Centre: ${action.centre}
   Departament: ${action.department}
   Estat: ${action.status}
`).join('\n')}

INSTRUCCIONS:
1. Compara la nova acció amb cada acció existent
2. Calcula un percentatge de similitud (0-100%) basant-te en:
   - Similitud del problema/incident descrit (pes: 40%)
   - Mateix tipus i categoria (pes: 25%)
   - Mateix centre o departament (pes: 20%)
   - Similitud en el títol (pes: 15%)
3. Només inclou accions amb similitud >= 30%
4. Explica breument les raons de la similitud

FORMAT DE RESPOSTA (JSON vàlid):
{
  "similarActions": [
    {
      "actionId": "ID_de_l_accio",
      "similarity": 85,
      "reasons": ["Mateix tipus d'incident de higiene", "Mateix departament", "Descripció similar sobre protocols"]
    }
  ]
}

Respon NOMÉS amb el JSON, sense text addicional.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      // Intentar parsejar la resposta JSON
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing AI response:', text);
        throw new Error('Resposta de la IA no vàlida');
      }

      // Convertir els resultats a SimilarAction[]
      const similarActions: SimilarAction[] = parsedResponse.similarActions
        .map((item: any) => {
          const action = existingActions.find(a => a.id === item.actionId);
          if (!action) return null;
          
          return {
            action,
            similarity: item.similarity,
            reasons: item.reasons || []
          };
        })
        .filter(Boolean)
        .sort((a: SimilarAction, b: SimilarAction) => b.similarity - a.similarity);

      return similarActions;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconegut';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    findSimilarActions,
    isLoading,
    error
  };
};
