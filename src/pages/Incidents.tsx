
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, AlertTriangle, Eye } from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { Incident } from '@/types';

const Incidents = () => {
  const { incidents, addIncident } = useCorrectiveActions();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    origin: 'Auditoria' as const,
    centre: '',
    department: '',
    detectionDate: '',
    severity: 'mitjana' as const
  });

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'crítica': return 'destructive';
      case 'alta': return 'destructive';
      case 'mitjana': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'oberta': return 'destructive';
      case 'en_proces': return 'default';
      case 'tancada': return 'secondary';
      default: return 'default';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIncident({
      ...formData,
      status: 'oberta',
      attachments: [],
      createdBy: 'current-user'
    });
    setFormData({
      title: '',
      description: '',
      origin: 'Auditoria',
      centre: '',
      department: '',
      detectionDate: '',
      severity: 'mitjana'
    });
    setShowCreateForm(false);
  };

  const filteredIncidents = incidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Incidències</h1>
          <p className="text-gray-600">Gestiona les incidències reportades</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Incidència
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nova Incidència</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Títol</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="detectionDate">Data de Detecció</Label>
                  <Input
                    id="detectionDate"
                    type="date"
                    value={formData.detectionDate}
                    onChange={(e) => setFormData({ ...formData, detectionDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="centre">Centre</Label>
                  <Input
                    id="centre"
                    value={formData.centre}
                    onChange={(e) => setFormData({ ...formData, centre: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="department">Departament</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripció</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel·lar
                </Button>
                <Button type="submit">Crear Incidència</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Llistat d'Incidències</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Cercar incidències..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Títol</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Departament</TableHead>
                <TableHead>Severitat</TableHead>
                <TableHead>Estat</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Accions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.title}</TableCell>
                  <TableCell>{incident.centre}</TableCell>
                  <TableCell>{incident.department}</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityVariant(incident.severity)}>
                      {incident.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(incident.status)}>
                      {incident.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(incident.detectionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Incidents;
