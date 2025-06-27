
# Design System Knowledge Base - Sistema Visual i Comportamental Complet

## 1. Sistema de Colors i Temes [MANTINGUT]
[La secció anterior es manté igual]

## 2. Configuració Tailwind Reutilitzable [MANTINGUT]
[La secció anterior es manté igual]

## 3. Sidebar System Complet amb Comportaments [MANTINGUT]
[Tota la secció del Sidebar es manté igual com estava]

## 4. Sistema de Tabs Complet amb Navegació Dinàmica

### TabsContext Pattern amb TypeScript

```typescript
// Interface per Tab individual
export interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  closable?: boolean; // false per tabs que no es poden tancar (Dashboard)
}

// Context Type complet
interface TabsContextType {
  tabs: Tab[];
  activeTabId: string | null;
  openTab: (tab: Tab) => void;
  closeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  closeAllTabs: () => void;
}

// Context Provider amb navegació automàtica
export const TabsProvider = ({ children }: TabsProviderProps) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const navigate = useNavigate();

  const openTab = (newTab: Tab) => {
    setTabs(prevTabs => {
      // Evitar duplicats basats en path
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
      
      // Lògica de fallback automàtica quan es tanca tab actiu
      if (activeTabId === tabId) {
        const currentIndex = prevTabs.findIndex(tab => tab.id === tabId);
        const nextTab = updatedTabs[currentIndex] || updatedTabs[currentIndex - 1];
        
        if (nextTab) {
          setActiveTabId(nextTab.id);
          navigate(nextTab.path); // Auto-navegació
        } else {
          // Si no queden tabs, tornar al Dashboard
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
    <TabsContext.Provider value={{ tabs, activeTabId, openTab, closeTab, setActiveTab, closeAllTabs }}>
      {children}
    </TabsContext.Provider>
  );
};
```

### Hook useTabNavigation amb Configuració de Rutes

```typescript
// Configuració de rutes amb metadades
const routeConfig: Record<string, Omit<Tab, 'id'>> = {
  '/': {
    title: 'Dashboard',
    path: '/',
    icon: Home,
    closable: false // Dashboard sempre obert
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

  useEffect(() => {
    const currentPath = location.pathname;
    
    // Gestió especial per rutes dinàmiques
    if (currentPath.startsWith('/actions/')) {
      const actionId = currentPath.split('/')[2];
      const tab: Tab = {
        id: `action-${actionId}`,
        title: `Acció ${actionId}`,
        path: currentPath,
        icon: Eye,
        closable: true
      };
      openTab(tab);
      return;
    }

    // Configuració automàtica per rutes principals
    const routeInfo = routeConfig[currentPath];
    if (routeInfo) {
      const tab: Tab = {
        id: currentPath,
        ...routeInfo
      };
      openTab(tab);
    }
  }, [location.pathname, openTab]);

  // Sincronització entre URL i tab actiu
  useEffect(() => {
    const currentPath = location.pathname;
    let tabId = currentPath;
    
    // ID especial per rutes dinàmiques
    if (currentPath.startsWith('/actions/')) {
      const actionId = currentPath.split('/')[2];
      tabId = `action-${actionId}`;
    }
    
    const existingTab = tabs.find(tab => tab.id === tabId);
    if (existingTab) {
      setActiveTab(tabId);
    }
  }, [location.pathname, tabs, setActiveTab]);
};
```

### Component TabsNavigation amb UI Sofisticada

```typescript
const TabsNavigation = () => {
  const { tabs, activeTabId, closeTab, setActiveTab } = useTabsContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id);
    navigate(tab.path);
  };

  const handleCloseTab = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    closeTab(tabId);
  };

  return (
    <div className="bg-white border-b border-gray-200 pl-6 pr-6 min-h-[48px]">
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
```

### Layout Integration Pattern

