
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Copy,
  UserPlus,
  Lightbulb
} from 'lucide-react';
import { CorrectiveAction } from '@/types';

interface SimilarAction {
  action: CorrectiveAction;
  similarity: number;
  reasons: string[];
}

interface SimilarActionsPanelProps {
  similarActions: SimilarAction[];
  isDetecting: boolean;
  hasHighSimilarity: boolean;
  onJoinAction: (actionId: string) => void;
  onCreateBasedOn: (action: any) => void;
  onClearDetection: () => void;
}

const SimilarActionsPanel = ({ 
  similarActions, 
  isDetecting, 
  hasHighSimilarity,
  onJoinAction,
  onCreateBasedOn,
  onClearDetection
}: SimilarActionsPanelProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Cerrado': return 'secondary';
      case 'Pendiente de Análisis': return 'default';
      case 'Pendiente de Comprobación': return 'default';
      case 'Pendiente de Cierre': return 'destructive';
      default: return 'default';
    }
  };

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
    <div className="space-y-4">
      {hasHighSimilarity && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenció:</strong> S'han detectat accions molt similars (&gt;80%). 
            Considera unir-te a una acció existent abans de crear una de nova.
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
                      <h4 className="font-medium text-gray-900 mb-1">
                        {similar.action.title}
                      </h4>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <span>{similar.action.centre}</span>
                        {similar.action.department && (
                          <>
                            <span>•</span>
                            <span>{similar.action.department}</span>
                          </>
                        )}
                        <Badge variant={getStatusVariant(similar.action.status)} className="text-xs">
                          {similar.action.status}
                        </Badge>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSimilarityColor(similar.similarity)}`}>
                      {getSimilarityIcon(similar.similarity)}
                      {similar.similarity}%
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {similar.action.description}
                  </p>

                  {/* Informació addicional sobre l'estat */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {similar.action.assignedTo}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(similar.action.createdAt).toLocaleDateString('ca-ES')}
                    </div>
                    {similar.action.status === 'Cerrado' && similar.action.closureData?.closureDate && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Tancada {new Date(similar.action.closureData.closureDate).toLocaleDateString('ca-ES')}
                      </div>
                    )}
                  </div>

                  {/* Resolució si està disponible */}
                  {similar.action.closureData?.closureNotes && (
                    <div className="bg-green-50 border border-green-200 rounded p-2">
                      <p className="text-xs text-green-800">
                        <strong>Resolució:</strong> {similar.action.closureData.closureNotes}
                      </p>
                    </div>
                  )}

                  {/* Raons de similitud */}
                  <div className="bg-blue-50 border border-blue-200 rounded p-2">
                    <p className="text-xs font-medium text-blue-800 mb-1">Similituds detectades:</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      {similar.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Accions disponibles */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/actions/${similar.action.id}`}>
                        <Eye className="w-3 h-3 mr-1" />
                        Veure
                      </Link>
                    </Button>
                    
                    {similar.action.status !== 'Cerrado' && similar.action.status !== 'Anulada' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onJoinAction(similar.action.id)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <UserPlus className="w-3 h-3 mr-1" />
                        Unir-se
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onCreateBasedOn(similar.action)}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Basar-se en aquesta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimilarActionsPanel;
