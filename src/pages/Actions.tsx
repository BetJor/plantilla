import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, Eye, Database } from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { usePermissions } from '@/hooks/usePermissions';
import { useTabsContext } from '@/contexts/TabsContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { ACTION_TYPES } from '@/types/categories';
import CategorySelectors from '@/components/ActionFormSections/CategorySelectors';
import ResponsibleAssignment from '@/components/ActionFormSections/ResponsibleAssignment';
import SpecificFields from '@/components/ActionFormSections/SpecificFields';
import AttachmentsSection from '@/components/ActionFormSections/AttachmentsSection';
import { CorrectiveAction } from '@/types';

const Actions = () => {
  const { actions, addAction, addTestActions, updateAction } = useCorrectiveActions();
  const { openTab } = useTabsContext();
  const navigate = useNavigate();
  
  // Mock user per testing - en una implementació real vindria del context d'autenticació
  const mockUser = {
    id: 'current-user',
    name: 'Usu aria Test',
    email: 'test@example.com',
    role: 'admin' as const,
    centre: 'Hospital Central Barcelona',
    department: 'Qualitat',
    specificRoles: ['direccio-qualitat', 'director-centre']
  };
  
  const { allowedActionTypes } = usePermissions({ user: mockUser });
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    subCategory: '',
    priority: 'mitjana' as const,
    centre: '',
    origen: '' as CorrectiveAction['origen'],
    areasImplicadas: [] as string[],
    areasHospital: [] as string[],
    responsableAnalisis: '',
    attachments: [] as string[]
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleTypeChange = (type: string) => {
    updateFormData({ type, category: '', subCategory: '' });
  };

  const handleCategoryChange = (category: string) => {
    updateFormData({ category, subCategory: '' });
  };

  const handleSubcategoryChange = (subCategory: string) => {
    updateFormData({ subCategory });
  };

  const handleResponsableChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };

  const handleFieldChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const handleAttachmentsChange = (attachments: string[]) => {
    updateFormData({ attachments });
  };

  // Nova funció per obrir una acció en un tab
  const handleViewAction = (action: CorrectiveAction) => {
    console.log('handleViewAction: opening action', action.id);
    const tab = {
      id: `action-${action.id}`,
      title: `Acció ${action.id}`,
      path: `/actions/${action.id}`,
      icon: Eye,
      closable: true
    };
    openTab(tab);
    navigate(`/actions/${action.id}`);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Borrador':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Pendiente de Análisis':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Pendiente de Comprobación':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pendiente de Cierre':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cerrado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Anulada':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const submitButtons = form.querySelectorAll('button');
    submitButtons.forEach(btn => btn.disabled = true);
    
    addAction({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      subCategory: formData.subCategory,
      priority: formData.priority,
      centre: formData.centre,
      origen: formData.origen,
      areasImplicadas: formData.areasImplicadas,
      areasHospital: formData.areasHospital,
      responsableAnalisis: formData.responsableAnalisis,
      attachments: formData.attachments,
      status: 'Borrador',
      createdBy: 'current-user',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: formData.responsableAnalisis || 'current-user',
      department: mockUser.department
    });
    
    // Reinicialitzar el formulari
    setFormData({
      title: '',
      description: '',
      type: '',
      category: '',
      subCategory: '',
      priority: 'mitjana',
      centre: '',
      origen: '' as CorrectiveAction['origen'],
      areasImplicadas: [],
      areasHospital: [],
      responsableAnalisis: '',
      attachments: []
    });
    
    toast({
      title: "Borrador guardat",
      description: "El borrador s'ha guardat correctament."
    });
    
    setTimeout(() => {
      submitButtons.forEach(btn => btn.disabled = false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const submitButtons = form.querySelectorAll('button');
    submitButtons.forEach(btn => btn.disabled = true);
    
    addAction({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      subCategory: formData.subCategory,
      priority: formData.priority,
      centre: formData.centre,
      origen: formData.origen,
      areasImplicadas: formData.areasImplicadas,
      areasHospital: formData.areasHospital,
      responsableAnalisis: formData.responsableAnalisis,
      attachments: formData.attachments,
      status: 'Pendiente de Análisis',
      createdBy: 'current-user',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedTo: formData.responsableAnalisis || 'current-user',
      department: mockUser.department
    });
    
    setFormData({
      title: '',
      description: '',
      type: '',
      category: '',
      subCategory: '',
      priority: 'mitjana',
      centre: '',
      origen: '' as CorrectiveAction['origen'],
      areasImplicadas: [],
      areasHospital: [],
      responsableAnalisis: '',
      attachments: []
    });
    setShowCreateForm(false);
    
    setTimeout(() => {
      submitButtons.forEach(btn => btn.disabled = false);
    }, 1000);
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
        <div className="flex gap-2">
          {actions.length === 0 && (
            <Button 
              onClick={addTestActions} 
              variant="outline" 
              className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
            >
              <Database className="w-4 h-4 mr-2" />
              Carregar dades de prova
            </Button>
          )}
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Acció
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-blue-800">Crear Nova Acció Correctiva</CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-300">
                  Estat: Borrador
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form className="space-y-6">
              <CategorySelectors
                selectedType={formData.type}
                selectedCategory={formData.category}
                selectedSubcategory={formData.subCategory}
                onTypeChange={handleTypeChange}
                onCategoryChange={handleCategoryChange}
                onSubcategoryChange={handleSubcategoryChange}
                currentStatus="Borrador"
                allowedTypes={allowedActionTypes.map(t => t.code)}
              />
              
              <SpecificFields
                actionType={formData.type}
                centre={formData.centre}
                department=""
                origen={formData.origen}
                areasImplicadas={formData.areasImplicadas}
                areasHospital={formData.areasHospital}
                onFieldChange={handleFieldChange}
                user={mockUser}
                isDraft={true}
              />

              <div>
                <Label htmlFor="title" className="text-gray-700 font-medium">Títol</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-gray-700 font-medium">Descripció</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData({ description: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>

              <ResponsibleAssignment
                actionType={formData.type}
                currentStatus="Borrador"
                responsableAnalisis={formData.responsableAnalisis}
                onResponsableChange={handleResponsableChange}
                onDateChange={() => {}}
                user={mockUser}
              />

              <AttachmentsSection
                attachments={formData.attachments}
                onUpdate={handleAttachmentsChange}
                readOnly={false}
              />
              
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel·lar
                </Button>
                <Button type="button" variant="outline" onClick={handleSaveDraft}>
                  Guardar
                </Button>
                <Button type="button" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  Crear Acció
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!showCreateForm && (
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
            {actions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="mb-4">
                  <Database className="w-16 h-16 mx-auto text-gray-300 mb-2" />
                  <p className="text-lg font-medium mb-2">No hi ha accions correctives</p>
                  <p className="text-sm">Pots carregar dades de prova o crear la primera acció per començar.</p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Títol</TableHead>
                    <TableHead>Tipus</TableHead>
                    <TableHead>Assignat a</TableHead>
                    <TableHead>Prioritat</TableHead>
                    <TableHead>Estat</TableHead>
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
                        <Badge variant="outline" className={getStatusBadgeStyle(action.status)}>
                          {action.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewAction(action)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Actions;
