"use server";

import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import type {Session} from "next-auth";
import {cache} from "react";
import {auth} from "@/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const getSession = cache(async (): Promise<Session> => {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login");
  }
  return session;
});

interface DashboardStats {
  totalLeads: number;
  totalLandingPages: number;
}

interface ApiKeyResponse {
  apiKey: string;
}

interface ApiKeyStatusResponse {
  apiKey: string;
}

interface ApiKeyActionResult {
  success: boolean;
  error?: string;
  apiKey?: string;
}

export const getDashboardStats = cache(async (): Promise<DashboardStats> => {
  const session = await getSession();

  const [leadsResponse, landingPagesResponse] = await Promise.all([
    fetch(`${API_BASE_URL}/leads`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      next: { revalidate: 30 },
    }),
    fetch(`${API_BASE_URL}/landing-pages`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      next: { revalidate: 30 },
    }),
  ]);

  const leadsData = await leadsResponse.json();
  const landingPagesData = await landingPagesResponse.json();

  return {
    totalLeads: leadsData.pagination?.total || 0,
    totalLandingPages: landingPagesData.landingPages?.length || 0,
  };
});

export async function getApiKeyStatus(): Promise<ApiKeyStatusResponse | null> {
  const session = await getSession();

  const response = await fetch(`${API_BASE_URL}/users/api-key`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Erro ao verificar API Key");
  }

  return response.json();
}

export async function generateApiKey(): Promise<ApiKeyActionResult> {
  try {
    const session = await getSession();

    const response = await fetch(`${API_BASE_URL}/users/api-key/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || "Erro ao gerar API Key",
      };
    }

    const data: ApiKeyResponse = await response.json();
    revalidatePath("/dashboard");

    return {
      success: true,
      apiKey: data.apiKey,
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Erro ao gerar API Key",
    };
  }
}

export async function deleteApiKey(): Promise<ApiKeyActionResult> {
  try {
    const session = await getSession();

    const response = await fetch(`${API_BASE_URL}/users/api-key`, {
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
        error: errorData.message || "Erro ao deletar API Key",
      };
    }

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Erro ao deletar API Key",
    };
  }
}
