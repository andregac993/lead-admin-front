import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    });
  } catch {
    return dateString;
  }
};

export const formatDateToISO = (
  dateString: string | undefined | null,
): string | undefined => {
  if (!dateString || dateString === "") {
    return undefined;
  }

  try {
    if (dateString.includes("T")) {
      return dateString;
    }
    const date = new Date(`${dateString}T00:00:00.000Z`);
    return date.toISOString();
  } catch {
    return undefined;
  }
};
