import { FileText, TrendingUp, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ApiKeyManager } from "@/components/dashboard/api-key-manager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import { getApiKeyStatus, getDashboardStats } from "@/lib/server/dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const stats = await getDashboardStats();
  const apiKeyStatus = await getApiKeyStatus();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 md:p-8 lg:p-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-balance">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Acompanhe suas métricas e gerencie suas integrações
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">
                  Total de Leads
                </CardDescription>
                <div className="p-2.5 rounded-lg bg-chart-1/10 border border-chart-1/20">
                  <Users className="h-5 w-5 text-chart-1" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold tracking-tight">
                  {stats.totalLeads.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                  <span>+12% este mês</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardDescription className="text-sm font-medium">
                  Landing Pages
                </CardDescription>
                <div className="p-2.5 rounded-lg bg-chart-2/10 border border-chart-2/20">
                  <FileText className="h-5 w-5 text-chart-2" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-4xl font-bold tracking-tight">
                  {stats.totalLandingPages}
                </div>
                <p className="text-sm text-muted-foreground">Páginas ativas</p>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <ApiKeyManager hasApiKey={!!apiKeyStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}
