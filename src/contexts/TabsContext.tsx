
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FileText, BarChart3, Settings, Eye } from 'lucide-react';

export interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  closable?: boolean;
}

interface TabsContextType {
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  closeAllTabs: () => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider');
  }
  return context;
};

const routeConfig: Record<string, Omit<Tab, 'id'>> = {
  '/': {
    title: 'Dashboard',
    path: '/',
    icon: Home,
    closable: false
  },
  '/reports': {
    title: 'Informes',
    path: '/reports',
    icon: BarChart3
  },
  '/settings': {
    title: 'Configuració',
    path: '/settings',
    icon: Settings
  }
};

interface TabsProviderProps {
  children: React.ReactNode;
}

export const TabsProvider = ({ children }: TabsProviderProps) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const navigate = useNavigate();

  const openTab = (newTab: Tab) => {
    setTabs(prevTabs => {
      const existingTab = prevTabs.find(tab => tab.path === newTab.path);
      if (existingTab) {
        setActiveTabId(existingTab.id);
        return prevTabs;
      }
      const updatedTabs = [...prevTabs, newTab];
      setActiveTabId(newTab.id);
      return updatedTabs;
    });
  };

  const closeTab = (tabId: string) => {
    setTabs(prevTabs => {
      const updatedTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      if (activeTabId === tabId) {
        const currentIndex = prevTabs.findIndex(tab => tab.id === tabId);
        const nextTab = updatedTabs[currentIndex] || updatedTabs[currentIndex - 1];
        
        if (nextTab) {
          setActiveTabId(nextTab.id);
          navigate(nextTab.path);
        } else {
          setActiveTabId(null);
          navigate('/');
        }
      }
      
      return updatedTabs;
    });
  };

  const closeAllTabs = () => {
    setTabs([]);
    setActiveTabId(null);
    navigate('/');
  };

  return (
    <TabsContext.Provider value={{ tabs, activeTabId, openTab, closeTab, setActiveTab: setActiveTabId, closeAllTabs }}>
      {children}
    </TabsContext.Provider>
  );
};

export const useTabNavigation = () => {
  const location = useLocation();
  const { openTab, setActiveTab, tabs } = useTabsContext();

  useEffect(() => {
    const currentPath = location.pathname;
    
    const routeInfo = routeConfig[currentPath];
    if (routeInfo) {
      const tab: Tab = {
        id: currentPath,
        ...routeInfo
      };
      openTab(tab);
    }
  }, [location.pathname, openTab]);

  useEffect(() => {
    const currentPath = location.pathname;
    const existingTab = tabs.find(tab => tab.id === currentPath);
    if (existingTab) {
      setActiveTab(currentPath);
    }
  }, [location.pathname, tabs, setActiveTab]);
};
