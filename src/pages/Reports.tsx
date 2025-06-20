
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Download, FileText, Calendar, TrendingUp, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { useBisActions } from '@/hooks/useBisActions';
import { useAuditHistory } from '@/hooks/useAuditHistory';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const Reports = () => {
  const { getDashboardMetrics, actions } = useCorrectiveActions();
  const { getBisMetrics } = useBisActions();
  const { getActivityMetrics } = useAuditHistory();
  const { user } = useAuth();
  
  const [selectedPeriod, setSelectedPeriod] = useState('last-month');
  const [selectedCentre, setSelectedCentre] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const metrics = getDashboardMetrics();
  const bisMetrics = getBisMetrics(actions);
  const activityMetrics = getActivityMetrics();

  // Filter data based on selected period
  const filteredActions = useMemo(() => {
    let filtered = actions;
    
    // Filter by period
    const now = new Date();
    let startDate: Date;
    
    switch (selectedPeriod) {
      case 'this-month':
        startDate = startOfMonth(now);
        break;
      case 'last-month':
        startDate = startOfMonth(subMonths(now, 1));
        break;
      case 'last-3-months':
        startDate = startOfMonth(subMonths(now, 3));
        break;
      case 'last-6-months':
        startDate = startOfMonth(subMonths(now, 6));
        break;
      case 'this-year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = startOfMonth(subMonths(now, 1));
    }
    
    filtered = filtered.filter(action => new Date(action.createdAt) >= startDate);
    
    // Filter by centre
    if (selectedCentre !== 'all') {
      filtered = filtered.filter(action => action.centre === selectedCentre);
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(action => action.type === selectedType);
    }
    
    return filtered;
  }, [actions, selectedPeriod, selectedCentre, selectedType]);

  // Get unique centres and types for filters
  const uniqueCentres = [...new Set(actions.map(a => a.centre))];
  const uniqueTypes = [...new Set(actions.map(a => a.type))];

  // Calculate filtered metrics
  const filteredMetrics = useMemo(() => {
    const totalActions = filteredActions.length;
    const pendingActions = filteredActions.filter(a => 
      ['Pendiente de Análisis', 'Pendiente de Comprobación', 'Pendiente de Cierre'].includes(a.status)
    ).length;
    const overdueActions = filteredActions.filter(a => 
      new Date(a.dueDate) < new Date() && a.status !== 'Cerrado'
    ).length;
    const closedActions = filteredActions.filter(a => a.status === 'Cerrado').length;

    const actionsByStatus = Object.entries(
      filteredActions.reduce((acc, action) => {
        acc[action.status] = (acc[action.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([status, count]) => ({ status, count }));

    const actionsByType = Object.entries(
      filteredActions.reduce((acc, action) => {
        acc[action.type] = (acc[action.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([type, count]) => ({ type, count }));

    const actionsByCentre = Object.entries(
      filteredActions.reduce((acc, action) => {
        acc[action.centre] = (acc[action.centre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([centre, count]) => ({ centre, count }));

    return {
      totalActions,
      pendingActions,
      overdueActions,
      closedActions,
      actionsByStatus,
      actionsByType,
      actionsByCentre
    };
  }, [filteredActions]);

  // Monthly trend data
  const monthlyTrend = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthActions = actions.filter(action => {
        const actionDate = new Date(action.createdAt);
        return actionDate >= monthStart && actionDate <= monthEnd;
      });

      const closedActions = monthActions.filter(a => a.status === 'Cerrado');
      
      return {
        month: format(date, 'MMM yyyy'),
        created: monthActions.length,
        closed: closedActions.length,
        pending: monthActions.length - closedActions.length
      };
    }).reverse();

    return last6Months;
  }, [actions]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const exportData = () => {
    // Simulate export functionality
    console.log('Exporting report data...', {
      period: selectedPeriod,
      centre: selectedCentre,
      type: selectedType,
      metrics: filteredMetrics
    });
    
    // In a real implementation, this would generate a PDF or Excel file
    alert('Funcionalitat d\'exportació implementada - vegeu la consola per als detalls');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Informes i Analítica Avançada</h1>
          <p className="text-gray-600">Visualitza estadístiques detallades i genera informes personalitzats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Informe
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Filtres d'Informe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Període</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">Aquest mes</SelectItem>
                  <SelectItem value="last-month">Mes passat</SelectItem>
                  <SelectItem value="last-3-months">Últims 3 mesos</SelectItem>
                  <SelectItem value="last-6-months">Últims 6 mesos</SelectItem>
                  <SelectItem value="this-year">Aquest any</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Centre</label>
              <Select value={selectedCentre} onValueChange={setSelectedCentre}>
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
              <label className="text-sm font-medium mb-2 block">Tipus d'Acció</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
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
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Accions</p>
                <p className="text-2xl font-bold text-gray-900">{filteredMetrics.totalActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendents</p>
                <p className="text-2xl font-bold text-gray-900">{filteredMetrics.pendingActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vençudes</p>
                <p className="text-2xl font-bold text-gray-900">{filteredMetrics.overdueActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tancades</p>
                <p className="text-2xl font-bold text-gray-900">{filteredMetrics.closedActions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendències</TabsTrigger>
          <TabsTrigger value="distribution">Distribució</TabsTrigger>
          <TabsTrigger value="performance">Rendiment</TabsTrigger>
          <TabsTrigger value="activity">Activitat</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Tendència Mensual d'Accions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="created" stackId="1" stroke="#8884d8" fill="#8884d8" name="Creades" />
                    <Area type="monotone" dataKey="closed" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Tancades" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribució per Estat</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={filteredMetrics.actionsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {filteredMetrics.actionsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribució per Tipus</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredMetrics.actionsByType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mètriques d'Accions BIS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Accions BIS</span>
                    <Badge variant="outline">{bisMetrics.totalBisActions}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Accions Originals amb BIS</span>
                    <Badge variant="outline">{bisMetrics.originalActionsWithBis}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Taxa d'Eficàcia</span>
                    <Badge variant={bisMetrics.effectivenessRate > 80 ? 'default' : 'destructive'}>
                      {bisMetrics.effectivenessRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Accions per Centre</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={filteredMetrics.actionsByCentre} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="centre" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Activitat del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Entrades d'Auditoria</span>
                    <Badge variant="outline">{activityMetrics.totalEntries}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Aquesta Setmana</span>
                    <Badge variant="outline">{activityMetrics.thisWeek}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Aquest Mes</span>
                    <Badge variant="outline">{activityMetrics.thisMonth}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usuaris Més Actius</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityMetrics.mostActiveUsers.map(([userName, count], index) => (
                    <div key={userName} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-6">
                          #{index + 1}
                        </span>
                        <span className="text-sm font-medium">{userName}</span>
                      </div>
                      <Badge variant="outline">{count} accions</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
