
import { useState, useEffect } from 'react';
import { getFullEndpointUrl } from '@/config/api';

interface Centre {
  id: string;
  name: string;
  code: string;
  active: boolean;
  type: 'hospital' | 'cap' | 'clinic';
  allowedRoles: string[];
}

interface UseCentresResponse {
  centres: Centre[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useCentres = (userRoles: string[] = []): UseCentresResponse => {
  const [centres, setCentres] = useState<Centre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCentres = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpointUrl = getFullEndpointUrl('centres');
      
      try {
        // Intentar crida real a l'API
        const response = await fetch(endpointUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          // Filtrar centres segons els rols de l'usuari
          const filteredCentres = data.centres.filter((centre: Centre) => {
            if (userRoles.includes('direccio-qualitat')) {
              return centre.active;
            }
            return centre.active && centre.allowedRoles.some(role => userRoles.includes(role));
          });

          setCentres(filteredCentres);
          return;
        }
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError);
      }

      // Fallback a mock response
      const mockResponse = {
        centres: [
          {
            id: '001',
            name: 'Hospital Central Barcelona',
            code: 'HCB',
            active: true,
            type: 'hospital' as const,
            allowedRoles: ['direccio-qualitat', 'director-centre', 'gerencia']
          },
          {
            id: '002', 
            name: 'Hospital de Coslada',
            code: 'HCS',
            active: true,
            type: 'hospital' as const,
            allowedRoles: ['direccio-qualitat', 'director-centre']
          },
          {
            id: '003',
            name: '4104 Sevilla-Cartuja',
            code: 'SVL',
            active: true,
            type: 'hospital' as const,
            allowedRoles: ['direccio-qualitat', 'director-centre']
          },
          {
            id: '004',
            name: 'CAP Gràcia',
            code: 'CGR',
            active: true,
            type: 'cap' as const,
            allowedRoles: ['direccio-qualitat', 'responsable-cap']
          },
          {
            id: '005',
            name: 'CAP Sant Martí',
            code: 'CSM',
            active: true,
            type: 'cap' as const,
            allowedRoles: ['direccio-qualitat', 'responsable-cap']
          }
        ]
      };

      // Simular delay de xarxa
      await new Promise(resolve => setTimeout(resolve, 300));

      // Filtrar centres segons els rols de l'usuari
      const filteredCentres = mockResponse.centres.filter(centre => {
        if (userRoles.includes('direccio-qualitat')) {
          return centre.active;
        }
        return centre.active && centre.allowedRoles.some(role => userRoles.includes(role));
      });

      setCentres(filteredCentres);
    } catch (err) {
      setError('Error carregant centres. Intentant amb dades locals...');
      console.error('Error fetching centres:', err);
      
      // Fallback amb dades per defecte
      setCentres([
        {
          id: 'fallback',
          name: 'Hospital Central Barcelona',
          code: 'HCB',
          active: true,
          type: 'hospital',
          allowedRoles: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentres();
  }, [JSON.stringify(userRoles)]);

  return {
    centres,
    loading,
    error,
    refetch: fetchCentres
  };
};
