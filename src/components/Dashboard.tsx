import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Users,
  Building,
  Bell,
  BellDot
} from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { useNotifications } from '@/hooks/useNotifications';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { getDashboardMetrics } = useCorrectiveActions();
  const { getMetrics: getNotificationMetrics } = useNotifications();
  const metrics = getDashboardMetrics();
  const notificationMetrics = getNotificationMetrics();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const statusData = metrics.actionsByStatus.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  const typeData = metrics.actionsByType.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));

  const centreData = metrics.actionsByCentre;
  const originData = metrics.actionsByOrigin;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalActions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accions Pendents</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.pendingActions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accions amb Retard</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.overdueActions}</div>
            {notificationMetrics.overdueCount > 0 && (
              <div className="flex items-center mt-1">
                <BellDot className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-xs text-red-600">{notificationMetrics.overdueCount} notificacions</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tancades aquest Mes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{metrics.closedThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Metrics Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Estat de les Notificacions
          </CardTitle>
          <CardDescription>
            Resum de les notificacions del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{notificationMetrics.unreadCount}</div>
              <p className="text-sm text-gray-600">No llegides</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{notificationMetrics.upcomingCount}</div>
              <p className="text-sm text-gray-600">Venciment proper</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{notificationMetrics.overdueCount}</div>
              <p className="text-sm text-gray-600">Amb retard</p>
            </div>
          </div>
          
          {(notificationMetrics.unreadCount > 0 || notificationMetrics.overdueCount > 0) && (
            <Alert className="mt-4">
              <BellDot className="h-4 w-4" />
              <AlertDescription>
                Tens {notificationMetrics.unreadCount} notificacions no llegides
                {notificationMetrics.overdueCount > 0 && 
                  ` i ${notificationMetrics.overdueCount} accions amb retard`
                }.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Accions per Estat</CardTitle>
            <CardDescription>Distribució actual de les accions correctives</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, count }) => `${status}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Actions by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Accions per Tipus</CardTitle>
            <CardDescription>Distribució per tipus d'acció correctiva</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeData}>
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

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions by Centre */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Accions per Centre
            </CardTitle>
            <CardDescription>Distribució per centre sanitari</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={centreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="centre" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Actions by Origin */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Accions per Origen
            </CardTitle>
            <CardDescription>Font d'origen de les accions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={originData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ origin, count }) => `${origin}: ${count}`}
                  outerRadius={80}
                  fill="#FFBB28"
                  dataKey="count"
                >
                  {originData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Overdue Actions by Type */}
      {metrics.overdueByType.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Accions amb Retard per Tipus
            </CardTitle>
            <CardDescription>Accions que han superat la data límit</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.overdueByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Closure Effectiveness */}
      {(metrics.conformeVsNoConforme.conforme > 0 || metrics.conformeVsNoConforme.noConforme > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Eficàcia dels Tancaments
            </CardTitle>
            <CardDescription>Proporció d'accions tancades conforme vs no conforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Conforme</span>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  {metrics.conformeVsNoConforme.conforme}
                </Badge>
              </div>
              <Progress 
                value={(metrics.conformeVsNoConforme.conforme / (metrics.conformeVsNoConforme.conforme + metrics.conformeVsNoConforme.noConforme)) * 100} 
                className="h-2"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">No Conforme</span>
                <Badge variant="destructive">
                  {metrics.conformeVsNoConforme.noConforme}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Accions Ràpides</CardTitle>
          <CardDescription>Accions més comunes del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/actions/new">
              <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <FileText className="w-6 h-6" />
                <span>Nova Acció</span>
              </Button>
            </Link>
            <Link to="/actions?filter=pending">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <Clock className="w-6 h-6" />
                <span>Accions Pendents</span>
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart className="w-6 h-6" />
                <span>Generar Informe</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
