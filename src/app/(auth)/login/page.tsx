import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-[420px]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
                    <CardDescription>Entre com suas credenciais para acessar o Lead Admin</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    )
}
