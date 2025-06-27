
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/actions', label: 'Accions Correctives', icon: FileText },
    { href: '/reports', label: 'Informes', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ href: '/users', label: 'Usuaris', icon: Users }] : []),
    { href: '/settings', label: 'Configuració', icon: Settings }
  ];

  return (
    <nav className="bg-blue-600 shadow-lg border-b border-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-800 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-white">
                Accions Correctives
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-white/20 text-white border border-white/30"
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Info & Mobile Menu Button */}
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-blue-100 hover:text-white hover:bg-white/10"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-blue-700">
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="px-3 py-2 border-t border-blue-700 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-base font-medium text-white">{user?.name}</div>
                    <div className="text-sm text-blue-200">{user?.centre}</div>
                  </div>
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;