import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LeadEditForm } from "@/components/leads/lead-edit-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getLandingPageById } from "@/lib/server/landing-pages";
import { getLeadByIdServer } from "@/lib/server/leads";

interface LeadDetailPageProps {
  params: Promise<{
    id: string;
    leadId: string;
  }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id: landingPageId, leadId } = await params;
  let landingPageName = "";
  let lead = null;
  let error: string | null = null;

  try {
    const landingPage = await getLandingPageById(landingPageId);

    if (!landingPage) {
      error = "Landing page não encontrada";
    } else {
      landingPageName = landingPage.name;
      const leadData = await getLeadByIdServer(leadId);
      lead = leadData.lead;
    }
  } catch (err) {
    error = "Erro ao carregar dados do lead";
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link
            href="/landing-pages"
            className="hover:text-foreground transition-colors truncate"
          >
            Landing Pages
          </Link>
          <span className="flex-shrink-0">/</span>
          <Link
            href={`/landing-pages/${landingPageId}`}
            className="hover:text-foreground transition-colors truncate max-w-[150px] sm:max-w-none"
            title={landingPageName || "Landing Page"}
          >
            {landingPageName || "Landing Page"}
          </Link>
          <span className="flex-shrink-0">/</span>
          <span className="text-foreground font-medium truncate">
            Editar Lead
          </span>
        </nav>

        <Link
          href={`/landing-pages/${landingPageId}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8 group"
        >
          <ChevronLeft className="h-4 w-4 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
          <span className="truncate">Voltar para lista de leads</span>
        </Link>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance break-words">
            {lead?.name || "Detalhes do Lead"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base lg:text-lg">
            Visualize e edite as informações do lead
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!error && lead && (
          <LeadEditForm lead={lead} landingPageId={landingPageId} />
        )}
      </div>
    </div>
  );
}
