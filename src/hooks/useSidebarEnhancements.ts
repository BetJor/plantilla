
import { useEffect, useState } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

export const useSidebarPersistence = () => {
  const { state, toggleSidebar } = useSidebar();
  
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-state');
    if (savedState && savedState !== state) {
      // Only toggle if states are different
      if ((savedState === 'collapsed' && state === 'expanded') || 
          (savedState === 'expanded' && state === 'collapsed')) {
        toggleSidebar();
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebar-state', state);
  }, [state]);
};

export const useResponsiveSidebar = () => {
  const { toggleSidebar, state } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile && state === 'expanded') {
        toggleSidebar();
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [toggleSidebar, state]);

  return { isMobile };
};

export const useSidebarKeyboardShortcuts = () => {
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [toggleSidebar]);
};
