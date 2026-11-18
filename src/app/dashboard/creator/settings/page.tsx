"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import { Globe, User, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CreatorSettingsPage() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <DashboardLayout allowedRole="CREATOR">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">
            {t.common.settings}
          </h1>
          <p className="text-xs text-charcoal/60">
            Platforma tili va profilingiz sozlamalari
          </p>
        </div>

        {/* Language selector */}
        <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-burgundy" />
            <h3 className="font-serif font-bold text-sm text-charcoal">
              Platforma tili
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { code: "uz", label: "O'zbekcha" },
              { code: "ru", label: "Русский" },
              { code: "en", label: "English" },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => setLanguage(item.code as any)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  language === item.code
                    ? "bg-burgundy text-cream shadow-sm"
                    : "bg-cream-light text-charcoal hover:bg-cream"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick link to profile edit */}
        <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-sm text-charcoal">
            Ustaxona ma’lumotlari
          </h3>
          <p className="text-xs text-charcoal/60 leading-relaxed">
            Ustaxona nomi, xizmat narxlari va ixtisosliklarni alohida sahifada tahrirlashingiz mumkin.
          </p>
          <Link
            href="/dashboard/creator/profile"
            className="inline-block px-5 py-2.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-colors"
          >
            Ustaxona profilini tahrirlash
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
