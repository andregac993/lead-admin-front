"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { ConfirmDialog } from "@/components/shared/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteLeadAction, updateLeadAction } from "@/lib/server/leads";
import { formatDate, formatDateToISO } from "@/lib/utils";
import { type UpdateLeadInput, updateLeadSchema } from "@/lib/validations/lead";
import type { Lead } from "@/types/lead";

interface LeadEditFormProps {
  lead: Lead;
  landingPageId: string;
}

export function LeadEditForm({ lead, landingPageId }: LeadEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    lead: Lead | null;
  }>({
    open: false,
    lead: null,
  });

  const defaultValues: UpdateLeadInput = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone || "",
    position: lead.position || "",
    dateOfBirth: lead.dateOfBirth || "",
    message: lead.message || "",
    utmSource: lead.tracking?.utmSource || "",
    utmMedium: lead.tracking?.utmMedium || "",
    utmCampaign: lead.tracking?.utmCampaign || "",
    utmTerm: lead.tracking?.utmTerm || "",
    utmContent: lead.tracking?.utmContent || "",
    gclid: lead.tracking?.gclid || "",
    fbclid: lead.tracking?.fbclid || "",
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, dirtyFields },
    setError,
  } = useForm<UpdateLeadInput>({
    resolver: zodResolver(updateLeadSchema),
    defaultValues,
  });

  const onSubmit = (data: UpdateLeadInput) => {
    const changedFields = Object.keys(dirtyFields).reduce(
      (acc, key) => {
        const fieldKey = key as keyof UpdateLeadInput;
        const value = data[fieldKey];

        if (value !== undefined && value !== "") {
          if (fieldKey === "dateOfBirth") {
            const isoDate = formatDateToISO(value as string);
            if (isoDate) {
              acc[fieldKey] = isoDate as any;
            }
          } else {
            acc[fieldKey] = value as any;
          }
        }

        return acc;
      },
      {} as Partial<UpdateLeadInput>,
    );

    startTransition(async () => {
      const result = await updateLeadAction(
        lead.id,
        changedFields as UpdateLeadInput,
        landingPageId,
      );

      if (!result.success) {
        setError("root", { message: result.error || "Erro ao atualizar lead" });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteLeadAction(lead.id, landingPageId);
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6 w-full"
      >
        <Card className="w-full">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">
              Informações Básicas
            </CardTitle>
            <CardDescription className="text-sm">
              Dados principais do lead
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  Nome *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Nome completo"
                  disabled={isPending}
                  className="w-full"
                />
                {errors.name && (
                  <p className="text-xs sm:text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">
                  E-mail *
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="email@exemplo.com"
                  disabled={isPending}
                  className="w-full"
                />
                {errors.email && (
                  <p className="text-xs sm:text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+55 11 98888-8888"
                  disabled={isPending}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm">
                  Cargo
                </Label>
                <Input
                  id="position"
                  {...register("position")}
                  placeholder="Ex: Desenvolvedor"
                  disabled={isPending}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm">
                  Data de Nascimento
                </Label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={field.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        field.onChange(
                          date ? formatDateToISO(date.toISOString()) : "",
                        );
                      }}
                      disabled={isPending}
                      placeholder="Selecione a data de nascimento"
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm">
                Mensagem
              </Label>
              <textarea
                id="message"
                {...register("message")}
                placeholder="Mensagem do lead..."
                disabled={isPending}
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">
              Parâmetros de Rastreamento (UTM)
            </CardTitle>
            <CardDescription className="text-sm">
              Informações de origem da conversão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="utmSource" className="text-sm">
                  UTM Source
                </Label>
                <Input
                  id="utmSource"
                  {...register("utmSource")}
                  placeholder="Ex: google, facebook"
                  disabled={isPending}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utmMedium" className="text-sm">
                  UTM Medium
                </Label>
                <Input
                  id="utmMedium"
                  {...register("utmMedium")}
                  placeholder="Ex: cpc, organic"
                  disabled={isPending}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utmCampaign" className="text-sm">
                  UTM Campaign
                </Label>
                <Input
                  id="utmCampaign"
                  {...register("utmCampaign")}
                  placeholder="Nome da campanha"
                  disabled={isPending}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utmTerm" className="text-sm">
                  UTM Term
                </Label>
                <Input
                  id="utmTerm"
                  {...register("utmTerm")}
                  placeholder="Palavras-chave"
                  disabled={isPending}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utmContent" className="text-sm">
                  UTM Content
                </Label>
                <Input
                  id="utmContent"
                  {...register("utmContent")}
                  placeholder="Conteúdo específico"
                  disabled={isPending}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gclid" className="text-sm">
                  GCLID (Google Ads)
                </Label>
                <Input
                  id="gclid"
                  {...register("gclid")}
                  placeholder="ID de clique do Google"
                  disabled={isPending}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fbclid" className="text-sm">
                  FBCLID (Facebook Ads)
                </Label>
                <Input
                  id="fbclid"
                  {...register("fbclid")}
                  placeholder="ID de clique do Facebook"
                  disabled={isPending}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">Metadados</CardTitle>
            <CardDescription className="text-sm">
              Informações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs sm:text-sm text-muted-foreground px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
              <span className="font-medium">Criado em:</span>
              <span className="text-right">{formatDate(lead.createdAt)}</span>
            </div>
            {lead.updatedAt && (
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                <span className="font-medium">Última atualização:</span>
                <span className="text-right">{formatDate(lead.updatedAt)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {errors.root && (
          <div className="bg-destructive/10 text-destructive p-3 rounded text-xs sm:text-sm break-words">
            {errors.root.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pb-4">
          <Button
            type="submit"
            disabled={isPending || !isDirty}
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={() => setConfirmDialog({ open: true, lead })}
            disabled={isPending}
            variant="destructive"
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar Lead
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ open, lead: null })}
        onConfirm={handleDelete}
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
