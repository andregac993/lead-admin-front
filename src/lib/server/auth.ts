"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import {
  type LoginFormData,
  loginSchema,
  type SignupFormData,
  signupSchema,
} from "@/lib/validations/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

interface ActionResult {
  success?: boolean;
  error?: string;
}

export async function loginAction(data: LoginFormData): Promise<ActionResult> {
  try {
    const validatedFields = loginSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        error: "Dados inválidos. Verifique os campos e tente novamente.",
      };
    }

    const { email, password } = validatedFields.data;

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "E-mail ou senha inválidos. Tente novamente.",
      };
    }
    throw error;
  }
}

export async function signupAction(
  data: SignupFormData,
): Promise<ActionResult> {
  try {
    const validatedFields = signupSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        error: "Dados inválidos. Verifique os campos e tente novamente.",
      };
    }

    const { name, email, password } = validatedFields.data;

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        error: errorData.message || "Erro ao criar conta. Tente novamente.",
      };
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error:
          "Conta criada, mas erro ao fazer login. Tente fazer login manualmente.",
      };
    }
    throw error;
  }
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
