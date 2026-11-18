"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { Logo } from "@/components/Logo";
import { ArrowRight, Lock, Mail, AlertCircle, Info } from "lucide-react";

function LoginForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email yoki parol noto‘g‘ri");
        setLoading(false);
        return;
      }

      const target = redirectParam || data.redirectUrl || "/dashboard/customer";
      router.push(target);
      router.refresh();
    } catch (err: any) {
      setError("Tarmoq xatosi, qayta urinib ko‘ring");
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("CrookedRib2026!");
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center space-y-2">
        <Logo className="justify-center" />
        <h2 className="text-3xl font-serif font-bold text-charcoal pt-4">
          {t.auth.welcomeBack}
        </h2>
        <p className="text-xs text-charcoal/60">
          {t.auth.noAccount}{" "}
          <Link href="/register" className="text-burgundy font-bold hover:underline">
            {t.common.register}
          </Link>
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-burgundy/10 shadow-lg space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              {t.auth.email}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.uz"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-charcoal">
                {t.auth.password}
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-hotpink hover:underline font-medium"
              >
                {t.auth.forgotPassword}
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? "Kirilmoqda..." : t.common.login}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Fillers */}
        <div className="pt-4 border-t border-charcoal/10 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-charcoal/60 uppercase">
            <Info className="w-3.5 h-3.5 text-hotpink" />
            <span>Tezkor sinov uchun namunaviy akkauntlar:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => fillDemoAccount("laylo.customer@crookedrib.uz")}
              className="p-2 rounded-lg bg-cream hover:bg-cream-dark text-left transition-colors font-medium text-charcoal"
            >
              Mijoz (Laylo)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("dilnoza.tailor@crookedrib.uz")}
              className="p-2 rounded-lg bg-cream hover:bg-cream-dark text-left transition-colors font-medium text-charcoal"
            >
              Tikuvchi (Dilnoza)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("shaxnoza.fabrics@crookedrib.uz")}
              className="p-2 rounded-lg bg-cream hover:bg-cream-dark text-left transition-colors font-medium text-charcoal"
            >
              Sotuvchi (Shaxnoza)
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("admin@crookedrib.uz")}
              className="p-2 rounded-lg bg-cream hover:bg-cream-dark text-left transition-colors font-medium text-charcoal"
            >
              Admin (Malika)
            </button>
          </div>
          <p className="text-[10px] text-charcoal/50 text-center pt-1 font-mono">
            Parol: CrookedRib2026!
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen py-16 bg-cream-light flex flex-col justify-center items-center px-4 sm:px-6">
      <Suspense fallback={<div className="text-xs text-charcoal/50">Yuklanmoqda...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
