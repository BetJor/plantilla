
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Portal de Gestió
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sistema de gestió integral
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{user?.name || 'Usuari'}</span>
            {user?.role && (
              <Badge variant="secondary" className="text-xs">
                {user.role}
              </Badge>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sortir
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
