import { CorrectiveAction } from '@/types';
import { TEST_ACTIONS } from '@/data/testData';

export interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

export interface SimilarityTestResult {
  testCaseId: string;
  testCaseName: string;
  foundActions: number;
  expectedMinActions: number;
  highestSimilarity: number;
  expectedMinSimilarity: number;
  matchedExpectedActions: string[];
  allFoundActions: Array<{
    actionId: string;
    similarity: number;
    title: string;
  }>;
  passed: boolean;
  issues: string[];
}

// Clau corregida per coincidir amb useCorrectiveActions
const STORAGE_KEY = 'corrective-actions-data';

// Simular resposta de IA per proves offline
export const mockSimilarityResponse = (testAction: any, availableActions: CorrectiveAction[]) => {
  const results = [];
  
  for (const action of availableActions) {
    let similarity = 0;
    const reasons = [];

    // Similitud per tipus i categoria (25%)
    if (action.type === testAction.type) {
      similarity += 25;
      reasons.push(`Mateix tipus: ${action.type}`);
    }
    if (action.category === testAction.category) {
      similarity += 25;
      reasons.push(`Mateixa categoria: ${action.category}`);
    }

    // Similitud per centre i departament (20%)
    if (action.centre === testAction.centre) {
      similarity += 10;
      reasons.push(`Mateix centre: ${action.centre}`);
    }
    if (action.department === testAction.department) {
      similarity += 10;
      reasons.push(`Mateix departament: ${action.department}`);
    }

    // Similitud de títol (15%) - cerca paraules comunes
    const titleWords1 = testAction.title.toLowerCase().split(' ');
    const titleWords2 = action.title.toLowerCase().split(' ');
    const commonTitleWords = titleWords1.filter(word => 
      titleWords2.some(w => w.includes(word) || word.includes(w))
    );
    const titleSimilarity = (commonTitleWords.length / Math.max(titleWords1.length, titleWords2.length)) * 15;
    similarity += titleSimilarity;
    if (titleSimilarity > 5) {
      reasons.push(`Títols similars (${Math.round(titleSimilarity)}%)`);
    }

    // Similitud de descripció (40%) - cerca paraules clau
    const descWords1 = testAction.description.toLowerCase().split(' ');
    const descWords2 = action.description.toLowerCase().split(' ');
    const commonDescWords = descWords1.filter(word => 
      word.length > 3 && descWords2.some(w => w.includes(word) || word.includes(w))
    );
    const descSimilarity = (commonDescWords.length / Math.max(descWords1.length, descWords2.length)) * 40;
    similarity += descSimilarity;
    if (descSimilarity > 10) {
      reasons.push(`Descripció similar (${Math.round(descSimilarity)}%)`);
    }

    // Només incloure si similitud >= 30%
    if (similarity >= 30) {
      results.push({
        action,
        similarity: Math.round(similarity),
        reasons
      });
    }
  }

  return results.sort((a, b) => b.similarity - a.similarity);
};

// Validar resultats de similitud
export const validateSimilarityResults = (
  testCase: any,
  actualResults: any[]
): SimilarityTestResult => {
  const issues: string[] = [];
  const foundActionsCount = actualResults.length;
  const expectedMinActions = testCase.expectedResults.minSimilarActions;
  const expectedMinSimilarity = testCase.expectedResults.minSimilarityScore;
  const expectedHighSimilarity = testCase.expectedResults.expectedHighSimilarity || [];

  // Verificar nombre mínim d'accions trobades
  if (foundActionsCount < expectedMinActions) {
    issues.push(`Nombre d'accions insuficient: trobades ${foundActionsCount}, esperades mínim ${expectedMinActions}`);
  }

  // Verificar similitud mínima
  const highestSimilarity = actualResults.length > 0 ? Math.max(...actualResults.map(r => r.similarity)) : 0;
  if (highestSimilarity < expectedMinSimilarity) {
    issues.push(`Similitud insuficient: màxima ${highestSimilarity}%, esperada mínim ${expectedMinSimilarity}%`);
  }

  // Verificar accions específiques esperades
  const foundActionIds = actualResults.map(r => r.action.id);
  const matchedExpectedActions = expectedHighSimilarity.filter(id => foundActionIds.includes(id));
  
  if (expectedHighSimilarity.length > 0 && matchedExpectedActions.length === 0) {
    issues.push(`Cap acció esperada trobada. Esperades: ${expectedHighSimilarity.join(', ')}`);
  }

  return {
    testCaseId: testCase.id,
    testCaseName: testCase.name,
    foundActions: foundActionsCount,
    expectedMinActions,
    highestSimilarity,
    expectedMinSimilarity,
    matchedExpectedActions,
    allFoundActions: actualResults.map(r => ({
      actionId: r.action.id,
      similarity: r.similarity,
      title: r.action.title
    })),
    passed: issues.length === 0,
    issues
  };
};

