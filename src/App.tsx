
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TabsProvider, useTabNavigation } from "@/contexts/TabsContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import TabsNavigation from "@/components/TabsNavigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  useTabNavigation();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors" 
           style={{ 
             display: 'grid', 
             gridTemplateRows: '80px auto 1fr', 
             gridTemplateColumns: 'auto 1fr' 
           }}>
        
        <div style={{ gridColumn: '1 / -1', gridRow: '1' }}>
          <Header />
        </div>
        
        <div style={{ gridColumn: '2', gridRow: '2' }}>
          <TabsNavigation />
        </div>
        
        <div style={{ gridColumn: '1', gridRow: '3' }}>
          <AppSidebar />
        </div>
        
        <main className="p-6 overflow-auto" style={{ gridColumn: '2', gridRow: '3' }}>
          <Breadcrumbs />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <TabsProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </TooltipProvider>
          </TabsProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
