import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="h-16 flex items-center justify-between border-b border-border bg-card px-4 lg:px-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9 w-60 h-10 bg-secondary border-0 rounded-md focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                <Bell className="w-[18px] h-[18px]" />
              </button>
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-semibold">
                M
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
