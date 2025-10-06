"use client";

import { Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";

interface LeadsSearchInputProps {
  landingPageId: string;
}

export function LeadsSearchInput({ landingPageId }: LeadsSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isPending, startTransition] = useTransition();
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";

    // Só navegar se o valor realmente mudou
    if (debouncedSearch === currentSearch) {
      return;
    }

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
      } else {
        params.delete("search");
      }

      const query = params.toString();
      const url = `/landing-pages/${landingPageId}${query ? `?${query}` : ""}`;

      router.replace(url, { scroll: false });
    });
  }, [debouncedSearch, landingPageId, router, searchParams]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Buscar por nome ou e-mail..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-9 pr-9 h-10"
      />
      {isPending && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
    </div>
  );
}
