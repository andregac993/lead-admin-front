"use client";

import {
  Badge,
  Calendar,
  Eye,
  Mail,
  MoreVertical,
  Phone,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteLeadAction } from "@/lib/server/leads";
import { formatDate } from "@/lib/utils";
import type { Lead } from "@/types/lead";

interface LeadsTableProps {
  leads: Lead[];
  landingPageId?: string;
}

export function LeadsTable({ leads, landingPageId }: LeadsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    lead: Lead | null;
  }>({
    open: false,
    lead: null,
  });

  const handleViewDetails = (leadId: string) => {
    if (!landingPageId) {
      toast.error("ID da landing page não encontrado");
      return;
    }
    router.push(`/landing-pages/${landingPageId}/leads/${leadId}`);
  };

  const openDeleteDialog = (lead: Lead) => {
    setConfirmDialog({ open: true, lead });
  };

  const handleConfirmDelete = async () => {
    if (!confirmDialog.lead) return;

    if (!landingPageId) {
      toast.error("ID da landing page não encontrado");
      return;
    }

    setDeletingId(confirmDialog.lead.id);
    startTransition(async () => {
      await deleteLeadAction(confirmDialog.lead!.id, landingPageId);
      setConfirmDialog({ open: false, lead: null });
    });
  };

  const isDeleting = (leadId: string) => isPending && deletingId === leadId;

  // Helper para acessar utmSource de forma segura (suporta tanto flat quanto nested)
  const getUtmSource = (lead: Lead) => {
    return (lead as any).tracking?.utmSource || (lead as any).utmSource || null;
  };

  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum lead encontrado para esta landing page.
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Lead</TableHead>
                <TableHead className="font-semibold">Contato</TableHead>
                <TableHead className="font-semibold">Origem</TableHead>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => {
                const utmSource = getUtmSource(lead);
                console.log(utmSource);
                return (
                  <TableRow
                    key={lead.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{lead.name}</div>
                        {lead.position && (
                          <div className="text-xs text-muted-foreground">
                            {lead.position}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <a
                            href={`mailto:${lead.email}`}
                            className="hover:underline hover:text-foreground"
                          >
                            {lead.email}
                          </a>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            <a
                              href={`tel:${lead.phone}`}
                              className="hover:underline hover:text-foreground"
                            >
                              {lead.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {utmSource ? (
                        <div className="space-y-1">
                          <span className="text-sm text-muted-foreground">
                            {utmSource}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Manual
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(lead.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={isDeleting(lead.id)}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(lead.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(lead)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="md:hidden divide-y">
          {leads.map((lead) => {
            const utmSource = getUtmSource(lead);

            return (
              <div key={lead.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="font-medium truncate">{lead.name}</div>
                    {lead.position && (
                      <div className="text-xs text-muted-foreground">
                        {lead.position}
                      </div>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                        disabled={isDeleting(lead.id)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewDetails(lead.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(lead)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`mailto:${lead.email}`}
                      className="hover:underline truncate"
                    >
                      {lead.email}
                    </a>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                      <a href={`tel:${lead.phone}`} className="hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    {utmSource ? (
                      <div className="space-y-1">
                        <span className="text-sm text-muted-foreground">
                          {utmSource}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Manual
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(lead.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ open, lead: null })}
        onConfirm={handleConfirmDelete}
        title="Excluir Lead"
        description={
          confirmDialog.lead
            ? `Tem certeza que deseja excluir o lead "${confirmDialog.lead.name}"? Esta ação não pode ser desfeita.`
            : ""
        }
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
}
