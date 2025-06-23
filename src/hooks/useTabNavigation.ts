
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

  console.log('useTabNavigation: Current location:', location.pathname);
  console.log('useTabNavigation: Current tabs:', tabs.map(t => ({ id: t.id, title: t.title })));

  useEffect(() => {
    const currentPath = location.pathname;
    console.log('useTabNavigation: Processing path:', currentPath);
    
    // Configuració especial per a detalls d'accions
    if (currentPath.startsWith('/actions/') && currentPath !== '/actions') {
      const actionId = currentPath.split('/')[2];
      const tab: Tab = {
        id: `action-${actionId}`,
        title: `Acció ${actionId}`,
        path: currentPath,
        icon: Eye,
        closable: true
      };
      console.log('useTabNavigation: Opening action tab:', tab);
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
      console.log('useTabNavigation: Opening route tab:', tab);
      openTab(tab);
    }
  }, [location.pathname, openTab]);

  // Activar la pestanya corresponent quan canvia la ruta
  useEffect(() => {
    const currentPath = location.pathname;
    let tabId = currentPath;
    
    if (currentPath.startsWith('/actions/') && currentPath !== '/actions') {
      const actionId = currentPath.split('/')[2];
      tabId = `action-${actionId}`;
    }
    
    console.log('useTabNavigation: Attempting to activate tab:', tabId);
    
    // Sempre intentar activar el tab corresponent
    const existingTab = tabs.find(tab => tab.id === tabId);
    if (existingTab) {
      console.log('useTabNavigation: Found existing tab, activating:', existingTab.title);
      setActiveTab(tabId);
    } else {
      console.log('useTabNavigation: Tab not found in existing tabs');
    }
  }, [location.pathname, tabs, setActiveTab]);
};
