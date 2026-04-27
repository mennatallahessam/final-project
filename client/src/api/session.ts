export const API_ROOT = import.meta.env.VITE_API_ROOT || (import.meta.env.PROD ? '/api/v1' : 'http://localhost:3000/api/v1');

/**
 * Shared API response type
 */
export interface ApiResponse<T = any> {
    status: 'success' | 'fail' | 'error';
    data?: T;
    message?: string;
    token?: string;
}

/**
 * Get JWT from local storage
 */
export function getToken(): string | null {
    return localStorage.getItem('token');
}

/**
 * Set JWT in local storage
 */
export function setToken(token: string) {
    localStorage.setItem('token', token);
}

/**
 * Remove JWT
 */
export function removeToken() {
    localStorage.removeItem('token');
}

/**
 * Centralized fetch wrapper
 */
export async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = getToken();
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_ROOT}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 204) {
        return {} as T;
    }

    const result = await response.json();

    if (!response.ok) {
        // Handle unauthorized (expired token)
        if (response.status === 401 && token) {
            removeToken();
            window.location.href = '/login';
        }
        throw new Error(result.message || 'Something went wrong');
    }

    return result as T;
}
