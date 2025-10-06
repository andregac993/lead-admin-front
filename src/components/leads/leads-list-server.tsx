import { CreateLeadDialog } from "@/components/leads/create-lead-dialog";
import { ExportLeadsButton } from "@/components/leads/export-leads-button";
import { LeadsSearchInput } from "@/components/leads/leads-search-input";
import { LeadsTable } from "@/components/leads/leads-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Lead } from "@/types/lead";

interface LeadsListServerProps {
  landingPageId: string;
  leads: Lead[];
}

export function LeadsListServer({
  landingPageId,
  leads,
}: LeadsListServerProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-xl">Leads Capturados</CardTitle>
            <CardDescription className="mt-1.5">
              Gerencie e acompanhe todos os leads desta landing page
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <LeadsSearchInput landingPageId={landingPageId} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <ExportLeadsButton
              landingPageId={landingPageId}
              disabled={leads.length === 0}
            />
            <CreateLeadDialog landingPageId={landingPageId} />
          </div>
        </div>

        <LeadsTable leads={leads} landingPageId={landingPageId} />
      </CardContent>
    </Card>
  );
}