```typescript
// App.tsx amb integració completa
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  useTabNavigation(); // Hook automàtic per gestió de tabs

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50" 
           style={{ 
             display: 'grid', 
             gridTemplateRows: '80px auto 1fr', 
             gridTemplateColumns: 'auto 1fr' 
           }}>
        
        {/* Header que ocupa tota la fila superior */}
        <div style={{ gridColumn: '1 / -1', gridRow: '1' }}>
          <Header />
        </div>
        
        {/* Pestanyes que només ocupen la columna dreta */}
        <div style={{ gridColumn: '2', gridRow: '2' }}>
          <TabsNavigation />
        </div>
        
        {/* Sidebar a la columna esquerra */}
        <div style={{ gridColumn: '1', gridRow: '3' }}>
          <AppSidebar />
        </div>
        
        {/* Contingut principal */}
        <main className="p-6" style={{ gridColumn: '2', gridRow: '3' }}>
          <Routes>
            {/* Rutes principals */}
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

// Wrapper principal amb tots els providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <TabsProvider>  {/* TabsProvider wrapper essencial */}
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </TabsProvider>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);
```

## 5. Comportaments Específics del Sistema de Tabs

### Auto-Apertura de Tabs
- **Rutes principals**: S'obren automàticament quan es navega
- **Rutes dinàmiques**: Detecció automàtica de patterns com `/actions/:id`
- **Evitació de duplicats**: Basada en `path` per evitar tabs repetits

### Gestió de Tancament Intel·ligent
- **Tab actiu tancat**: Auto-navegació al tab adjacent o anterior
- **Fallback a Dashboard**: Si no queden tabs, tornar a '/'
- **Tabs no tancables**: Dashboard i altres rutes essencials

### Sincronització URL-Tabs
- **Navegació external**: URL changes auto-activen tabs corresponents
- **Navegació interna**: Tab clicks actualitzen URL automàticament
- **Deep linking**: URLs directs obren tabs correctes

### Interfície Visual Avançada
- **Estats visuals**: Actiu/inactiu amb colors específics
- **Hover effects**: Transicions suaus i feedback visual
- **Scroll horitzontal**: Per gestionar moltes tabs obertes
- **Truncat de text**: Títols llargs amb ellipsis automàtic
- **Iconografia**: Cada tab amb icona representativa

### Responsive Behavior
- **Scroll automàtic**: Quan hi ha més tabs que espai disponible
- **Touch friendly**: Funciona correctament en dispositius mòbils
- **Flex shrink**: Components que s'adapten automàticament

## 6. CSS Classes per Tabs System

```css
/* Scrollbar hide per tabs overflow */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Tab states */
.tab-active {
  @apply bg-blue-50 text-blue-700 border-b-2 border-blue-600;
}

.tab-inactive {
  @apply text-gray-600 hover:text-gray-900 hover:bg-gray-50;
}

/* Tab transitions */
.tab-transition {
  @apply transition-all duration-200;
}

/* Close button behavior */
.tab-close-btn {
  @apply opacity-0 group-hover:opacity-100 transition-opacity;
}

.tab-active .tab-close-btn {
  @apply opacity-100;
}
```

## 7. Patterns d'Ús del Sistema de Tabs

### Creació de Tabs Programàtica
```typescript
// Dins d'un component
const { openTab } = useTabsContext();

const handleOpenAction = (actionId: string) => {
  openTab({
    id: `action-${actionId}`,
    title: `Acció ${actionId}`,
    path: `/actions/${actionId}`,
    icon: Eye,
    closable: true
  });
};
```

### Gestió d'Estats Especials
```typescript
// Tab condicionals segons permisos
const { user } = useAuth();
const adminTabs = user?.role === 'admin' ? [
  { id: '/users', title: 'Usuaris', path: '/users', icon: Users }
] : [];
```

### Integration amb React Router
```typescript
// Link components que obren tabs automàticament
<Link to="/actions/123">  {/* Auto-obre tab per aquesta acció */}
  Veure Acció 123
</Link>
```

Aquest sistema de tabs proporciona una experiència d'usuari sofisticada amb navegació per pestanyes, gestió intel·ligent d'estat i integració completa amb React Router, mantenint sincronització perfecta entre URL i interfície visual.

## 8. Navigation amb Estats Actius [MANTINGUT]
[La secció anterior es manté igual]

## 9. Variables CSS Sidebar Específiques [MANTINGUT]
[La secció anterior es manté igual]

## 10. Layout Pattern amb Sidebar Funcional [MANTINGUT]
[La secció anterior es manté igual]
