
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

  const cleanAIResponse = (text: string): string => {
    // Eliminar blocs de codi markdown si existeixen
    let cleaned = text.trim();
    
    // Eliminar ```json al començament
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }
    
    // Eliminar ``` al final
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    
    // Eliminar espais en blanc addicionals
    return cleaned.trim();
  };

  const validateAIResponse = (parsed: any): boolean => {
    // Verificar que té l'estructura esperada
    if (!parsed || typeof parsed !== 'object') return false;
    if (!Array.isArray(parsed.similarActions)) return false;
    
    // Verificar que cada element té la estructura correcta
    for (const item of parsed.similarActions) {
      if (!item.actionId || typeof item.similarity !== 'number' || !Array.isArray(item.reasons)) {
        return false;
      }
    }
    
    return true;
  };

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

FORMAT DE RESPOSTA (JSON vàlid sense markdown):
{
  "similarActions": [
    {
      "actionId": "ID_de_l_accio",
      "similarity": 85,
      "reasons": ["Mateix tipus d'incident de higiene", "Mateix departament", "Descripció similar sobre protocols"]
    }
  ]
}

IMPORTANT: Respon NOMÉS amb el JSON sense blocs de codi markdown, sense text addicional.`;

      console.log('Enviant prompt a Gemini:', { newAction, existingActionsCount: existingActions.length });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();

      console.log('Resposta crua de Gemini:', rawText);

      // Netejar la resposta abans de parsejar
      const cleanedText = cleanAIResponse(rawText);
      console.log('Resposta netejada:', cleanedText);

      // Intentar parsejar la resposta JSON
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('Error parsing JSON després de netejar:', parseError);
        console.error('Text que va fallar:', cleanedText);
        throw new Error(`No s'ha pogut parsejar la resposta de la IA. Format rebut: ${cleanedText.substring(0, 100)}...`);
      }

      // Validar l'estructura de la resposta
      if (!validateAIResponse(parsedResponse)) {
        console.error('Resposta amb estructura incorrecta:', parsedResponse);
        throw new Error('La resposta de la IA no té l\'estructura esperada');
      }

      console.log('Resposta parsejada correctament:', parsedResponse);

      // Convertir els resultats a SimilarAction[]
      const similarActions: SimilarAction[] = parsedResponse.similarActions
        .map((item: any) => {
          const action = existingActions.find(a => a.id === item.actionId);
          if (!action) {
            console.warn(`Acció no trobada per ID: ${item.actionId}`);
            return null;
          }
          
          return {
            action,
            similarity: item.similarity,
            reasons: item.reasons || []
          };
        })
        .filter(Boolean)
        .sort((a: SimilarAction, b: SimilarAction) => b.similarity - a.similarity);

      console.log('Accions similars trobades:', similarActions);
      return similarActions;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconegut';
      console.error('Error en findSimilarActions:', err);
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
