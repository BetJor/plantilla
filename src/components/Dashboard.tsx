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
  BellDot,
  Activity,
  Repeat
} from 'lucide-react';
import { useCorrectiveActions } from '@/hooks/useCorrectiveActions';
import { useNotifications } from '@/hooks/useNotifications';
import { useBisActions } from '@/hooks/useBisActions';
import { useAuditHistory } from '@/hooks/useAuditHistory';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { getDashboardMetrics, actions } = useCorrectiveActions();
  const { getMetrics: getNotificationMetrics } = useNotifications();
  const { getBisMetrics } = useBisActions();
  const { getActivityMetrics } = useAuditHistory();
  const { user } = useAuth();
  
  const metrics = getDashboardMetrics();
  const notificationMetrics = getNotificationMetrics();
  const bisMetrics = getBisMetrics(actions);
  const activityMetrics = getActivityMetrics();

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

  // Filter data based on user role
  const getFilteredMetrics = () => {
    if (user?.role === 'centre_user' && user?.centre) {
      const userCentreActions = actions.filter(a => a.centre === user.centre);
      // Calculate metrics only for user's centre
      return {
        ...metrics,
        totalActions: userCentreActions.length,
        // ... other filtered metrics
      };
    }
    return metrics;
  };

  const filteredMetrics = getFilteredMetrics();

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMetrics.totalActions}</div>
            {user?.role === 'centre_user' && (
              <p className="text-xs text-muted-foreground">Al teu centre: {user.centre}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accions Pendents</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.pendingActions}</div>
            {notificationMetrics.upcomingCount > 0 && (
              <div className="flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1" />
                <span className="text-xs text-yellow-600">{notificationMetrics.upcomingCount} pròximes a vèncer</span>
              </div>
            )}
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

      {/* Enhanced System Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notificacions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">No llegides</span>
                <Badge variant={notificationMetrics.unreadCount > 0 ? "destructive" : "secondary"}>
                  {notificationMetrics.unreadCount}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Venciment proper</span>
                <Badge variant={notificationMetrics.upcomingCount > 0 ? "default" : "secondary"}>
                  {notificationMetrics.upcomingCount}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Amb retard</span>
                <Badge variant={notificationMetrics.overdueCount > 0 ? "destructive" : "secondary"}>
                  {notificationMetrics.overdueCount}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BIS Actions Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Repeat className="w-5 h-5 mr-2" />
              Accions BIS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total BIS</span>
                <Badge variant="outline">{bisMetrics.totalBisActions}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Taxa d'eficàcia</span>
                <Badge variant={bisMetrics.effectivenessRate > 80 ? "default" : "destructive"}>
                  {bisMetrics.effectivenessRate.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Activitat del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Aquesta setmana</span>
                <Badge variant="outline">{activityMetrics.thisWeek}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Aquest mes</span>
                <Badge variant="outline">{activityMetrics.thisMonth}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      {(notificationMetrics.unreadCount > 0 || notificationMetrics.overdueCount > 0 || bisMetrics.totalBisActions > 0) && (
        <Alert className="border-orange-200 bg-orange-50">
          <BellDot className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Requereix atenció:</strong>{' '}
            {notificationMetrics.unreadCount > 0 && `${notificationMetrics.unreadCount} notificacions no llegides`}
            {notificationMetrics.overdueCount > 0 && `, ${notificationMetrics.overdueCount} accions amb retard`}
            {bisMetrics.totalBisActions > 0 && `, ${bisMetrics.totalBisActions} accions BIS actives`}
            .
          </AlertDescription>
        </Alert>
      )}

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
          <CardDescription>Funcions més utilitzades del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <Link to="/actions?filter=overdue">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2 border-red-200 text-red-600 hover:bg-red-50">
                <AlertTriangle className="w-6 h-6" />
                <span>Accions Vençudes</span>
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                <TrendingUp className="w-6 h-6" />
                <span>Informes Avançats</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
