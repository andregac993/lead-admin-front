import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {loginSchema} from "@/lib/validations/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { email, password } = validatedFields.data;

          const response = await fetch(`${API_BASE_URL}/sessions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          return {
            id: email,
            email: email,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.email = user.email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.email = token.email as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
