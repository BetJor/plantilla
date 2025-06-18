
import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CorrectiveAction } from '@/types';

interface SuggestionRequest {
  action: CorrectiveAction;
  rootCauses?: string;
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

  return {
    generateSuggestion,
    isLoading,
    error
  };
};
