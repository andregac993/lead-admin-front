import { Calendar, ExternalLink, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLandingPagesServer } from "@/lib/server/landing-pages";
import type { LandingPage } from "@/types/landing-page";

export default async function LandingPagesPage() {
  let landingPages: LandingPage[] = [];
  let error: string | null = null;

  try {
    const data = await getLandingPagesServer();
    landingPages = data.landingPages;
  } catch (err) {
    error = "Erro ao carregar landing pages";
    console.error(err);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-balance">
                Landing Pages
              </h1>
              <p className="text-muted-foreground mt-1.5 text-pretty">
                Gerencie e monitore todas as suas landing pages em um só lugar
              </p>
            </div>
            <Button size="lg" className="gap-2 shadow-sm">
              <Plus className="size-4" />
              Nova Landing Page
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="flex items-center gap-3 py-6">
              <div className="size-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <FileText className="size-5 text-destructive" />
              </div>
              <div>
                <p className="font-medium text-destructive">{error}</p>
                <p className="text-sm text-destructive/80 mt-0.5">
                  Tente recarregar a página ou entre em contato com o suporte
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!error && landingPages.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <FileText className="size-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Nenhuma landing page ainda
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md text-pretty">
                Comece criando sua primeira landing page para capturar leads e
                expandir seu negócio
              </p>
              <Button size="lg" className="gap-2">
                <Plus className="size-4" />
                Criar Primeira Landing Page
              </Button>
            </CardContent>
          </Card>
        )}

        {!error && landingPages.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {landingPages.length}{" "}
                {landingPages.length === 1 ? "landing page" : "landing pages"}{" "}
                encontrada
                {landingPages.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {landingPages.map((lp) => (
                <Link
                  key={lp.id}
                  href={`/landing-pages/${lp.id}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1">
                    <CardHeader className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="size-6 text-primary" />
                        </div>
                        <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
                          {lp.name}
                        </CardTitle>
                        <CardDescription className="mt-1.5 flex items-center gap-1.5 text-xs">
                          <Calendar className="size-3" />
                          ID: {lp.id}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-muted-foreground">Ativa</span>
                      </div>
                      <div className="pt-2 border-t">
                        <span className="text-sm font-medium text-primary group-hover:underline inline-flex items-center gap-1.5">
                          Ver detalhes
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            →
                          </span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
