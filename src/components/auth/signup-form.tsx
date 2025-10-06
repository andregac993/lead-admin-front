"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupAction } from "@/lib/server/auth";
import { type SignupFormData, signupSchema } from "@/lib/validations/auth";

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    try {
      const result = await signupAction(data);

      if (result.error) {
        setError("root", {
          message: result.error,
        });
        setIsLoading(false);
        return;
      }

      // Signup e login automático bem-sucedidos
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError("root", {
        message: "Erro ao criar conta. Tente novamente.",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome completo"
          autoComplete="name"
          disabled={isLoading}
          {...register("name")}
          aria-invalid={errors.name ? "true" : "false"}
        />
        {errors.name && (
          <p className="text-sm text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seuemail@exemplo.com"
          autoComplete="email"
          disabled={isLoading}
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-sm text-destructive" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="Mínimo de 6 caracteres"
          autoComplete="new-password"
          disabled={isLoading}
          {...register("password")}
          aria-invalid={errors.password ? "true" : "false"}
        />
        {errors.password && (
          <p className="text-sm text-destructive" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <div
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
          role="alert"
          aria-live="assertive"
        >
          {errors.root.message}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Cadastrar
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Entrar
        </Link>
      </div>
    </form>
  );
}
