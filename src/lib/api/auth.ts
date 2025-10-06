import type { LoginFormData, SignupFormData } from "@/lib/validations/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3333"

export interface LoginResponse {
    access_token: string
}

export interface SignupResponse {
    id: string
    name: string
    email: string
    createdAt: string
}

export interface ApiError {
    message: string
    errors?: string[]
}

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error: ApiError = await response.json()
        throw new Error(error.message || "Erro ao fazer login")
    }

    return response.json()
}

export async function signupUser(data: SignupFormData): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        const error: ApiError = await response.json()
        throw new Error(error.message || "Erro ao criar conta")
    }

    return response.json()
}
