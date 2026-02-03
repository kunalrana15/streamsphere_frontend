"use client"

import { LoginInput, loginSchema } from "@/src/lib/validations/auth";
import { authService } from "@/src/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Lock, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";


export default function LoginPage() {
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState<string| null>(null);
    const router = useRouter();

    const { register,
            handleSubmit,
            formState: {errors}} = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async(data: LoginInput) => {
        setLoading(true);
        setError(null);

        try {
            await authService.login(data);
            // if user successfully login redirect it to the main page
            router.push("/dashboard");
            router.refresh();
        } catch (err: any) {
            // logic to handle specific backend errors
            if(err === 'EMAIL_NOT_VERIFIED') {
                // redirect to the OTP page
                router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
            } else if(err === 'INVALID_CREDENTIALS') {
                setError("Invalid email or password. Please Try again");
            } else {
                setError(err || "Something went wrong. Please try again later");
            } 
        } finally {
                setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600/10 rounded-xl">
              <LogIn className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
          <p className="text-zinc-400 mt-2">Sign in to your StreamSphere account</p>
        </div>

        {/* Server-side Error Alert */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
              <input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 mt-1.5 ml-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between mb-1.5 ml-1">
              <label className="text-sm font-medium text-zinc-400">Password</label>
              <Link href="/forgot-password"  className="text-xs text-blue-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-800 border border-zinc-700 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1.5 ml-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-zinc-500 text-sm mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
            Create one now
          </Link>
        </p>
      </div>
    </div>
    )
}