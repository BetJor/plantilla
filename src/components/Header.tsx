
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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Portal de Gestió
            </h1>
            <p className="text-sm text-muted-foreground">
              Sistema de gestió integral
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-foreground">{user?.name || 'Usuari'}</span>
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
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sortir
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
