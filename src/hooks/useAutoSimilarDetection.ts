
import { useState, useEffect, useCallback } from 'react';
import { useSimilarActions } from './useSimilarActions';
import { useCorrectiveActions } from './useCorrectiveActions';

interface AutoDetectionConfig {
  title: string;
  description: string;
  type: string;
  category: string;
  centre: string;
  department?: string;
}

export const useAutoSimilarDetection = () => {
  const [similarActions, setSimilarActions] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastDetection, setLastDetection] = useState<string>('');
  const { findSimilarActions } = useSimilarActions();
  const { actions } = useCorrectiveActions();

  const detectSimilarActions = useCallback(async (config: AutoDetectionConfig) => {
    // Crear una clau única per evitar deteccions duplicades
    const detectionKey = `${config.title}-${config.description}-${config.type}`;
    
    if (detectionKey === lastDetection || !config.title.trim() || !config.description.trim()) {
      return;
    }

    // Verificar que hi ha accions per comparar
    const existingActions = actions.filter(action => action.status !== 'Borrador');
    if (existingActions.length === 0) {
      return;
    }

    // Verificar clau API
    const apiKey = localStorage.getItem('gemini-api-key');
    if (!apiKey) {
      return;
    }

    setIsDetecting(true);
    setLastDetection(detectionKey);

    try {
      const results = await findSimilarActions(config);
      setSimilarActions(results);
    } catch (error) {
      console.error('Error in auto-detection:', error);
      setSimilarActions([]);
    } finally {
      setIsDetecting(false);
    }
  }, [findSimilarActions, actions, lastDetection]);

  // Debounced detection function
  const debouncedDetect = useCallback(
    debounce((config: AutoDetectionConfig) => {
      detectSimilarActions(config);
    }, 1000),
    [detectSimilarActions]
  );

  const clearDetection = () => {
    setSimilarActions([]);
    setLastDetection('');
  };

  return {
    similarActions,
    isDetecting,
    debouncedDetect,
    clearDetection,
    hasHighSimilarity: similarActions.some((action: any) => action.similarity >= 80)
  };
};

// Utility function for debouncing
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
}
