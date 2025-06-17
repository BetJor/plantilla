
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Mail } from 'lucide-react';

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

  return (
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
  );
};

export default Settings;
