import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Search, Filter, Eye, Sparkles } from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { useSimilarActions } from '@/hooks/useSimilarActions';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from '@/hooks/use-toast';
import { ACTION_TYPES } from '@/types/categories';
import CategorySelectors from '@/components/ActionFormSections/CategorySelectors';
import ResponsibleAssignment from '@/components/ActionFormSections/ResponsibleAssignment';
import SpecificFields from '@/components/ActionFormSections/SpecificFields';
import SimilarActionsDialog from '@/components/SimilarActionsDialog';

const Actions = () => {
  const { actions, addAction } = useCorrectiveActions();
  const { findSimilarActions, isLoading: isFindingActions, error: similarActionsError } = useSimilarActions();
  
  // Mock user per testing - en una implementació real vindria del context d'autenticació
  const mockUser = {
    id: 'current-user',
    name: 'Usuari Test',
    email: 'test@example.com',
    role: 'admin' as const,
    centre: 'Hospital Central Barcelona',
    department: 'Qualitat',
    specificRoles: ['direccio-qualitat', 'director-centre']
  };
  
  const { allowedActionTypes } = usePermissions({ user: mockUser });
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSimilarActions, setShowSimilarActions] = useState(false);
  const [similarActions, setSimilarActions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category: '',
    subCategory: '',
    priority: 'mitjana' as const,
    centre: '',
    origin: '',
    areasImplicadas: [] as string[],
    areasHospital: [] as string[],
    responsableAnalisis: ''
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
      case 'crítica': return 'destructive'; // vermell
      case 'alta': return 'orange'; // taronja
      case 'mitjana': return 'orange-light'; // taronja clar
      case 'baixa': return 'secondary'; // gris clar
      default: return 'default';
    }
  };

  const getTypeDisplayName = (typeCode: string) => {
    const type = ACTION_TYPES.find(t => t.code === typeCode);
    return type?.name || typeCode;
  };

  const handleFindSimilarActions = async () => {
    console.log('handleFindSimilarActions: Botó clickat');
    console.log('handleFindSimilarActions: Dades del formulari:', {
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      category: formData.category
    });

    if (!formData.title.trim() || !formData.description.trim()) {
      console.warn('handleFindSimilarActions: Títol o descripció buits');
      toast({
        title: "Camps obligatoris",
        description: "Cal omplir l'assumpte i la descripció abans de buscar accions similars.",
        variant: "destructive"
      });
      return;
    }

    const existingActions = actions.filter(action => action.status !== 'Borrador');
    if (existingActions.length === 0) {
      console.warn('handleFindSimilarActions: No hi ha accions existents');
      toast({
        title: "Cap acció existent",
        description: "No hi ha accions existents al sistema per comparar.",
        variant: "default"
      });
      return;
    }

    const apiKey = localStorage.getItem('gemini-api-key');
    if (!apiKey) {
      console.warn('handleFindSimilarActions: Clau API no configurada');
      toast({
        title: "Configuració necessària",
        description: "Cal configurar la clau API de Gemini a Configuració per utilitzar aquesta funcionalitat.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('handleFindSimilarActions: Iniciant cerca...');
      const results = await findSimilarActions({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        category: formData.category,
        centre: formData.centre
      });
      
      console.log('handleFindSimilarActions: Resultats rebuts:', results.length);
      setSimilarActions(results);
      setShowSimilarActions(true);
    } catch (error) {
      console.error('handleFindSimilarActions: Error final:', error);
    }
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    addAction({
      ...formData,
      status: 'Borrador',
      attachments: [],
      createdBy: 'current-user',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dies per defecte
      assignedTo: formData.responsableAnalisis || 'current-user'
    });
    
    toast({
      title: "Borrador guardat",
      description: "El borrador s'ha guardat correctament."
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAction({
      ...formData,
      status: 'Pendiente de Análisis',
      attachments: [],
      createdBy: 'current-user',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dies per defecte
      assignedTo: formData.responsableAnalisis || 'current-user'
    });
    setFormData({
      title: '',
      description: '',
      type: '',
      category: '',
      subCategory: '',
      priority: 'mitjana',
      centre: '',
      origin: '',
      areasImplicadas: [],
      areasHospital: [],
      responsableAnalisis: ''
    });
    setShowCreateForm(false);
    setSimilarActions([]);
  };

  const filteredActions = actions.filter(action =>
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const canSearchSimilar = formData.title.trim().length > 0 && 
                          formData.description.trim().length > 0 && 
                          actions.filter(action => action.status !== 'Borrador').length > 0 &&
                          localStorage.getItem('gemini-api-key');

  const getTooltipMessage = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return "Cal omplir l'assumpte i la descripció";
    }
    if (actions.filter(action => action.status !== 'Borrador').length === 0) {
      return "No hi ha accions existents per comparar";
    }
    if (!localStorage.getItem('gemini-api-key')) {
      return "Cal configurar la clau API de Gemini a Configuració";
    }
    return "Buscar accions similars";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accions Correctives</h1>
          <p className="text-gray-600">Gestiona les accions correctives i preventives</p>
        </div>
        <div className="flex gap-2">
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
                origin={formData.origin}
                areasImplicadas={formData.areasImplicadas}
                areasHospital={formData.areasHospital}
                onFieldChange={handleFieldChange}
                user={mockUser}
              />

              <div>
                <Label htmlFor="title" className="text-gray-700 font-medium">Assumpte</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="mt-1"
                />
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

              <ResponsibleAssignment
                actionType={formData.type}
                currentStatus="Borrador"
                responsableAnalisis={formData.responsableAnalisis}
                onResponsableChange={handleResponsableChange}
                onDateChange={() => {}}
                user={mockUser}
              />
              
              <div className="flex gap-4 justify-between">
                <div className="flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleFindSimilarActions}
                    disabled={!canSearchSimilar || isFindingActions}
                    className="flex items-center gap-2"
                    title={getTooltipMessage()}
                  >
                    <Sparkles className="w-4 h-4" />
                    {isFindingActions ? 'Cercant...' : 'Buscar accions similars'}
                  </Button>
                  
                  {!canSearchSimilar && (
                    <span className="text-sm text-gray-500">
                      {getTooltipMessage()}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-4">
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
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <SimilarActionsDialog
        open={showSimilarActions}
        onOpenChange={setShowSimilarActions}
        similarActions={similarActions}
        isLoading={isFindingActions}
      />

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
                No hi ha accions correctives. Crea la primera acció per començar.
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
                        <Badge variant="outline" className={getStatusBadgeStyle(action.status)}>
                          {action.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{action.dueDate ? new Date(action.dueDate).toLocaleDateString() : '-'}</TableCell>
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Actions;
