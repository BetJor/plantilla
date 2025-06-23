
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTabsContext, Tab } from '@/contexts/TabsContext';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Eye
} from 'lucide-react';

const routeConfig: Record<string, Omit<Tab, 'id'>> = {
  '/': {
    title: 'Dashboard',
    path: '/',
    icon: Home,
    closable: false
  },
  '/actions': {
    title: 'Accions Correctives',
    path: '/actions',
    icon: FileText
  },
  '/reports': {
    title: 'Informes',
    path: '/reports',
    icon: BarChart3
  },
  '/users': {
    title: 'Usuaris',
    path: '/users',
    icon: Users
  },
  '/settings': {
    title: 'Configuració',
    path: '/settings',
    icon: Settings
  }
};

export const useTabNavigation = () => {
  const location = useLocation();
  const { openTab, setActiveTab, tabs } = useTabsContext();

  console.log('useTabNavigation: current path:', location.pathname);
  console.log('useTabNavigation: current tabs:', tabs);

  useEffect(() => {
    const currentPath = location.pathname;
    console.log('useTabNavigation: processing path:', currentPath);
    
    // Configuració especial per a detalls d'accions
    if (currentPath.startsWith('/actions/')) {
      const actionId = currentPath.split('/')[2];
      const tab: Tab = {
        id: `action-${actionId}`,
        title: `Acció ${actionId}`,
        path: currentPath,
        icon: Eye,
        closable: true
      };
      console.log('useTabNavigation: opening action tab:', tab);
      openTab(tab);
      return;
    }

    // Configuració per a rutes principals
    const routeInfo = routeConfig[currentPath];
    if (routeInfo) {
      const tab: Tab = {
        id: currentPath,
        ...routeInfo
      };
      console.log('useTabNavigation: opening main tab:', tab);
      openTab(tab);
    } else {
      console.warn('useTabNavigation: no route config found for:', currentPath);
    }
  }, [location.pathname, openTab]);

  // Activar la pestanya corresponent quan canvia la ruta
  useEffect(() => {
    const currentPath = location.pathname;
    let tabId = currentPath;
    
    if (currentPath.startsWith('/actions/')) {
      const actionId = currentPath.split('/')[2];
      tabId = `action-${actionId}`;
    }
    
    console.log('useTabNavigation: looking for tab with id:', tabId);
    const existingTab = tabs.find(tab => tab.id === tabId);
    if (existingTab) {
      console.log('useTabNavigation: activating tab:', existingTab);
      setActiveTab(tabId);
    } else {
      console.warn('useTabNavigation: tab not found:', tabId);
    }
  }, [location.pathname, tabs, setActiveTab]);
};
