import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  FileText, 
  LogOut,
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    if (path === '/') {
      return [
        { label: 'Inicio', href: '/', current: true }
      ];
    } else if (path === '/actions') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Accions Correctives', href: '/actions', current: true }
      ];
    } else if (path === '/reports') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Informes', href: '/reports', current: true }
      ];
    } else if (path === '/users') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Usuaris', href: '/users', current: true }
      ];
    } else if (path === '/settings') {
      return [
        { label: 'Inicio', href: '/' },
        { label: 'Configuració', href: '/settings', current: true }
      ];
    }
    
    return [
      { label: 'Inicio', href: '/', current: true }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="relative z-20 bg-blue-600 shadow-lg border-b border-blue-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo, Sidebar trigger and Breadcrumbs */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="text-white hover:bg-white/10" />
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg flex items-center justify-center shadow-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">
              Accions Correctives
            </span>
          </div>

          <div className="hidden md:block ml-6">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem key={crumb.href}>
                    {crumb.current ? (
                      <BreadcrumbPage className="text-blue-100">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <>
                        <BreadcrumbLink asChild>
                          <Link to={crumb.href} className="text-blue-200 hover:text-white">
                            {crumb.label}
                          </Link>
                        </BreadcrumbLink>
                        <BreadcrumbSeparator className="text-blue-300" />
                      </>
                    )}
                  </BreadcrumbItem>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Right side - User info */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-white">{user?.name}</span>
              <span className="text-xs text-blue-200">{user?.centre}</span>
            </div>
            <Badge variant="outline" className="capitalize bg-white/20 text-white border-white/30">
              {user?.role}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-blue-200 hover:text-white hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
