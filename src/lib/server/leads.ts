"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { cache } from "react";
import { auth } from "@/auth";
import {
  type CreateLeadInput,
  createLeadSchema,
  type UpdateLeadInput,
  updateLeadSchema,
} from "@/lib/validations/lead";
import type { Lead, LeadDetailResponse, LeadsResponse } from "@/types/lead";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

interface LeadActionResult {
  success: boolean;
  error?: string;
  data?: Lead;
  message?: string;
}

const getSession = cache(async (): Promise<Session> => {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login");
  }
  return session;
});

export const getLeadsByLandingPageServer = cache(
  async (landingPageId: string, search?: string): Promise<LeadsResponse> => {
    const session = await getSession();

    const params = new URLSearchParams({ landingPageId });
    if (search) params.append("search", search);

    const response = await fetch(`${API_BASE_URL}/leads?${params.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar leads");
    }

    return response.json();
  },
);

export const getLeadByIdServer = cache(
  async (leadId: string): Promise<LeadDetailResponse> => {
    const session = await getSession();

    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar lead");
    }

    return response.json();
  },
);

export async function createLeadAction(
  data: CreateLeadInput,
): Promise<LeadActionResult> {
  try {
    const session = await getSession();
    const validatedData = createLeadSchema.parse(data);

    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Erro ao criar lead",
      };
    }

    const result = await response.json();
    revalidatePath(`/landing-pages/${data.landingPageId}`);

    return { success: true, data: result.lead };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return { success: false, error: zodError.issues[0].message };
    }
    return { success: false, error: "Erro ao criar lead" };
  }
}

export async function updateLeadAction(
  leadId: string,
  data: UpdateLeadInput,
  landingPageId: string,
): Promise<LeadActionResult> {
  try {
    const session = await getSession();
    const validatedData = updateLeadSchema.parse(data);

    const cleanData = Object.fromEntries(
      Object.entries(validatedData).filter(
        ([_, v]) => v !== undefined && v !== "",
      ),
    );

    if (Object.keys(cleanData).length === 0) {
      return { success: true, message: "Nenhuma alteração detectada" };
    }

    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(cleanData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Erro ao atualizar lead",
      };
    }

    const result = await response.json();
    revalidatePath(`/landing-pages/${landingPageId}`);
    revalidatePath(`/landing-pages/${landingPageId}/leads/${leadId}`);

    return { success: true, data: result.lead };
  } catch (error: unknown) {
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return { success: false, error: zodError.issues[0].message };
    }
    return { success: false, error: "Erro ao atualizar lead" };
  }
}

export async function deleteLeadAction(
  leadId: string,
  landingPageId: string,
): Promise<LeadActionResult | never> {
  try {
    const session = await getSession();

    const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Erro ao deletar lead",
      };
    }

    revalidatePath(`/landing-pages/${landingPageId}`);
    redirect(`/landing-pages/${landingPageId}`);
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      const errorWithMessage = error as { message: string };
      if (errorWithMessage.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
    }
    return { success: false, error: "Erro ao deletar lead" };
  }
}

export async function exportLeadsToCSV(landingPageId: string): Promise<{
  success: boolean;
  error?: string;
  csvData?: string;
  filename?: string;
}> {
  try {
    const session = await getSession();

    const response = await fetch(
      `${API_BASE_URL}/leads/export/${landingPageId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro ao exportar leads" }));
      return {
        success: false,
        error: errorData.message || "Erro ao exportar leads",
      };
    }

    // Extrair o nome do arquivo do header Content-Disposition
    const contentDisposition = response.headers.get("Content-Disposition");
    const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
    const filename = filenameMatch ? filenameMatch[1] : "leads.csv";

    const csvData = await response.text();

    return { success: true, csvData, filename };
  } catch (error) {
    console.error("Erro ao exportar leads:", error);
    return { success: false, error: "Erro ao exportar leads" };
  }
}
