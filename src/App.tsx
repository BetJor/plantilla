
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { TabsProvider } from "@/contexts/TabsContext";
import { useTabNavigation } from "@/hooks/useTabNavigation";
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
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50" style={{ display: 'grid', gridTemplateRows: '80px auto 1fr', gridTemplateColumns: 'auto 1fr' }}>
        {/* Header que ocupa tota la fila superior */}
        <div style={{ gridColumn: '1 / -1', gridRow: '1' }}>
          <Header />
        </div>
        
        {/* Pestanyes que només ocupen la columna dreta */}
        <div style={{ gridColumn: '2', gridRow: '2' }}>
          <TabsNavigation />
        </div>
        
        {/* Sidebar a la columna esquerra, fila inferior */}
        <div style={{ gridColumn: '1', gridRow: '3' }}>
          <AppSidebar />
        </div>
        
        {/* Contingut principal a la columna dreta, fila inferior */}
        <main className="p-6" style={{ gridColumn: '2', gridRow: '3' }}>
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
  </QueryClientProvider>
);

export default App;
