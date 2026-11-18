"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import { Logo } from "@/components/Logo";
import { Role } from "@/lib/types";
import {
  User,
  Scissors,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [terms, setTerms] = useState(false);

  // Profile fields depending on role
  const [city, setCity] = useState("Toshkent");
  const [region, setRegion] = useState("Toshkent shahri");
  const [workshopName, setWorkshopName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("+998");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t.auth.errors.passwordMismatch);
      return;
    }

    if (password.length < 8) {
      setError(t.auth.errors.passwordShort);
      return;
    }

    if (!terms) {
      setError(t.auth.errors.termsRequired);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
          role,
          terms,
          city,
          region,
          phone,
          workshopName: role === "CREATOR" ? workshopName : undefined,
          shopName: role === "SELLER" ? shopName : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ro‘yxatdan o‘tishda xatolik yuz berdi");
        setLoading(false);
        return;
      }

      // Redirect according to registered role
      if (role === "CREATOR") {
        router.push("/dashboard/creator");
      } else if (role === "SELLER") {
        router.push("/dashboard/seller");
      } else {
        router.push("/dashboard/customer");
      }
      router.refresh();
    } catch (err: any) {
      setError("Tarmoq xatosi, qayta urinib ko‘ring");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 bg-cream-light flex flex-col justify-center items-center px-4 sm:px-6">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center space-y-2">
          <Logo className="justify-center" />
          <h2 className="text-3xl font-serif font-bold text-charcoal pt-4">
            {t.auth.createAccount}
          </h2>
          <p className="text-xs text-charcoal/60">
            {t.auth.haveAccount}{" "}
            <Link href="/login" className="text-burgundy font-bold hover:underline">
              {t.common.login}
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                {t.auth.selectRole}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("CUSTOMER")}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    role === "CUSTOMER"
                      ? "border-burgundy bg-burgundy/5 text-burgundy shadow-sm"
                      : "border-charcoal/15 bg-cream-light/40 text-charcoal/70 hover:border-burgundy/40"
                  }`}
                >
                  <User className="w-4 h-4 text-hotpink" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Mijoz</p>
                    <p className="text-[10px] text-charcoal/60 leading-tight">Buyurtma berish</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("CREATOR")}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    role === "CREATOR"
                      ? "border-burgundy bg-burgundy/5 text-burgundy shadow-sm"
                      : "border-charcoal/15 bg-cream-light/40 text-charcoal/70 hover:border-burgundy/40"
                  }`}
                >
                  <Scissors className="w-4 h-4 text-hotpink" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Tikuvchi</p>
                    <p className="text-[10px] text-charcoal/60 leading-tight">Buyurtma olish</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("SELLER")}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    role === "SELLER"
                      ? "border-burgundy bg-burgundy/5 text-burgundy shadow-sm"
                      : "border-charcoal/15 bg-cream-light/40 text-charcoal/70 hover:border-burgundy/40"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-hotpink" />
                  <div>
                    <p className="text-xs font-bold text-charcoal">Sotuvchi</p>
                    <p className="text-[10px] text-charcoal/60 leading-tight">Mato va bezaklar</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                {t.auth.fullName}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingiz va familiyangiz"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>

            {/* Role specific additions */}
            {role === "CREATOR" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal">
                  Ustaxona yoki brend nomi (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={workshopName}
                  onChange={(e) => setWorkshopName(e.target.value)}
                  placeholder="Masalan: Dilnoza Couture"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
                />
              </div>
            )}

            {role === "SELLER" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal">
                  Do‘kon nomi
                </label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Masalan: Marg‘ilon Ipak Uyi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                {t.auth.email}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@crookedrib.uz"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Telefon raqami
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998901234567"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>

            {/* Region / City */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal">Viloyat</label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Toshkent shahri"
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal">Shahar / Tuman</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Chilonzor"
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal">
                  {t.auth.password}
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Kamida 8 belgi"
                  className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal">
                  {t.auth.confirmPassword}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Parolni takrorlang"
                  className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="w-4 h-4 accent-burgundy rounded cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-charcoal/70 cursor-pointer">
                {t.auth.agreeTerms}
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? "Ro‘yxatdan o‘tkazilmoqda..." : t.auth.createAccount}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
