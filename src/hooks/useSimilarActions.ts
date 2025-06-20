import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CorrectiveAction } from '@/types';
import { useCorrectiveActions } from './useCorrectiveActions';
import { toast } from '@/hooks/use-toast';

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
  department?: string; // Made optional
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
    console.log('findSimilarActions: Iniciant cerca d\'accions similars...');
    console.log('findSimilarActions: Nova acció:', newAction);
    
    setIsLoading(true);
    setError(null);

    try {
      // Verificar clau API
      const apiKey = localStorage.getItem('gemini-api-key');
      console.log('findSimilarActions: Clau API present:', !!apiKey);
      
      if (!apiKey) {
        const errorMsg = 'Clau d\'API de Gemini no configurada. Configura-la a Configuració.';
        console.error('findSimilarActions:', errorMsg);
        toast({
          title: "Error de configuració",
          description: errorMsg,
          variant: "destructive"
        });
        throw new Error(errorMsg);
      }

      // Preparar les accions existents per comparar
      const existingActions = actions.filter(action => action.status !== 'Borrador');
      console.log('findSimilarActions: Accions existents per comparar:', existingActions.length);
      
      if (existingActions.length === 0) {
        console.log('findSimilarActions: No hi ha accions existents per comparar');
        toast({
          title: "Cap acció per comparar",
          description: "No hi ha accions existents per comparar amb aquesta nova acció.",
          variant: "default"
        });
        return [];
      }

      console.log('findSimilarActions: Creant model Gemini...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
Ets un expert en qualitat sanitària. Analitza aquesta nova acció correctiva i compara-la amb les accions existents per trobar similituds.

NOVA ACCIÓ:
- Títol: ${newAction.title}
- Descripció: ${newAction.description}
- Tipus: ${newAction.type}
- Categoria: ${newAction.category}
- Centre: ${newAction.centre}
- Departament: ${newAction.department || 'No especificat'}

ACCIONS EXISTENTS:
${existingActions.map((action, index) => `
${index + 1}. ID: ${action.id}
   Títol: ${action.title}
   Descripció: ${action.description}
   Tipus: ${action.type}
   Categoria: ${action.category}
   Centre: ${action.centre}
   Departament: ${action.department || 'No especificat'}
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

      console.log('findSimilarActions: Enviant prompt a Gemini...');
      console.log('findSimilarActions: Longitud del prompt:', prompt.length);

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();

      console.log('findSimilarActions: Resposta crua de Gemini rebuda:', rawText.substring(0, 200) + '...');

      // Netejar la resposta abans de parsejar
      const cleanedText = cleanAIResponse(rawText);
      console.log('findSimilarActions: Resposta netejada:', cleanedText.substring(0, 200) + '...');

      // Intentar parsejar la resposta JSON
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(cleanedText);
        console.log('findSimilarActions: Resposta parsejada correctament');
      } catch (parseError) {
        console.error('findSimilarActions: Error parsing JSON:', parseError);
        console.error('findSimilarActions: Text que va fallar:', cleanedText);
        
        toast({
          title: "Error processant resposta",
          description: "No s'ha pogut processar la resposta de la IA. Prova-ho de nou.",
          variant: "destructive"
        });
        throw new Error(`No s'ha pogut parsejar la resposta de la IA. Format rebut: ${cleanedText.substring(0, 100)}...`);
      }

      // Validar l'estructura de la resposta
      if (!validateAIResponse(parsedResponse)) {
        console.error('findSimilarActions: Resposta amb estructura incorrecta:', parsedResponse);
        toast({
          title: "Error en la resposta",
          description: "La resposta de la IA no té l'estructura esperada. Prova-ho de nou.",
          variant: "destructive"
        });
        throw new Error('La resposta de la IA no té l\'estructura esperada');
      }

      console.log('findSimilarActions: Validació superada, processant resultats...');

      // Convertir els resultats a SimilarAction[]
      const similarActions: SimilarAction[] = parsedResponse.similarActions
        .map((item: any) => {
          const action = existingActions.find(a => a.id === item.actionId);
          if (!action) {
            console.warn(`findSimilarActions: Acció no trobada per ID: ${item.actionId}`);
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

      console.log('findSimilarActions: Accions similars trobades:', similarActions.length);
      
      // Toast informatiu sobre els resultats
      if (similarActions.length > 0) {
        toast({
          title: "Accions similars trobades",
          description: `S'han trobat ${similarActions.length} acció${similarActions.length > 1 ? 's' : ''} similar${similarActions.length > 1 ? 's' : ''}.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Cap similitud trobada",
          description: "No s'han trobat accions similars a aquesta nova acció.",
          variant: "default"
        });
      }
      
      return similarActions;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconegut';
      console.error('findSimilarActions: Error final:', err);
      setError(errorMessage);
      
      // Toast d'error si no s'ha mostrat ja
      if (!errorMessage.includes('configurada') && !errorMessage.includes('processant') && !errorMessage.includes('estructura')) {
        toast({
          title: "Error cercant accions similars",
          description: errorMessage,
          variant: "destructive"
        });
      }
      
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
