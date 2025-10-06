import { FileText, Home } from "lucide-react";
import { redirect } from "next/navigation";
import type React from "react";
import { auth } from "@/auth";
import LogoutButton from "@/components/auth/logout-button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Lead Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {session.user?.email}
            </p>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/dashboard">
                  <Home className="size-4" />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/landing-pages">
                  <FileText className="size-4" />
                  <span>Landing Pages</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <LogoutButton />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger />
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
