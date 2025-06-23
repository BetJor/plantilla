
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  closeTab: (tabId: string, onTabClosed?: (nextActiveTab: Tab | null) => void) => void;
  setActiveTab: (tabId: string) => void;
  closeAllTabs: (onAllTabsClosed?: () => void) => void;
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

  const closeTab = (tabId: string, onTabClosed?: (nextActiveTab: Tab | null) => void) => {
    setTabs(prevTabs => {
      const currentIndex = prevTabs.findIndex(tab => tab.id === tabId);
      const updatedTabs = prevTabs.filter(tab => tab.id !== tabId);
      
      let nextActiveTab: Tab | null = null;
      
      // Si tanquem la pestanya activa, activem la següent disponible
      if (activeTabId === tabId) {
        if (updatedTabs.length > 0) {
          // Prioritzar la pestanya anterior (índex - 1) abans que la següent
          nextActiveTab = updatedTabs[currentIndex - 1] || updatedTabs[currentIndex] || updatedTabs[0];
          setActiveTabId(nextActiveTab.id);
        } else {
          // No queden pestanyes
          setActiveTabId(null);
          nextActiveTab = null;
        }
      }
      
      // Cridar el callback amb la pestanya que es converteix en activa
      if (onTabClosed) {
        onTabClosed(nextActiveTab);
      }
      
      return updatedTabs;
    });
  };

  const setActiveTab = (tabId: string) => {
    setActiveTabId(tabId);
  };

  const closeAllTabs = (onAllTabsClosed?: () => void) => {
    setTabs([]);
    setActiveTabId(null);
    
    // Cridar el callback quan es tanquin totes les pestanyes
    if (onAllTabsClosed) {
      onAllTabsClosed();
    }
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
