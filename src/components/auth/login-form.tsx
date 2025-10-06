"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { loginSchema, type LoginFormData } from "@/lib/validations/auth"
import { loginUser } from "@/lib/api/auth"
import { Loader2 } from "lucide-react"

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="••••••••"
                    autoComplete="current-password"
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
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive" role="alert" aria-live="assertive">
                    {errors.root.message}
                </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Entrar
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
                    Criar conta
                </Link>
            </div>
        </form>
    )
}
