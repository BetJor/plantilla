
export interface ApiConfig {
  baseUrl: string;
  endpoints: {
    centres: string;
    users: string;
    actions: string;
  };
  timeout: number;
  retries: number;
}

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: 'https://api.salut.cat',
  endpoints: {
    centres: '/api/centres',
    users: '/api/users',
    actions: '/api/actions'
  },
  timeout: 5000,
  retries: 3
};

const API_CONFIG_KEY = 'api-config';

export const getApiConfig = (): ApiConfig => {
  const stored = localStorage.getItem(API_CONFIG_KEY);
  if (stored) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    } catch (error) {
      console.error('Error parsing API config:', error);
    }
  }
  return DEFAULT_CONFIG;
};

export const saveApiConfig = (config: Partial<ApiConfig>): void => {
  const currentConfig = getApiConfig();
  const newConfig = { ...currentConfig, ...config };
  localStorage.setItem(API_CONFIG_KEY, JSON.stringify(newConfig));
};

export const resetApiConfig = (): void => {
  localStorage.removeItem(API_CONFIG_KEY);
};

export const getFullEndpointUrl = (endpoint: keyof ApiConfig['endpoints']): string => {
  const config = getApiConfig();
  return `${config.baseUrl}${config.endpoints[endpoint]}`;
};

export const testEndpointConnectivity = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    console.error('Endpoint connectivity test failed:', error);
    return false;
  }
};
