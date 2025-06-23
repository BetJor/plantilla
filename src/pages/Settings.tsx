import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Mail, Key, Sparkles, Globe, RefreshCw } from 'lucide-react';
import { getApiConfig, saveApiConfig, resetApiConfig, testEndpointConnectivity, getFullEndpointUrl } from '@/config/api';
import type { ApiConfig } from '@/config/api';
import GeminiApiKeyDialog from '@/components/GeminiApiKeyDialog';

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    organizationName: 'Servei Català de la Salut',
    contactEmail: 'admin@salut.cat',
    defaultLanguage: 'ca',
    timezone: 'Europe/Madrid'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    overdueReminders: true,
    weeklyReports: true,
    systemAlerts: true
  });

  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(!!localStorage.getItem('gemini-api-key'));

  // Nou estat per la configuració d'APIs
  const [apiConfig, setApiConfig] = useState<ApiConfig>(getApiConfig());
  const [connectivityStatus, setConnectivityStatus] = useState<Record<string, boolean>>({});
  const [testingConnectivity, setTestingConnectivity] = useState(false);

  useEffect(() => {
    setApiConfig(getApiConfig());
  }, []);

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('General settings saved:', generalSettings);
    // Aquí s'enviaria la configuració al backend
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Notification settings saved:', notificationSettings);
    // Aquí s'enviaria la configuració al backend
  };

  const handleApiKeySet = () => {
    setHasGeminiKey(true);
  };

  const clearGeminiKey = () => {
    localStorage.removeItem('gemini-api-key');
    setHasGeminiKey(false);
  };

  const handleApiConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiConfig(apiConfig);
    console.log('API configuration saved:', apiConfig);
  };

  const handleResetApiConfig = () => {
    resetApiConfig();
    setApiConfig(getApiConfig());
    setConnectivityStatus({});
  };

  const testAllEndpoints = async () => {
    setTestingConnectivity(true);
    const status: Record<string, boolean> = {};
    
    for (const endpoint of Object.keys(apiConfig.endpoints) as Array<keyof ApiConfig['endpoints']>) {
      const url = getFullEndpointUrl(endpoint);
      status[endpoint] = await testEndpointConnectivity(url);
    }
    
    setConnectivityStatus(status);
    setTestingConnectivity(false);
  };

  const updateApiConfig = (field: keyof ApiConfig | string, value: string) => {
    if (field === 'baseUrl') {
      setApiConfig(prev => ({ ...prev, baseUrl: value }));
    } else if (field.startsWith('endpoint.')) {
      const endpointKey = field.split('.')[1] as keyof ApiConfig['endpoints'];
      setApiConfig(prev => ({
        ...prev,
        endpoints: { ...prev.endpoints, [endpointKey]: value }
      }));
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configuració</h1>
            <p className="text-gray-600">Gestiona la configuració del sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Configuració General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="organizationName">Nom de l'Organització</Label>
                  <Input
                    id="organizationName"
                    value={generalSettings.organizationName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, organizationName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Correu de Contacte</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultLanguage">Idioma per Defecte</Label>
                  <Input
                    id="defaultLanguage"
                    value={generalSettings.defaultLanguage}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, defaultLanguage: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Zona Horària</Label>
                  <Input
                    id="timezone"
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Configuració General
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificacions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationSubmit} className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications">Notificacions per Correu</Label>
                    <input
                      id="emailNotifications"
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="overdueReminders">Recordatoris de Venciment</Label>
                    <input
                      id="overdueReminders"
                      type="checkbox"
                      checked={notificationSettings.overdueReminders}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, overdueReminders: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weeklyReports">Informes Setmanals</Label>
                    <input
                      id="weeklyReports"
                      type="checkbox"
                      checked={notificationSettings.weeklyReports}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="systemAlerts">Alertes del Sistema</Label>
                    <input
                      id="systemAlerts"
                      type="checkbox"
                      checked={notificationSettings.systemAlerts}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, systemAlerts: e.target.checked })}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Preferències
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Nova secció per configuració d'APIs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Configuració d'APIs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApiConfigSubmit} className="space-y-4">
              <div>
                <Label htmlFor="baseUrl">URL Base de l'API</Label>
                <Input
                  id="baseUrl"
                  value={apiConfig.baseUrl}
                  onChange={(e) => updateApiConfig('baseUrl', e.target.value)}
                  placeholder="https://api.salut.cat"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="centresEndpoint">Endpoint Centres</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="centresEndpoint"
                      value={apiConfig.endpoints.centres}
                      onChange={(e) => updateApiConfig('endpoint.centres', e.target.value)}
                      placeholder="/api/centres"
                    />
                    {connectivityStatus.centres !== undefined && (
                      <div className={`w-3 h-3 rounded-full ${connectivityStatus.centres ? 'bg-green-500' : 'bg-red-500'}`} />
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="usersEndpoint">Endpoint Usuaris</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="usersEndpoint"
                      value={apiConfig.endpoints.users}
                      onChange={(e) => updateApiConfig('endpoint.users', e.target.value)}
                      placeholder="/api/users"
                    />
                    {connectivityStatus.users !== undefined && (
                      <div className={`w-3 h-3 rounded-full ${connectivityStatus.users ? 'bg-green-500' : 'bg-red-500'}`} />
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="actionsEndpoint">Endpoint Accions</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="actionsEndpoint"
                      value={apiConfig.endpoints.actions}
                      onChange={(e) => updateApiConfig('endpoint.actions', e.target.value)}
                      placeholder="/api/actions"
                    />
                    {connectivityStatus.actions !== undefined && (
                      <div className={`w-3 h-3 rounded-full ${connectivityStatus.actions ? 'bg-green-500' : 'bg-red-500'}`} />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Configuració d'APIs
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={testAllEndpoints}
                  disabled={testingConnectivity}
                >
                  {testingConnectivity ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Globe className="w-4 h-4 mr-2" />
                  )}
                  Provar Connexió
                </Button>
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={handleResetApiConfig}
                >
                  Restaurar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Intel·ligència Artificial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Configuració de Gemini AI</h3>
                <p className="text-gray-600 mb-4">
                  Configura la teva clau API de Google Gemini per generar suggeriments intel·ligents d'accions correctives.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    <span className="text-sm">
                      {hasGeminiKey ? 'Clau API configurada' : 'Clau API no configurada'}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKeyDialog(true)}
                    >
                      {hasGeminiKey ? 'Modificar Clau' : 'Configurar Clau'}
                    </Button>
                    {hasGeminiKey && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={clearGeminiKey}
                      >
                        Esborrar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Seguretat i Permisos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Configuració de Permisos</h3>
                <p className="text-gray-600 mb-4">Defineix els permisos per a cada rol d'usuari</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Administradors</Label>
                    <p className="text-sm text-gray-600">Accés complet a totes les funcionalitats</p>
                  </div>
                  <div>
                    <Label>Supervisors</Label>
                    <p className="text-sm text-gray-600">Gestió d'accions del seu centre</p>
                  </div>
                  <div>
                    <Label>Usuaris de Centre</Label>
                    <p className="text-sm text-gray-600">Creació i seguiment d'accions assignades</p>
                  </div>
                  <div>
                    <Label>Qualitat</Label>
                    <p className="text-sm text-gray-600">Revisió i aprovació d'accions</p>
                  </div>
                </div>
              </div>
              <Button variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Configurar Permisos Detallats
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Plantilles de Correu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reminderTemplate">Plantilla de Recordatori</Label>
                <Textarea
                  id="reminderTemplate"
                  placeholder="Plantilla per als recordatoris de venciment d'accions..."
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="completionTemplate">Plantilla de Compleció</Label>
                <Textarea
                  id="completionTemplate"
                  placeholder="Plantilla quan es completa una acció..."
                  className="mt-2"
                />
              </div>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Guardar Plantilles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <GeminiApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onApiKeySet={handleApiKeySet}
      />
    </>
  );
};

export default Settings;
