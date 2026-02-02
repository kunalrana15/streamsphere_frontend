"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/src/lib/validations/auth";
import { authService } from "@/src/services/authService";
import { useState } from "react";
import { Loader2, Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await authService.register(data);
      console.log(res);
      // Redirect to OTP verification with email in query params
      window.location.href = `/verify-otp?email=${encodeURIComponent(data.email)}`;
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err: err.message ||  "An Unexpected Error Occured"
      setServerError(errorMessage); // This comes from our Axios interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-zinc-400 mt-2">Join StreamSphere today.</p>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <div>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <input
                {...register("name")}
                placeholder="Full Name"
                className="w-full bg-zinc-800 border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <input
                {...register("email")}
                type="email"
                placeholder="Email Address"
                className="w-full bg-zinc-800 border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full bg-zinc-800 border-zinc-700 text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              />
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
              <>
                <span>Sign Up</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}