
export interface User {
    id: string;
    name: string;
    role: 'user' | 'admin';
    isEmailVerified: boolean;
}

export interface AuthResponse {
    user: User;
    accessToken: string
}