
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TabsProvider } from "@/contexts/TabsContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import TabsNavigation from "@/components/TabsNavigation";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Actions from "./pages/Actions";
import ActionDetail from "./pages/ActionDetail";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useTabNavigation } from "@/hooks/useTabNavigation";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  useTabNavigation();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 flex">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Contingut principal */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />
          
          {/* Pestanyes - aquestes començaran després de la sidebar */}
          <TabsNavigation />
          
          {/* Contingut de les pàgines */}
          <main className="flex-1 p-6">
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
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TabsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </TabsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
