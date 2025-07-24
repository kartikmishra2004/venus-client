'use server'
import { cookies } from 'next/headers';

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        sessionId?: string;
        expiresAt?: string;
        message?: string;
    };
}

export async function login(password: string) {
    const cookieStore = await cookies();
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });
        const data: AuthResponse = await response.json();
        if (data.success && data.data?.sessionId && data.data.expiresAt) {
            cookieStore.set('refresh-token', data.data.sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                expires: new Date(data.data.expiresAt),
                path: '/',
            });
        }
        return data;
    } catch (error) {
        throw new Error('Login failed');
    }
}

export async function logout() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('refresh-token');

        if (token) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId: token.value }),
            });
            const data: AuthResponse = await response.json();
            if (data.success) cookieStore.delete('refresh-token');
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    return cookieStore.get('refresh-token');
}

export async function isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    if (!session) return false;
    return true;
}