// Carregar dades de prova al localStorage
export const loadTestData = (): TestResult => {
  try {
    console.log('loadTestData: Iniciant càrrega de dades de prova...');
    console.log('loadTestData: Utilitzant clau localStorage:', STORAGE_KEY);
    
    const existingActionsString = localStorage.getItem(STORAGE_KEY) || '[]';
    console.log('loadTestData: Dades existents al localStorage:', existingActionsString.substring(0, 100) + '...');
    
    const existingActions = JSON.parse(existingActionsString);
    console.log('loadTestData: Accions existents parsejades:', existingActions.length);
    
    // Filtrar accions de test que no existeixen ja
    const testActions = TEST_ACTIONS.filter(action => 
      !existingActions.some((existing: CorrectiveAction) => existing.id === action.id)
    );
    
    console.log('loadTestData: Accions de test disponibles:', TEST_ACTIONS.length);
    console.log('loadTestData: Accions de test a afegir:', testActions.length);
    console.log('loadTestData: IDs de test a afegir:', testActions.map(a => a.id));
    
    const updatedActions = [...existingActions, ...testActions];
    const updatedActionsString = JSON.stringify(updatedActions);
    
    localStorage.setItem(STORAGE_KEY, updatedActionsString);
    console.log('loadTestData: Dades guardades al localStorage amb clau:', STORAGE_KEY);
    console.log('loadTestData: Total accions guardades:', updatedActions.length);
    
    return {
      success: true,
      message: `S'han carregat ${testActions.length} accions de prova. Total accions: ${updatedActions.length}`,
      details: { addedActions: testActions.length, totalActions: updatedActions.length }
    };
  } catch (error) {
    console.error('loadTestData: Error carregant dades de prova:', error);
    return {
      success: false,
      message: `Error carregant dades de prova: ${error}`,
      details: error
    };
  }
};

// Netejar dades de prova
export const clearTestData = (): TestResult => {
  try {
    console.log('clearTestData: Iniciant neteja de dades de prova...');
    console.log('clearTestData: Utilitzant clau localStorage:', STORAGE_KEY);
    
    const existingActionsString = localStorage.getItem(STORAGE_KEY) || '[]';
    const existingActions = JSON.parse(existingActionsString);
    console.log('clearTestData: Accions existents abans de netejar:', existingActions.length);
    
    const nonTestActions = existingActions.filter((action: CorrectiveAction) => 
      !action.id.startsWith('test-')
    );
    
    console.log('clearTestData: Accions que es mantenen:', nonTestActions.length);
    console.log('clearTestData: Accions eliminades:', existingActions.length - nonTestActions.length);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nonTestActions));
    console.log('clearTestData: Neteja completada, dades guardades amb clau:', STORAGE_KEY);
    
    return {
      success: true,
      message: `S'han eliminat les dades de prova. Accions restants: ${nonTestActions.length}`,
      details: { removedActions: existingActions.length - nonTestActions.length }
    };
  } catch (error) {
    console.error('clearTestData: Error eliminant dades de prova:', error);
    return {
      success: false,
      message: `Error eliminant dades de prova: ${error}`,
      details: error
    };
  }
};
