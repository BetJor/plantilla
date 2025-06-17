import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, Eye } from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { ACTION_TYPES } from '@/types/categories';
import CategorySelectors from '@/components/ActionFormSections/CategorySelectors';

const Actions = () => {
  const { actions, addAction } = useCorrectiveActions();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    subCategory: '',
    dueDate: '',
    assignedTo: '',
    priority: 'mitjana' as const,
    centre: '',
    department: ''
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Borrador': return 'secondary';
      case 'Pendiente de Análisis': return 'default';
      case 'Pendiente de Comprobación': return 'default';
      case 'Pendiente de Cierre': return 'destructive';
      case 'Cerrado': return 'secondary';
      case 'Anulada': return 'destructive';
      default: return 'default';
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'crítica': return 'destructive';
      case 'alta': return 'destructive';
      case 'mitjana': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeDisplayName = (typeCode: string) => {
    const type = ACTION_TYPES.find(t => t.code === typeCode);
    return type?.name || typeCode;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAction({
      ...formData,
      status: 'Borrador',
      attachments: [],
      createdBy: 'current-user'
    });
    setFormData({
      title: '',
      description: '',
      type: '',
      category: '',
      subCategory: '',
      dueDate: '',
      assignedTo: '',
      priority: 'mitjana',
      centre: '',
      department: ''
    });
    setShowCreateForm(false);
  };

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accions Correctives</h1>
          <p className="text-gray-600">Gestiona les accions correctives i preventives</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Acció
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-blue-800">Crear Nova Acció Correctiva</CardTitle>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  Estat: Borrador
                </Badge>
              </div>
              <div className="text-sm text-blue-600">
                Pas 1: Selecciona tipus → Pas 2: Categoria → Pas 3: Subcategoria
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <CategorySelectors
                selectedType={formData.type}
                selectedCategory={formData.category}
                selectedSubcategory={formData.subCategory}
                onTypeChange={(type) => setFormData({ ...formData, type, category: '', subCategory: '' })}
                onCategoryChange={(category) => setFormData({ ...formData, category, subCategory: '' })}
                onSubcategoryChange={(subCategory) => setFormData({ ...formData, subCategory })}
                currentStatus="Borrador"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-gray-700 font-medium">Títol</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate" className="text-gray-700 font-medium">Data Límit</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="assignedTo" className="text-gray-700 font-medium">Assignat a</Label>
                  <Input
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="centre" className="text-gray-700 font-medium">Centre</Label>
                  <Input
                    id="centre"
                    value={formData.centre}
                    onChange={(e) => setFormData({ ...formData, centre: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="department" className="text-gray-700 font-medium">Departament</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description" className="text-gray-700 font-medium">Descripció</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel·lar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Crear Acció
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-blue-800">Llistat d'Accions Correctives</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Cercar accions..."
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
                <TableHead>Tipus</TableHead>
                <TableHead>Assignat a</TableHead>
                <TableHead>Prioritat</TableHead>
                <TableHead>Estat</TableHead>
                <TableHead>Data Límit</TableHead>
                <TableHead>Accions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActions.map((action) => (
                <TableRow key={action.id} className="hover:bg-blue-50">
                  <TableCell className="font-medium">{action.title}</TableCell>
                  <TableCell>{getTypeDisplayName(action.type)}</TableCell>
                  <TableCell>{action.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityVariant(action.priority)}>
                      {action.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(action.status)}>
                      {action.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(action.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/actions/${action.id}`}>
                        <Eye className="w-4 h-4" />
                      </Link>
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

export default Actions;
