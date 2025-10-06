import { BarChart3, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LeadsListServer } from "@/components/leads/leads-list-server";
import { getLandingPageById } from "@/lib/server/landing-pages";
import { getLeadsByLandingPageServer } from "@/lib/server/leads";
import type { Lead } from "@/types/lead";

interface LandingPageDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    search?: string;
  }>;
}

export default async function LandingPageDetailPage({
  params,
  searchParams,
}: LandingPageDetailPageProps) {
  const { id } = await params;
  const { search } = await searchParams;

  let landingPageName = "";
  let leads: Lead[] = [];
  let totalLeads = 0;
  let error: string | null = null;

  try {
    const landingPage = await getLandingPageById(id);

    if (!landingPage) {
      error = "Landing page não encontrada";
    } else {
      landingPageName = landingPage.name;
      const leadsData = await getLeadsByLandingPageServer(id, search);
      leads = leadsData.leads;
      totalLeads = leadsData.pagination.total;
    }
  } catch (err) {
    error = "Erro ao carregar dados";
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/landing-pages"
            prefetch={false}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para Landing Pages
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance">
                {landingPageName || "Landing Page"}
              </h1>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <div className="text-left">
                <div className="text-2xl font-bold">{totalLeads}</div>
                <div className="text-xs text-muted-foreground">
                  {totalLeads === 1 ? "Lead" : "Leads"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error ? (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
            <svg
              className="h-5 w-5 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium">Erro ao carregar dados</p>
              <p className="text-sm mt-1 opacity-90">{error}</p>
            </div>
          </div>
        ) : (
          <LeadsListServer landingPageId={id} leads={leads} />
        )}
      </div>
    </div>
  );
}
