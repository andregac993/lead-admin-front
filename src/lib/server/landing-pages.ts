"use server";

import {redirect} from "next/navigation";
import type {Session} from "next-auth";
import {cache} from "react";
import {auth} from "@/auth";
import type {LandingPage, LandingPagesResponse} from "@/types/landing-page";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

const getSession = cache(async (): Promise<Session> => {
  const session = await auth();
  if (!session?.accessToken) {
    redirect("/login");
  }
  return session;
});

export const getLandingPagesServer = cache(
  async (): Promise<LandingPagesResponse> => {
    const session = await getSession();

    const response = await fetch(`${API_BASE_URL}/landing-pages`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar landing pages");
    }

    return response.json();
  },
);

export async function getLandingPageById(
  landingPageId: string,
): Promise<LandingPage | undefined> {
  const data = await getLandingPagesServer();
  return data.landingPages.find((lp) => lp.id === landingPageId);
}
