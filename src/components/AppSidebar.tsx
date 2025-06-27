import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const AppSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { href: '/', label: 'Dashboard', icon: Home },    
    { href: '/reports', label: 'Informes', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ href: '/users', label: 'Usuaris', icon: Users }] : []),
    { href: '/settings', label: 'Configuració', icon: Settings }
  ];

  return (
    <Sidebar className="border-r border-blue-200 top-20 h-[calc(100vh-80px)]">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-800 font-semibold">
            Àrea de trabajo
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild
                      className={cn(
                        "transition-all duration-200",
                        isActive
                          ? "bg-blue-100 text-blue-800 border-r-2 border-blue-600"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      )}
                    >
                      <Link to={item.href}>
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
