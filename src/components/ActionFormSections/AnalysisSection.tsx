
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Search, Clock, User, Sparkles, Loader2 } from 'lucide-react';
import { CorrectiveAction } from '@/types';
import { useGeminiSuggestions } from '@/hooks/useGeminiSuggestions';
import GeminiApiKeyDialog from '@/components/GeminiApiKeyDialog';

interface AnalysisSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const AnalysisSection = ({ action, onUpdate, readOnly = false }: AnalysisSectionProps) => {
  const [rootCauses, setRootCauses] = React.useState(action.analysisData?.rootCauses || '');
  const [proposedAction, setProposedAction] = React.useState(action.analysisData?.proposedAction || '');
  const [showApiKeyDialog, setShowApiKeyDialog] = React.useState(false);
  
  const { generateSuggestion, isLoading, error } = useGeminiSuggestions();

  const handleSave = () => {
    onUpdate({
      analysisData: {
        ...action.analysisData,
        rootCauses,
        proposedAction,
        analysisDate: new Date().toISOString(),
        analysisBy: 'current-user'
      }
    });
  };

  const handleGenerateSuggestion = async () => {
    try {
      const suggestion = await generateSuggestion({
        action,
        rootCauses: rootCauses.trim() || undefined
      });
      setProposedAction(suggestion);
    } catch (err) {
      if (err instanceof Error && err.message.includes('clau d\'API')) {
        setShowApiKeyDialog(true);
      }
      console.error('Error generating suggestion:', err);
    }
  };

  const isFormValid = rootCauses.trim() && proposedAction.trim();
  const isComplete = action.analysisData?.rootCauses && action.analysisData?.proposedAction;
  const hasChanges = rootCauses !== (action.analysisData?.rootCauses || '') || 
                     proposedAction !== (action.analysisData?.proposedAction || '');

  return (
    <>
      <Card className={`${readOnly ? 'bg-gray-50' : ''} ${isComplete ? 'border-green-200' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Anàlisi de les Causes
              {isComplete && <div className="ml-2 w-2 h-2 bg-green-500 rounded-full"></div>}
            </div>
            {readOnly && action.analysisData?.analysisDate && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(action.analysisData.analysisDate).toLocaleDateString('ca-ES')}
                <User className="w-4 h-4 ml-2 mr-1" />
                {action.analysisData.analysisBy}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rootCauses">Anàlisi de les causes arrel</Label>
            <Textarea
              id="rootCauses"
              value={rootCauses}
              onChange={(e) => setRootCauses(e.target.value)}
              placeholder="Identificar i analitzar les causes que han originat la situació..."
              rows={4}
              disabled={readOnly}
              className={readOnly ? 'bg-gray-100' : ''}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="proposedAction">Acció proposada</Label>
              {!readOnly && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateSuggestion}
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  Suggerir amb IA
                </Button>
              )}
            </div>
            <Textarea
              id="proposedAction"
              value={proposedAction}
              onChange={(e) => setProposedAction(e.target.value)}
              placeholder="Descriure l'acció correctiva proposada per solucionar el problema..."
              rows={4}
              disabled={readOnly}
              className={readOnly ? 'bg-gray-100' : ''}
            />
            {error && (
              <p className="text-sm text-red-600 mt-1">
                Error: {error}
              </p>
            )}
          </div>
          {!readOnly && (
            <Button onClick={handleSave} disabled={!isFormValid || !hasChanges}>
              Guardar Anàlisi
            </Button>
          )}
        </CardContent>
      </Card>

      <GeminiApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onApiKeySet={() => {
          setShowApiKeyDialog(false);
          handleGenerateSuggestion();
        }}
      />
    </>
  );
};

export default AnalysisSection;
