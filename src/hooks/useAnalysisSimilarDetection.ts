
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

  // Determine if we should actually detect - moved logic inside the hook
  const shouldDetect = action && 
    action.status === 'Pendiente de Análisis' && 
    !action.esBis && 
    isEnabled;

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

  // Auto-detect when action changes to eligible state
  useEffect(() => {
    // Reset state when action changes
    if (action?.id) {
      setSimilarActions([]);
      setHasCheckedSimilarity(false);
      setIsDetecting(false);
    }
  }, [action?.id]);

  // Auto-detect for eligible actions
  useEffect(() => {
    if (shouldDetect && !hasCheckedSimilarity && !isDetecting) {
      const timer = setTimeout(() => {
        detectSimilarActions();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [shouldDetect, hasCheckedSimilarity, isDetecting]);

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
