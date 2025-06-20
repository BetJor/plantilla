
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Search, Clock, User, Sparkles, Loader2 } from 'lucide-react';
import { CorrectiveAction, ProposedActionItem } from '@/types';
import { useGeminiSuggestions } from '@/hooks/useGeminiSuggestions';
import GeminiApiKeyDialog from '@/components/GeminiApiKeyDialog';
import ProposedActionsList from './ProposedActionsList';

interface AnalysisSectionProps {
  action: CorrectiveAction;
  onUpdate: (updates: Partial<CorrectiveAction>) => void;
  readOnly?: boolean;
}

const AnalysisSection = ({ action, onUpdate, readOnly = false }: AnalysisSectionProps) => {
  const [rootCauses, setRootCauses] = React.useState(action.analysisData?.rootCauses || '');
  const [showApiKeyDialog, setShowApiKeyDialog] = React.useState(false);
  
  const { generateSuggestion, isLoading, error } = useGeminiSuggestions();

  // Migrar dades existents de proposedAction a proposedActions si cal
  const proposedActions = React.useMemo(() => {
    if (action.analysisData?.proposedActions) {
      return action.analysisData.proposedActions;
    }
    
    // Migrar dada antiga si existeix
    if (action.analysisData?.proposedAction) {
      return [{
        id: '1',
        description: action.analysisData.proposedAction,
        assignedTo: action.assignedTo || '',
        dueDate: action.dueDate || '',
        status: 'pending' as const
      }];
    }
    
    return [];
  }, [action.analysisData, action.assignedTo, action.dueDate]);

  const handleSave = () => {
    onUpdate({
      analysisData: {
        ...action.analysisData,
        rootCauses,
        proposedActions,
        analysisDate: new Date().toISOString(),
        analysisBy: 'current-user',
        signedBy: 'current-user',
        signedAt: new Date().toISOString()
      }
    });
  };

  const handleProposedActionsChange = (newActions: ProposedActionItem[]) => {
    onUpdate({
      analysisData: {
        ...action.analysisData,
        rootCauses,
        proposedActions: newActions,
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
      
      // Generar una acció automàticament amb la suggerència
      const newAction: ProposedActionItem = {
        id: Date.now().toString(),
        description: suggestion,
        assignedTo: action.assignedTo || '',
        dueDate: action.dueDate || '',
        status: 'pending'
      };
      
      handleProposedActionsChange([...proposedActions, newAction]);
    } catch (err) {
      if (err instanceof Error && err.message.includes('clau d\'API')) {
        setShowApiKeyDialog(true);
      }
      console.error('Error generating suggestion:', err);
    }
  };

  const isFormValid = rootCauses.trim() && proposedActions.length > 0;
  const isComplete = action.analysisData?.rootCauses && (action.analysisData?.proposedActions?.length > 0 || action.analysisData?.proposedAction);
  const hasChanges = rootCauses !== (action.analysisData?.rootCauses || '') || 
                     JSON.stringify(proposedActions) !== JSON.stringify(action.analysisData?.proposedActions || []);

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
        <CardContent className="space-y-6">
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
            <div className="flex items-center justify-between mb-4">
              <Label>Accions proposades</Label>
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
                  Generar amb IA
                </Button>
              )}
            </div>
            
            <ProposedActionsList
              actions={proposedActions}
              onChange={handleProposedActionsChange}
              readOnly={readOnly}
            />
            
            {error && (
              <p className="text-sm text-red-600 mt-2">
                Error: {error}
              </p>
            )}
          </div>

          {readOnly && action.analysisData?.signedBy && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center text-sm text-blue-700">
                <User className="w-4 h-4 mr-1" />
                <span className="font-medium">Signat per:</span>
                <span className="ml-1">{action.analysisData.signedBy}</span>
                {action.analysisData.signedAt && (
                  <>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>{new Date(action.analysisData.signedAt).toLocaleString('ca-ES')}</span>
                  </>
                )}
              </div>
            </div>
          )}
          
          {!readOnly && (
            <Button onClick={handleSave} disabled={!isFormValid || !hasChanges}>
              Guardar i Signar Anàlisi
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
