
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Actions from "./pages/Actions";
import ActionDetail from "./pages/ActionDetail";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Testing from "./pages/Testing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50" style={{ display: 'grid', gridTemplateRows: '80px 1fr', gridTemplateColumns: 'auto 1fr' }}>
        {/* Header que ocupa tota la fila superior */}
        <div style={{ gridColumn: '1 / -1', gridRow: '1' }}>
          <Header />
        </div>
        
        {/* Sidebar a la columna esquerra, fila inferior */}
        <div style={{ gridColumn: '1', gridRow: '2' }}>
          <AppSidebar />
        </div>
        
        {/* Contingut principal a la columna dreta, fila inferior */}
        <main className="p-6" style={{ gridColumn: '2', gridRow: '2' }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/actions" element={<Actions />} />
            <Route path="/actions/:id" element={<ActionDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/users" element={<Users />} />
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
