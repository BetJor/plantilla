
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Plus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { Link } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const { getDashboardMetrics, actions } = useCorrectiveActions();
  const metrics = getDashboardMetrics();

  const recentActions = actions.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Cerrado': return 'bg-green-100 text-green-800';
      case 'Pendiente de Análisis': return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente de Comprobación': return 'bg-blue-100 text-blue-800';
      case 'Pendiente de Cierre': return 'bg-orange-100 text-orange-800';
      case 'Anulada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'crítica': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'mitjana': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vista general del sistema d'accions correctives</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link to="/incidents/new">
              <Plus className="w-4 h-4 mr-2" />
              Nova Incidència
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/actions/new">
              <Plus className="w-4 h-4 mr-2" />
              Nova Acció
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalActions}</div>
            <p className="text-xs text-muted-foreground">
              Accions creades en total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendents</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics.pendingActions}</div>
            <p className="text-xs text-muted-foreground">
              Accions per completar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Endarrerides</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.overdueActions}</div>
            <p className="text-xs text-muted-foreground">
              Accions fora de termini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tancades (mes)</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.closedThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Accions completades aquest mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Accions per Estat</CardTitle>
            <CardDescription>Distribució d'accions segons el seu estat actual</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.actionsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Accions per Tipus</CardTitle>
            <CardDescription>Distribució d'accions per categoria</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={metrics.actionsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {metrics.actionsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Accions Recents
          </CardTitle>
          <CardDescription>Últimes accions correctives creades o actualitzades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-medium text-gray-900">{action.title}</h4>
                    <Badge className={getStatusColor(action.status)}>
                      {action.status}
                    </Badge>
                    <Badge className={getPriorityColor(action.priority)}>
                      {action.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{action.centre} - {action.department}</p>
                  <p className="text-xs text-gray-500">Assignat a: {action.assignedTo}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Venciment</p>
                  <p className="text-sm font-medium">{new Date(action.dueDate).toLocaleDateString('ca-ES')}</p>
                </div>
                <Button variant="outline" size="sm" asChild className="ml-4">
                  <Link to={`/actions/${action.id}`}>
                    Veure
                  </Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link to="/actions">
                Veure totes les accions
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
