
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb
} from 'lucide-react';
import { CorrectiveAction } from '@/types';
import ActionPreviewDialog from './ActionPreviewDialog';

interface SimilarAction {
  action: CorrectiveAction;
  similarity: number;
  reasons: string[];
}

interface SimilarActionsPanelProps {
  similarActions: SimilarAction[];
  isDetecting: boolean;
  hasHighSimilarity: boolean;
  onClearDetection: () => void;
}

const SimilarActionsPanel = ({ 
  similarActions, 
  isDetecting, 
  hasHighSimilarity,
  onClearDetection
}: SimilarActionsPanelProps) => {
  const [previewActionId, setPreviewActionId] = useState<string | null>(null);

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 80) return 'text-red-600 bg-red-50 border-red-200';
    if (similarity >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (similarity >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getSimilarityIcon = (similarity: number) => {
    if (similarity >= 80) return <AlertTriangle className="w-4 h-4" />;
    if (similarity >= 60) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  if (isDetecting) {
    return (
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-600">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Detectant accions similars...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (similarActions.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        {hasHighSimilarity && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Atenció:</strong> S'han detectat accions molt similars (&gt;80%). 
              Revisa aquestes accions abans de continuar.
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Lightbulb className="w-5 h-5" />
                Accions similars detectades ({similarActions.length})
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={onClearDetection}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {similarActions.map((similar) => (
              <Card key={similar.action.id} className="border-l-4 border-l-orange-400">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {similar.action.title}
                          </h4>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSimilarityColor(similar.similarity)}`}>
                            {getSimilarityIcon(similar.similarity)}
                            {similar.similarity}%
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Codi:</span> {similar.action.id}
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setPreviewActionId(similar.action.id)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Veure
                      </Button>
                    </div>

                    {/* Similituds detectades */}
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-xs font-medium text-blue-800 mb-2">Similituds detectades:</p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {similar.reasons.map((reason, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-blue-500 mt-0.5">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <ActionPreviewDialog
        open={!!previewActionId}
        onOpenChange={(open) => !open && setPreviewActionId(null)}
        actionId={previewActionId}
      />
    </>
  );
};

export default SimilarActionsPanel;
