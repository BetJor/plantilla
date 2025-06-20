
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X, Search } from 'lucide-react';
import { format } from 'date-fns';
import { CorrectiveAction } from '@/types';

interface FilterState {
  searchText: string;
  status: string;
  type: string;
  priority: string;
  centre: string;
  assignedTo: string;
  createdFrom: Date | null;
  createdTo: Date | null;
  dueFrom: Date | null;
  dueTo: Date | null;
}

interface AdvancedFiltersProps {
  actions: CorrectiveAction[];
  onFiltersChange: (filteredActions: CorrectiveAction[]) => void;
  onFilterStateChange: (filters: FilterState) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  actions, 
  onFiltersChange, 
  onFilterStateChange 
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    status: 'all',
    type: 'all',
    priority: 'all',
    centre: 'all',
    assignedTo: 'all',
    createdFrom: null,
    createdTo: null,
    dueFrom: null,
    dueTo: null
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique values for dropdowns
  const uniqueStatuses = [...new Set(actions.map(a => a.status))];
  const uniqueTypes = [...new Set(actions.map(a => a.type))];
  const uniquePriorities = [...new Set(actions.map(a => a.priority))];
  const uniqueCentres = [...new Set(actions.map(a => a.centre))];
  const uniqueAssignees = [...new Set(actions.map(a => a.assignedTo))];

  const applyFilters = (newFilters: FilterState) => {
    let filtered = actions;

    // Text search
    if (newFilters.searchText) {
      const searchLower = newFilters.searchText.toLowerCase();
      filtered = filtered.filter(action => 
        action.title.toLowerCase().includes(searchLower) ||
        action.description.toLowerCase().includes(searchLower) ||
        action.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (newFilters.status !== 'all') {
      filtered = filtered.filter(action => action.status === newFilters.status);
    }

    // Type filter
    if (newFilters.type !== 'all') {
      filtered = filtered.filter(action => action.type === newFilters.type);
    }

    // Priority filter
    if (newFilters.priority !== 'all') {
      filtered = filtered.filter(action => action.priority === newFilters.priority);
    }

    // Centre filter
    if (newFilters.centre !== 'all') {
      filtered = filtered.filter(action => action.centre === newFilters.centre);
    }

    // Assigned to filter
    if (newFilters.assignedTo !== 'all') {
      filtered = filtered.filter(action => action.assignedTo === newFilters.assignedTo);
    }

    // Date filters
    if (newFilters.createdFrom) {
      filtered = filtered.filter(action => 
        new Date(action.createdAt) >= newFilters.createdFrom!
      );
    }

    if (newFilters.createdTo) {
      filtered = filtered.filter(action => 
        new Date(action.createdAt) <= newFilters.createdTo!
      );
    }

    if (newFilters.dueFrom) {
      filtered = filtered.filter(action => 
        new Date(action.dueDate) >= newFilters.dueFrom!
      );
    }

    if (newFilters.dueTo) {
      filtered = filtered.filter(action => 
        new Date(action.dueDate) <= newFilters.dueTo!
      );
    }

    onFiltersChange(filtered);
    onFilterStateChange(newFilters);
  };

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      searchText: '',
      status: 'all',
      type: 'all',
      priority: 'all',
      centre: 'all',
      assignedTo: 'all',
      createdFrom: null,
      createdTo: null,
      dueFrom: null,
      dueTo: null
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchText) count++;
    if (filters.status !== 'all') count++;
    if (filters.type !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.centre !== 'all') count++;
    if (filters.assignedTo !== 'all') count++;
    if (filters.createdFrom) count++;
    if (filters.createdTo) count++;
    if (filters.dueFrom) count++;
    if (filters.dueTo) count++;
    return count;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtres Avançats
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {getActiveFiltersCount() > 0 && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Netejar
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Amagar' : 'Mostrar'} Filtres
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Search bar - always visible */}
        <div className="flex items-center space-x-2 mb-4">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar per títol, descripció o ID..."
            value={filters.searchText}
            onChange={(e) => updateFilter('searchText', e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Advanced filters - collapsible */}
        {isExpanded && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Estat</label>
                <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tots els estats</SelectItem>
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Tipus</label>
                <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tots els tipus</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Prioritat</label>
                <Select value={filters.priority} onValueChange={(value) => updateFilter('priority', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Totes les prioritats</SelectItem>
                    {uniquePriorities.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Centre</label>
                <Select value={filters.centre} onValueChange={(value) => updateFilter('centre', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tots els centres</SelectItem>
                    {uniqueCentres.map(centre => (
                      <SelectItem key={centre} value={centre}>{centre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Assignat a</label>
                <Select value={filters.assignedTo} onValueChange={(value) => updateFilter('assignedTo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tots els assignats</SelectItem>
                    {uniqueAssignees.map(assignee => (
                      <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Data de creació</label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {filters.createdFrom ? format(filters.createdFrom, 'dd/MM/yyyy') : 'Des de'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.createdFrom || undefined}
                        onSelect={(date) => updateFilter('createdFrom', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {filters.createdTo ? format(filters.createdTo, 'dd/MM/yyyy') : 'Fins'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.createdTo || undefined}
                        onSelect={(date) => updateFilter('createdTo', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Data de venciment</label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {filters.dueFrom ? format(filters.dueFrom, 'dd/MM/yyyy') : 'Des de'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dueFrom || undefined}
                        onSelect={(date) => updateFilter('dueFrom', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {filters.dueTo ? format(filters.dueTo, 'dd/MM/yyyy') : 'Fins'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.dueTo || undefined}
                        onSelect={(date) => updateFilter('dueTo', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
