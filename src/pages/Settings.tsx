
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Bell, Shield, Database, Info, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [systemMaintenance, setSystemMaintenance] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSaveSettings = () => {
    toast({
      title: "Configuració guardada",
      description: "Els canvis s'han aplicat correctament."
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuració</h1>
        <p className="text-muted-foreground">
          Gestiona la configuració del sistema i les preferències d'usuari
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notificacions</TabsTrigger>
          <TabsTrigger value="security">Seguretat</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuració General
              </CardTitle>
              <CardDescription>
                Configuració bàsica del sistema i preferències generals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Nom de l'Aplicació</Label>
                  <Input id="app-name" defaultValue="Portal de Gestió" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organització</Label>
                  <Input id="organization" defaultValue="La meva Empresa" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripció del Sistema</Label>
                <Textarea 
                  id="description" 
                  defaultValue="Sistema de gestió integral per a l'organització"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="ca">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ca">Català</SelectItem>
                    <SelectItem value="es">Castellà</SelectItem>
                    <SelectItem value="en">Anglès</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Configuració
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Configuració de Notificacions
              </CardTitle>
              <CardDescription>
                Gestiona les preferències de notificacions del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Notificacions per correu</div>
                  <div className="text-sm text-muted-foreground">
                    Rebre notificacions importants per correu electrònic
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Notificacions push</div>
                  <div className="text-sm text-muted-foreground">
                    Rebre notificacions push al navegador
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correu de notificacions</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue="usuari@example.com"
                  className="max-w-sm"
                />
              </div>

              <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Notificacions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuració de Seguretat
              </CardTitle>
              <CardDescription>
                Gestiona la seguretat i els permisos del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Contrasenya actual</Label>
                <Input id="current-password" type="password" className="max-w-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova contrasenya</Label>
                <Input id="new-password" type="password" className="max-w-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contrasenya</Label>
                <Input id="confirm-password" type="password" className="max-w-sm" />
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  La contrasenya ha de tenir almenys 8 caràcters i contenir lletres i números.
                </AlertDescription>
              </Alert>

              <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Actualitzar Contrasenya
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Configuració del Sistema
              </CardTitle>
              <CardDescription>
                Configuració avançada i manteniment del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">Mode manteniment</div>
                  <div className="text-sm text-muted-foreground">
                    Activar el mode manteniment del sistema
                  </div>
                </div>
                <Switch
                  checked={systemMaintenance}
                  onCheckedChange={setSystemMaintenance}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">Clau API</Label>
                <div className="flex gap-2 max-w-md">
                  <Input 
                    id="api-key" 
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Introdueix la clau API"
                  />
                  <Button variant="outline" size="sm">
                    Generar
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-base font-medium">Estat del Sistema</div>
                <div className="grid gap-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Base de dades</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Connectada</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Servei d'API</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Actiu</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">Còpies de seguretat</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Actualitzades</Badge>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveSettings} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Aplicar Configuració
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
