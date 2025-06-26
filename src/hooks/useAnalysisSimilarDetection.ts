
import { useState, useEffect } from 'react';
import { useSimilarActions } from './useSimilarActions';
import { CorrectiveAction } from '@/types';

interface SimilarAction {
  action: CorrectiveAction;
  similarity: number;
  reasons: string[];
}

interface UseAnalysisSimilarDetectionProps {
  action?: CorrectiveAction;
  isEnabled: boolean;
}

export const useAnalysisSimilarDetection = ({ action, isEnabled }: UseAnalysisSimilarDetectionProps) => {
  const [similarActions, setSimilarActions] = useState<SimilarAction[]>([]);
  const [hasCheckedSimilarity, setHasCheckedSimilarity] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const { findSimilarActions, isLoading } = useSimilarActions();

  // No detectar similituds per accions BIS
  const shouldDetect = isEnabled && action && action.status === 'Pendiente de Análisis' && !action.esBis;

  const detectSimilarActions = async () => {
    if (!shouldDetect || hasCheckedSimilarity) {
      return;
    }

    setIsDetecting(true);
    
    try {
      const results = await findSimilarActions({
        title: action.title,
        description: action.description,
        type: action.type,
        category: action.category,
        centre: action.centre,
        department: action.department,
        excludeActionId: action.id
      });

      setSimilarActions(results);
      setHasCheckedSimilarity(true);
    } catch (error) {
      console.error('Error detecting similar actions:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const clearDetection = () => {
    setSimilarActions([]);
    setHasCheckedSimilarity(false);
  };

  const markAsReviewed = () => {
    setHasCheckedSimilarity(true);
  };

  const hasHighSimilarity = similarActions.some(sa => sa.similarity >= 80);

  // Auto-detect quan es carrega una acció en estat "Pendiente de Análisis" (però no BIS)
  useEffect(() => {
    if (shouldDetect && !hasCheckedSimilarity) {
      const timer = setTimeout(() => {
        detectSimilarActions();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [action?.id, action?.status, action?.esBis, shouldDetect, hasCheckedSimilarity]);

  return {
    similarActions,
    isDetecting: isDetecting || isLoading,
    hasCheckedSimilarity,
    hasHighSimilarity,
    detectSimilarActions,
    clearDetection,
    markAsReviewed
  };
};
