
import React from 'react';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTabsContext } from '@/contexts/TabsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const TabsNavigation = () => {
  const { tabs, activeTabId, closeTab, setActiveTab } = useTabsContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab: any) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    closeTab(tabId, (nextActiveTab) => {
      if (nextActiveTab) {
        // Navegar automàticament a la pestanya que es converteix en activa
        navigate(nextActiveTab.path);
      } else {
        // No queden pestanyes, navegar al dashboard
        navigate('/');
      }
    });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 min-h-[48px]">
      <div className="flex items-center overflow-x-auto scrollbar-hide">
        {tabs.length > 0 ? (
          <div className="flex space-x-1 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTabId === tab.id;
              
              return (
                <div
                  key={tab.id}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg cursor-pointer transition-all duration-200 group relative min-w-0",
                    isActive 
                      ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={() => handleTabClick(tab)}
                >
                  {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                  <span className="truncate max-w-[150px]">{tab.title}</span>
                  {tab.closable !== false && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0",
                        isActive && "opacity-100"
                      )}
                      onClick={(e) => handleCloseTab(e, tab.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center py-2 text-sm text-gray-400">
            {/* Espai reservat per les pestanyes */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsNavigation;
