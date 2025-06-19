
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface SimilarAction {
  action: {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    centre: string;
    department: string;
    dueDate: string;
    createdAt: string;
  };
  similarity: number;
  reasons: string[];
}

interface SimilarActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  similarActions: SimilarAction[];
  isLoading: boolean;
}

const SimilarActionsDialog = ({ 
  open, 
  onOpenChange, 
  similarActions, 
  isLoading 
}: SimilarActionsDialogProps) => {
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
    if (similarity >= 80) return 'text-red-600 bg-red-50';
    if (similarity >= 60) return 'text-orange-600 bg-orange-50';
    if (similarity >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getSimilarityIcon = (similarity: number) => {
    if (similarity >= 80) return <AlertTriangle className="w-4 h-4" />;
    if (similarity >= 60) return <AlertTriangle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  // Determinar el títol, descripció i icona segons els resultats
  const hasResults = !isLoading && similarActions.length > 0;
  const noResults = !isLoading && similarActions.length === 0;

  const getDialogTitle = () => {
    if (hasResults) {
      return "Accions Correctives Similars Detectades";
    }
    if (noResults) {
      return "Cap Acció Similar Trobada";
    }
    return "Cercant Accions Similars";
  };

  const getDialogDescription = () => {
    if (hasResults) {
      return "S'han trobat accions correctives existents que poden estar relacionades amb aquesta nova acció. Revisa-les per evitar duplicació d'esforços o per aprofitar solucions anteriors.";
    }
    if (noResults) {
      return "No s'han trobat accions correctives similars a aquesta nova acció. Pots continuar amb la creació sense preocupacions de duplicació.";
    }
    return "S'estan analitzant les accions existents per trobar possibles similituds...";
  };

  const getTitleIcon = () => {
    if (hasResults) {
      return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
    if (noResults) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTitleIcon()}
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">Cercant accions similars...</p>
            </div>
          )}

          {!isLoading && similarActions.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No s'han trobat accions similars. Pots continuar amb la creació.</p>
            </div>
          )}

          {!isLoading && similarActions.length > 0 && (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-medium text-yellow-800">
                    S'han trobat {similarActions.length} acció{similarActions.length > 1 ? 's' : ''} similar{similarActions.length > 1 ? 's' : ''}
                  </h3>
                </div>
                <p className="text-yellow-700 text-sm">
                  Revisa aquestes accions abans de continuar per evitar duplicació d'esforços.
                </p>
              </div>

              <div className="space-y-3">
                {similarActions.map((similar, index) => (
                  <Card key={similar.action.id} className="border-l-4 border-l-orange-400">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-3">
                            {similar.action.title}
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSimilarityColor(similar.similarity)}`}>
                              {getSimilarityIcon(similar.similarity)}
                              {similar.similarity}% similar
                            </div>
                          </CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>{similar.action.centre}</span>
                            <span>•</span>
                            <span>{similar.action.department}</span>
                            <Badge variant={getStatusVariant(similar.action.status)}>
                              {similar.action.status}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/actions/${similar.action.id}`}>
                            <Eye className="w-4 h-4 mr-1" />
                            Veure
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {similar.action.description}
                      </p>
                      <div className="bg-blue-50 rounded p-3">
                        <h4 className="font-medium text-blue-800 mb-2">Raons de similitud:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {similar.reasons.map((reason, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-500 mt-1">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          {hasResults ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Continuar igualment
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Entesos, revisar primer
              </Button>
            </>
          ) : (
            <Button onClick={() => onOpenChange(false)}>
              Entesos
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimilarActionsDialog;
