import { Package, LayoutDashboard, UtensilsCrossed, Truck, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inventario", url: "/", icon: Package },
  { title: "Cocina", url: "/cocina", icon: UtensilsCrossed },
  { title: "Delivery", url: "/delivery", icon: Truck },
];

const configItems = [
  { title: "Configuración", url: "/configuracion", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md gradient-primary flex items-center justify-center flex-shrink-0">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">MiRest</h2>
              <p className="text-[11px] text-white/50">Sistema de gestión</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-wider text-white/40 px-3 mb-1">
            {!collapsed && "Módulos"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 rounded-md transition-all duration-200">
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 text-white/60 hover:text-white hover:bg-white/[0.08] rounded-md"
                      activeClassName="gradient-primary text-white shadow-sm !opacity-100"
                    >
                      <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                      {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {configItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-10 rounded-md">
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 text-white/60 hover:text-white hover:bg-white/[0.08] rounded-md"
                      activeClassName="gradient-primary text-white shadow-sm !opacity-100"
                    >
                      <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                      {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
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
