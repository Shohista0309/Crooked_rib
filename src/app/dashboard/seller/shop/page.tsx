"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import { Save, ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";

export default function SellerShopProfilePage() {
  const { t } = useLanguage();

  const [shopName, setShopName] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.sellerProfile) {
          const s = data.user.sellerProfile;
          setShopName(s.shopName || "");
          setRegion(s.region || "");
          setCity(s.city || "");
          setAddress(s.address || "");
          setPhone(s.phone || data.user.phone || "");
          setDescription(s.description || "");
        }
      })
      .catch((err) => console.error("Error loading shop profile:", err))
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
        body: JSON.stringify({
          shopName,
          region,
          city,
          address,
          phone,
          bio: description,
        }),
      });

      if (!res.ok) {
        setError("Do‘kon ma’lumotlarini saqlashda xatolik");
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
    <DashboardLayout allowedRole="SELLER">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">
            Do‘kon profili
          </h1>
          <p className="text-xs text-charcoal/60">
            Mato va furnitura do‘koningizning rasmiy manzili va ma’lumotlari
          </p>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Do‘kon profili muvaffaqiyatli yangilandi!</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              Do‘kon nomi:
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="Marg‘ilon Ipak Uyi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Viloyat / Hudud:
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Shahar / Tuman:
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              Aniq manzil:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ko‘cha va uy raqami"
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              Bog‘lanish telefoni:
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998"
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saqlanmoqda..." : "Do‘kon ma’lumotlarini saqlash"}</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
