
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
    { href: '/actions', label: 'Accions Correctives', icon: FileText },
    { href: '/reports', label: 'Informes', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ href: '/users', label: 'Usuaris', icon: Users }] : []),
    { href: '/settings', label: 'Configuració', icon: Settings }
  ];

  // Debugging: verificar que tots els items es generen correctament
  console.log('Navigation items:', navigationItems);
  console.log('User role:', user?.role);

  return (
    <Sidebar className="border-r border-blue-200">
      <SidebarContent className="bg-white">
        <SidebarGroup className="debug-group" style={{ border: '2px solid red', margin: '4px' }}>
          <SidebarGroupLabel className="text-blue-800 font-semibold debug-label" style={{ border: '1px solid green', backgroundColor: 'yellow' }}>
            Àrea de trabajo
          </SidebarGroupLabel>
          <SidebarGroupContent className="debug-content" style={{ border: '1px solid blue' }}>
            <SidebarMenu>
              {/* Element de test al principi */}
              <SidebarMenuItem style={{ border: '2px solid orange', backgroundColor: 'pink' }}>
                <SidebarMenuButton className="debug-test-item">
                  <span>TEST ITEM</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                // Debugging per cada item
                console.log(`Rendering item ${index}:`, item.label, item.href);
                
                return (
                  <SidebarMenuItem 
                    key={item.href}
                    style={{ 
                      border: index === 0 ? '3px solid purple' : '1px solid gray',
                      backgroundColor: index === 0 ? 'lightcyan' : 'transparent',
                      margin: '2px'
                    }}
                  >
                    <SidebarMenuButton 
                      asChild
                      className={cn(
                        "transition-all duration-200",
                        index === 0 ? "debug-first-item" : "",
                        isActive
                          ? "bg-blue-100 text-blue-800 border-r-2 border-blue-600"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      )}
                      style={{ 
                        minHeight: '40px',
                        border: index === 0 ? '2px solid magenta' : undefined
                      }}
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
