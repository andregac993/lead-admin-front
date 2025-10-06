"use client";

import {
  Copy,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteApiKey, generateApiKey } from "@/lib/server/dashboard";

interface ApiKeyManagerProps {
  hasApiKey: boolean;
}

export function ApiKeyManager({
  hasApiKey: initialHasApiKey,
}: ApiKeyManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(initialHasApiKey);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const confirmed = hasApiKey
      ? confirm(
          "Gerar uma nova API Key irá invalidar a chave atual. Deseja continuar?",
        )
      : true;

    if (!confirmed) return;

    startTransition(async () => {
      const result = await generateApiKey();

      if (result.success && result.apiKey) {
        setGeneratedKey(result.apiKey);
        setShowKey(true);
        setHasApiKey(true);
        setError(null);
      } else {
        setError(result.error || "Erro ao gerar API Key");
      }
    });
  };

  const handleDelete = () => {
    const confirmed = confirm(
      "Tem certeza que deseja deletar sua API Key? Esta ação não pode ser desfeita.",
    );

    if (!confirmed) return;

    startTransition(async () => {
      const result = await deleteApiKey();

      if (result.success) {
        setGeneratedKey(null);
        setHasApiKey(false);
        setError(null);
      } else {
        setError(result.error || "Erro ao deletar API Key");
      }
    });
  };

  const handleCopy = async () => {
    if (generatedKey) {
      setCopied(true);
      await navigator.clipboard.writeText(generatedKey);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2.5 text-xl">
              <div className="p-2 rounded-lg bg-primary/5 border border-primary/10">
                <Key className="h-4 w-4 text-primary" />
              </div>
              API Key
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              Gere uma chave de API para integrar com aplicações externas de
              forma segura
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3.5 rounded-lg text-sm flex items-start gap-2">
            <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {generatedKey && (
          <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Sua API Key
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  value={generatedKey}
                  readOnly
                  className="pr-10 font-mono text-sm bg-background border-border/50 focus-visible:ring-primary/20"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="border-border/50 hover:bg-primary/5 hover:border-primary/20 transition-colors bg-transparent"
              >
                {copied ? (
                  <span className="text-xs font-medium text-primary">✓</span>
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground bg-background/50 p-3 rounded-md border border-border/30">
              <Shield className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-primary" />
              <p className="leading-relaxed">
                Esta chave será exibida apenas uma vez. Certifique-se de
                salvá-la em local seguro.
              </p>
            </div>
          </div>
        )}

        {!generatedKey && hasApiKey && (
          <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-primary/5 border border-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">API Key Ativa</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Você possui uma API Key ativa. Por segurança, não é possível
                  visualizar o valor original.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleGenerate}
            disabled={isPending}
            className="flex-1 h-10 font-medium shadow-sm hover:shadow transition-all"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Key className="h-4 w-4 mr-2" />
                {hasApiKey ? "Gerar Nova Chave" : "Gerar API Key"}
              </>
            )}
          </Button>

          {hasApiKey && (
            <Button
              onClick={handleDelete}
              disabled={isPending}
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-colors bg-transparent"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
