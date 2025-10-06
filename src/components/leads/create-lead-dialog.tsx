"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createLeadAction } from "@/lib/server/leads";
import { formatDateToISO } from "@/lib/utils";
import { type CreateLeadInput, createLeadSchema } from "@/lib/validations/lead";

interface CreateLeadDialogProps {
  landingPageId: string;
}

export function CreateLeadDialog({ landingPageId }: CreateLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      landingPageId,
      name: "",
      email: "",
      phone: "",
      position: "",
      dateOfBirth: "",
      message: "",
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmTerm: "",
      utmContent: "",
      gclid: "",
      fbclid: "",
    },
  });

  const onSubmit = (data: CreateLeadInput) => {
    const formattedData = {
      ...data,
      dateOfBirth: data.dateOfBirth
        ? formatDateToISO(data.dateOfBirth)
        : undefined,
    };

    startTransition(async () => {
      const result = await createLeadAction(formattedData as CreateLeadInput);

      if (result.success) {
        reset();
        setOpen(false);
      } else {
        setError("root", { message: result.error || "Erro ao criar lead" });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Lead
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl">Adicionar Novo Lead</DialogTitle>
          <DialogDescription>
            Preencha as informações do lead. Campos marcados com * são
            obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="px-6">
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h3 className="text-sm font-semibold">Informações Básicas</h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label
                      htmlFor="create-name"
                      className="text-sm font-medium"
                    >
                      Nome <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="create-name"
                      {...register("name")}
                      placeholder="Nome completo"
                      disabled={isPending}
                      className="h-10"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="create-email"
                      className="text-sm font-medium"
                    >
                      E-mail <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="create-email"
                      type="email"
                      {...register("email")}
                      placeholder="email@exemplo.com"
                      disabled={isPending}
                      className="h-10"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="create-phone"
                      className="text-sm font-medium"
                    >
                      Telefone
                    </Label>
                    <Input
                      id="create-phone"
                      {...register("phone")}
                      placeholder="+55 11 98888-8888"
                      disabled={isPending}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="create-position"
                      className="text-sm font-medium"
                    >
                      Cargo
                    </Label>
                    <Input
                      id="create-position"
                      {...register("position")}
                      placeholder="Ex: Desenvolvedor"
                      disabled={isPending}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="create-dateOfBirth"
                      className="text-sm font-medium"
                    >
                      Data de Nascimento
                    </Label>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            field.onChange(date ? date.toISOString() : "");
                          }}
                          disabled={isPending}
                          placeholder="Selecione a data de nascimento"
                        />
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="create-message"
                    className="text-sm font-medium"
                  >
                    Mensagem
                  </Label>
                  <textarea
                    id="create-message"
                    {...register("message")}
                    placeholder="Mensagem do lead..."
                    disabled={isPending}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>
              </div>

              <div className="space-y-4 pb-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <div className="h-8 w-1 bg-muted-foreground rounded-full" />
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Parâmetros UTM (Opcional)
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="create-utmSource" className="text-sm">
                      UTM Source
                    </Label>
                    <Input
                      id="create-utmSource"
                      {...register("utmSource")}
                      placeholder="Ex: google, facebook"
                      disabled={isPending}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-utmMedium" className="text-sm">
                      UTM Medium
                    </Label>
                    <Input
                      id="create-utmMedium"
                      {...register("utmMedium")}
                      placeholder="Ex: cpc, organic"
                      disabled={isPending}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-utmCampaign" className="text-sm">
                      UTM Campaign
                    </Label>
                    <Input
                      id="create-utmCampaign"
                      {...register("utmCampaign")}
                      placeholder="Nome da campanha"
                      disabled={isPending}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-utmTerm" className="text-sm">
                      UTM Term
                    </Label>
                    <Input
                      id="create-utmTerm"
                      {...register("utmTerm")}
                      placeholder="Palavras-chave"
                      disabled={isPending}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-utmContent" className="text-sm">
                      UTM Content
                    </Label>
                    <Input
                      id="create-utmContent"
                      {...register("utmContent")}
                      placeholder="Conteúdo específico"
                      disabled={isPending}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-gclid" className="text-sm">
                      GCLID
                    </Label>
                    <Input
                      id="create-gclid"
                      {...register("gclid")}
                      placeholder="Google Click ID"
                      disabled={isPending}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="create-fbclid" className="text-sm">
                      FBCLID
                    </Label>
                    <Input
                      id="create-fbclid"
                      {...register("fbclid")}
                      placeholder="Facebook Click ID"
                      disabled={isPending}
                      className="h-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {errors.root && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm mb-4 flex items-start gap-2 mx-6">
                <svg
                  className="h-4 w-4 mt-0.5 flex-shrink-0"
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
                {errors.root.message}
              </div>
            )}
          </form>
        </ScrollArea>

        <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t bg-background">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Lead"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
