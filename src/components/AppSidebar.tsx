
import { BarChart3, Settings, FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { 
  useSidebarPersistence, 
  useResponsiveSidebar, 
  useSidebarKeyboardShortcuts 
} from "@/hooks/useSidebarEnhancements";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Informes",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Configuració",
    url: "/settings",
    icon: Settings,
  },
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  // Use enhanced sidebar hooks
  useSidebarPersistence();
  useResponsiveSidebar();
  useSidebarKeyboardShortcuts();

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar variant="inset" className="transition-all duration-300">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicació</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} className="transition-colors">
                      <item.icon />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
