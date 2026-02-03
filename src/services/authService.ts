import api from "../lib/api";
import { User,AuthResponse } from "@/src/types/auth";

export const authService = {
  register: (data: any) => api.post("/auth/register", data),
  
  verifyOtp: (email: string, code: string) => api.post("/auth/verify-otp", { email, otp:code }),

  resendOtp: (email: string) => 
    api.post("/auth/resend-otp", { email }),

  login: (credentials: any) => 
    api.post<AuthResponse>("/auth/login", credentials),

  logout: () => api.post("/auth/logout"),
  
  getProfile: () => api.get<User>("/auth/profile"),
};