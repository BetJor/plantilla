
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { Link } from 'react-router-dom';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vista general del sistema d'accions correctives</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link to="/actions">
              <Plus className="w-4 h-4 mr-2" />
              Nova Acció
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Accions</CardTitle>
            <FileText className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{metrics.totalActions}</div>
            <p className="text-xs text-blue-600">
              Accions creades en total
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Pendents</CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{metrics.pendingActions}</div>
            <p className="text-xs text-orange-600">
              Accions per completar
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Endarrerides</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{metrics.overdueActions}</div>
            <p className="text-xs text-red-600">
              Accions fora de termini
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Tancades (mes)</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{metrics.closedThisMonth}</div>
            <p className="text-xs text-green-600">
              Accions completades aquest mes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Accions per Estat</CardTitle>
            <CardDescription>Distribució d'accions segons el seu estat actual</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.actionsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-800">Accions per Tipus</CardTitle>
            <CardDescription>Distribució d'accions per categoria</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="flex items-center text-blue-800">
            <TrendingUp className="w-5 h-5 mr-2" />
            Accions Recents
          </CardTitle>
          <CardDescription>Últimes accions correctives creades o actualitzades</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {recentActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between p-4 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
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
