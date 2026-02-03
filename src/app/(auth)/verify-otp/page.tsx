"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { authService } from "@/src/services/authService";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value.substring(element.value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (element.value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) return setError("Please enter all 6 digits");


    setLoading(true);
    setError("");
    try {
      await authService.verifyOtp(email, fullOtp);
      router.push("/login?verified=true");
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900 p-8 rounded-2xl border border-zinc-800 text-center">
        <div className="inline-flex p-3 bg-blue-600/10 rounded-full mb-4">
          <ShieldCheck className="h-8 w-8 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">Verify your email</h2>
        <p className="text-zinc-400 mt-2 text-sm">
          We sent a code to <span className="text-white font-medium">{email}</span>
        </p>

        {error && <div className="mt-4 text-red-500 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">{error}</div>}

        <div className="flex justify-between gap-2 my-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(el) => {(inputRefs.current[index] = el)}}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 bg-zinc-800 border-zinc-700 text-white text-center text-xl font-bold rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verify Account"}
        </button>

        <button 
          onClick={() => authService.resendOtp(email)}
          className="mt-6 text-zinc-500 text-sm hover:text-white transition-colors"
        >
          Didn't receive a code? <span className="text-blue-500">Resend</span>
        </button>
      </div>
    </div>
  );
}