"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import { Save, User, Globe, CheckCircle2, AlertCircle } from "lucide-react";

export default function CustomerSettingsPage() {
  const { t, language, setLanguage } = useLanguage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setCity(data.user.customerProfile?.city || "");
          setRegion(data.user.customerProfile?.region || "");
          setBio(data.user.customerProfile?.bio || "");
        }
      })
      .catch((err) => console.error("Error fetching settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, city, region, bio }),
      });

      if (!res.ok) {
        setError("Profilni yangilashda xatolik");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Tarmoq xatosi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout allowedRole="CUSTOMER">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">
            {t.common.settings}
          </h1>
          <p className="text-xs text-charcoal/60">
            Shaxsiy ma’lumotlaringiz va platforma sozlamalarini boshqaring
          </p>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Sozlamalar muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Language selector box */}
        <div className="p-6 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-4">
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

        {/* Profile form */}
        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-5">
          <h3 className="font-serif font-bold text-base text-charcoal">
            Profil ma’lumotlari
          </h3>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              {t.auth.fullName}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              {t.auth.email} (o‘zgartirib bo‘lmaydi)
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal/50 bg-cream-light/70 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              Telefon raqami
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998"
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">Viloyat</label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">Shahar / Tuman</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              O‘zingiz haqingizda / kiyinish afzalliklaringiz
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saqlanmoqda..." : t.common.save}</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
