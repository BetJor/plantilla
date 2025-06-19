
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Database, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  TestTube
} from 'lucide-react';
import { useSimilarActions } from '@/hooks/useSimilarActions';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { TEST_CASES } from '@/data/testData';
import { 
  loadTestData, 
  clearTestData, 
  validateSimilarityResults, 
  mockSimilarityResponse,
  SimilarityTestResult 
} from '@/utils/testUtils';

const TestingSuite = () => {
  const [testResults, setTestResults] = useState<SimilarityTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [useRealAI, setUseRealAI] = useState(false);
  const [dataLoadResult, setDataLoadResult] = useState<any>(null);
  
  const { findSimilarActions, isLoading } = useSimilarActions();
  const { actions } = useCorrectiveActions();

  const handleLoadTestData = () => {
    const result = loadTestData();
    setDataLoadResult(result);
    // Forçar recàrrega de la pàgina per veure les noves dades
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleClearTestData = () => {
    const result = clearTestData();
    setDataLoadResult(result);
    // Forçar recàrrega de la pàgina per veure els canvis
    setTimeout(() => window.location.reload(), 1000);
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    const results: SimilarityTestResult[] = [];

    for (const testCase of TEST_CASES) {
      setCurrentTest(testCase.name);
      
      try {
        let similarActions;
        
        if (useRealAI) {
          // Utilitzar IA real
          similarActions = await findSimilarActions(testCase.testAction);
        } else {
          // Utilitzar simulació
          const mockResults = mockSimilarityResponse(testCase.testAction, actions);
          similarActions = mockResults;
        }

        const validationResult = validateSimilarityResults(testCase, similarActions);
        results.push(validationResult);
        
        // Petit delay per veure el progrés
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        results.push({
          testCaseId: testCase.id,
          testCaseName: testCase.name,
          foundActions: 0,
          expectedMinActions: testCase.expectedResults.minSimilarActions,
          highestSimilarity: 0,
          expectedMinSimilarity: testCase.expectedResults.minSimilarityScore,
          matchedExpectedActions: [],
          allFoundActions: [],
          passed: false,
          issues: [`Error executant test: ${error}`]
        });
      }
    }

    setTestResults(results);
    setIsRunningTests(false);
    setCurrentTest('');
  };

  const getTestStatusIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Joc de Proves - Accions Similars
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{actions.length}</div>
              <div className="text-sm text-gray-600">Accions totals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{TEST_CASES.length}</div>
              <div className="text-sm text-gray-600">Casos de prova</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalTests > 0 ? `${passedTests}/${totalTests}` : '0/0'}
              </div>
              <div className="text-sm text-gray-600">Tests passats</div>
            </div>
          </div>

          {dataLoadResult && (
            <Alert className={dataLoadResult.success ? 'border-green-200' : 'border-red-200'}>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{dataLoadResult.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="setup">
        <TabsList>
          <TabsTrigger value="setup">Configuració</TabsTrigger>
          <TabsTrigger value="tests">Executar Tests</TabsTrigger>
          <TabsTrigger value="results">Resultats</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle>Preparació de Dades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={handleLoadTestData} className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Carregar Dades de Prova
                </Button>
                <Button onClick={handleClearTestData} variant="outline" className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Netejar Dades de Prova
                </Button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Instruccions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Carrega les dades de prova per tenir accions de mostra</li>
                  <li>Configura si vols utilitzar IA real o simulació</li>
                  <li>Executa els tests per validar la funcionalitat</li>
                  <li>Revisa els resultats per detectar problemes</li>
                  <li>Neteja les dades quan acabis les proves</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle>Executar Tests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useRealAI}
                    onChange={(e) => setUseRealAI(e.target.checked)}
                  />
                  Utilitzar IA real (Gemini API)
                </label>
                {!useRealAI && (
                  <Badge variant="secondary">Mode simulació</Badge>
                )}
              </div>

              <Button 
                onClick={runAllTests} 
                disabled={isRunningTests || isLoading}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {isRunningTests ? 'Executant Tests...' : 'Executar Tots els Tests'}
              </Button>

              {isRunningTests && (
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    Executant test: {currentTest}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <h4 className="font-medium">Casos de Prova:</h4>
                {TEST_CASES.map((testCase) => (
                  <Card key={testCase.id} className="border-l-4 border-l-blue-400">
                    <CardContent className="pt-4">
                      <h5 className="font-medium">{testCase.name}</h5>
                      <p className="text-sm text-gray-600 mb-2">{testCase.testAction.title}</p>
                      <div className="flex gap-2 text-xs">
                        <Badge variant="outline">
                          Min. accions: {testCase.expectedResults.minSimilarActions}
                        </Badge>
                        <Badge variant="outline">
                          Min. similitud: {testCase.expectedResults.minSimilarityScore}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Resultats dels Tests
                {totalTests > 0 && (
                  <Badge variant={passedTests === totalTests ? "secondary" : "destructive"}>
                    {passedTests}/{totalTests} passats
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <p className="text-gray-600">Encara no s'han executat tests.</p>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <Card key={result.testCaseId} className={`border-l-4 ${result.passed ? 'border-l-green-400' : 'border-l-red-400'}`}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium flex items-center gap-2">
                              {getTestStatusIcon(result.passed)}
                              {result.testCaseName}
                            </h5>
                          </div>
                          <Badge variant={result.passed ? "secondary" : "destructive"}>
                            {result.passed ? 'PASSAT' : 'FALLIT'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-600">Accions trobades:</span>
                            <div className="font-medium">{result.foundActions} (min: {result.expectedMinActions})</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Similitud màxima:</span>
                            <div className="font-medium">{result.highestSimilarity}% (min: {result.expectedMinSimilarity}%)</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Accions esperades:</span>
                            <div className="font-medium">{result.matchedExpectedActions.length}</div>
                          </div>
                        </div>

                        {result.issues.length > 0 && (
                          <Alert className="mb-3">
                            <AlertTriangle className="w-4 h-4" />
                            <AlertDescription>
                              <strong>Problemes detectats:</strong>
                              <ul className="list-disc list-inside mt-1">
                                {result.issues.map((issue, idx) => (
                                  <li key={idx}>{issue}</li>
                                ))}
                              </ul>
                            </AlertDescription>
                          </Alert>
                        )}

                        {result.allFoundActions.length > 0 && (
                          <div>
                            <h6 className="font-medium mb-2">Accions trobades:</h6>
                            <div className="space-y-1">
                              {result.allFoundActions.map((action, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <span className="truncate">{action.title}</span>
                                  <Badge variant="outline">{action.similarity}%</Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingSuite;
