import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {SignupForm} from "@/components/auth/signup-form";


export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-[480px]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
                    <CardDescription>Crie sua conta no Lead Admin para começar</CardDescription>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                </CardContent>
            </Card>
        </div>
    )
}
