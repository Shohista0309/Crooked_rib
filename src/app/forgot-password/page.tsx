"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { Logo } from "@/components/Logo";
import { Mail, ArrowLeft, AlertCircle, Info, ShieldAlert } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-16 bg-cream-light flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <Logo className="justify-center" />
          <h2 className="text-3xl font-serif font-bold text-charcoal pt-4">
            {t.auth.resetPassword}
          </h2>
          <p className="text-xs text-charcoal/60">
            Akkauntingizga bog‘langan elektron pochta manzilini kiriting
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-lg space-y-6">
          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>SMTP Pochta provayderi ulanmagan</span>
                </div>
                <p className="leading-relaxed text-[11px]">
                  Serverda tashqi elektron pochta provayderi (Resend/SendGrid/SMTP) API kaliti sozlanmaganligi sababli, xavfsizlik qoidalariga binoan soxta xat yuborish simulyatsiyasi o‘chirib qo‘yilgan.
                </p>
                <p className="leading-relaxed text-[11px]">
                  Parolni qayta tiklash uchun platforma administratori (<strong>admin@crookedrib.uz</strong>) bilan bevosita bog‘lanishingiz yoki mavjud parolingiz bilan tizimga kirishingiz mumkin.
                </p>
              </div>

              <Link
                href="/login"
                className="w-full py-3 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kirish sahifasiga qaytish</span>
              </Link>
            </div>
          ) : (
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

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{t.auth.resetPassword}</span>
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-burgundy hover:text-hotpink inline-flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Kirish oynasiga qaytish</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
