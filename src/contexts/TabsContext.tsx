
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

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

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider');
  }
  return context;
};

interface TabsProviderProps {
  children: ReactNode;
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
      
      // Si tanquem la pestanya activa, activem la següent disponible i naveguem
      if (activeTabId === tabId) {
        const currentIndex = prevTabs.findIndex(tab => tab.id === tabId);
        const nextTab = updatedTabs[currentIndex] || updatedTabs[currentIndex - 1];
        
        if (nextTab) {
          setActiveTabId(nextTab.id);
          navigate(nextTab.path);
        } else {
          // Si no queden tabs, anar al Dashboard
          setActiveTabId(null);
          navigate('/');
        }
      }
      
      return updatedTabs;
    });
  };

  const setActiveTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const closeAllTabs = () => {
    setTabs([]);
    setActiveTabId(null);
    navigate('/');
  };

  return (
    <TabsContext.Provider value={{
      tabs,
      activeTabId,
      openTab,
      closeTab,
      setActiveTab,
      closeAllTabs
    }}>
      {children}
    </TabsContext.Provider>
  );
};