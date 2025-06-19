
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { TestTube, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import TestingSuite from '@/components/TestingSuite';

const Testing = () => {
  // Millor detecció del mode desenvolupament
  const isDevelopment = import.meta.env.DEV || 
                       import.meta.env.MODE === 'development' || 
                       window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';
  
  console.log('Testing page - Mode desenvolupament:', isDevelopment, {
    'import.meta.env.DEV': import.meta.env.DEV,
    'import.meta.env.MODE': import.meta.env.MODE,
    'hostname': window.location.hostname
  });

  if (!isDevelopment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Accés Restringit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Aquesta pàgina només està disponible en mode desenvolupament.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TestTube className="w-8 h-8 text-blue-600" />
            Testing Suite
          </h1>
          <p className="text-gray-600">Joc de proves per la funcionalitat d'accions similars</p>
        </div>
        <Badge variant="destructive">Mode Desenvolupament</Badge>
      </div>

      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Atenció:</strong> Aquesta pàgina és només per testing. Les dades carregades són de prova i poden modificar el contingut de l'aplicació.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Documentació del Joc de Proves
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Objectius del Testing
              </h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Verificar detecció d'accions similars</li>
                <li>• Validar percentatges de similitud</li>
                <li>• Provar diferents escenaris de dades</li>
                <li>• Assegurar robustesa de l'algoritme</li>
                <li>• Detectar errors en casos extrems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <TestTube className="w-4 h-4 text-blue-600" />
                Tipus de Tests
              </h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• <strong>Similitud Alta (&gt;80%):</strong> Accions pràcticament idèntiques</li>
                <li>• <strong>Similitud Mitjana (40-80%):</strong> Accions relacionades</li>
                <li>• <strong>Similitud Baixa (&lt;40%):</strong> Accions diferents</li>
                <li>• <strong>Casos Extrems:</strong> Dades mínimes, errors</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Casos de Prova Inclosos:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>Higiene Quirúrgica</strong>
                <p className="text-gray-600">3 accions similars sobre protocols d'higiene en quiròfan</p>
              </div>
              <div>
                <strong>Incidents Tecnològics</strong>
                <p className="text-gray-600">2 accions sobre fallades de sistemes informàtics</p>
              </div>
              <div>
                <strong>Formació Personal</strong>
                <p className="text-gray-600">2 accions sobre mancances de formació</p>
              </div>
              <div>
                <strong>Errors Medicació</strong>
                <p className="text-gray-600">2 accions sobre errors en dispensació</p>
              </div>
              <div>
                <strong>Millores Infraestructura</strong>
                <p className="text-gray-600">2 accions sobre millores d'equipament</p>
              </div>
              <div>
                <strong>Casos Extrems</strong>
                <p className="text-gray-600">1 acció amb dades mínimes per provar robustesa</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <TestingSuite />
    </div>
  );
};

export default Testing;
