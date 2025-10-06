"use client";

import { Download, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { exportLeadsToCSV } from "@/lib/server/leads";

interface ExportLeadsButtonProps {
  landingPageId: string;
  disabled?: boolean;
}

export function ExportLeadsButton({
  landingPageId,
  disabled,
}: ExportLeadsButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleExport = () => {
    startTransition(async () => {
      const result = await exportLeadsToCSV(landingPageId);

      if (result.success && result.csvData && result.filename) {
        // Criar blob e fazer download
        const blob = new Blob([result.csvData], {
          type: "text/csv;charset=utf-8;",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Leads exportados com sucesso!");
      } else {
        toast.error(result.error || "Erro ao exportar leads");
      }
    });
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isPending || disabled}
      variant="outline"
      className="whitespace-nowrap"
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Exportando...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Exportar Excel
        </>
      )}
    </Button>
  );
}
