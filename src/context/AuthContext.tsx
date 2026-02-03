
import { User } from "../types/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/authService";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (credentials:any) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: {children: React.ReactNode}) {
    
    const [user,setUser] = useState<User| null>(null);
    const [isLoading,setIsLoading] = useState(true);
    const router = useRouter();

    // check user is looged on page load
    const checkAuth = async() => {
        try {
            const userData = await authService.getProfile();
            setUser(userData.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    },[]);

    const login = async(credentials: any) => {
        const response = await authService.login(credentials);
        setUser(response.data.user);
    }

    // handle logout
    const logout = async() => {
        await authService.logout();
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{user,isLoading,login,logout,checkAuth}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}