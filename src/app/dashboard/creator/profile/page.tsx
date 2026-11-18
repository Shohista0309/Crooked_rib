"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import { Save, Scissors, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreatorProfilePage() {
  const { t } = useLanguage();

  const [name, setName] = useState("");
  const [workshopName, setWorkshopName] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [experienceYears, setExperienceYears] = useState("1");
  const [startingPrice, setStartingPrice] = useState("200000");
  const [isAvailable, setIsAvailable] = useState(true);
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
          setPhone(data.user.phone || "");
          const p = data.user.creatorProfile;
          if (p) {
            setWorkshopName(p.workshopName || "");
            setRegion(p.region || "");
            setCity(p.city || "");
            setSpecialties(p.specialties || "");
            setExperienceYears(p.experienceYears?.toString() || "1");
            setStartingPrice(p.startingPrice?.toString() || "200000");
            setIsAvailable(p.isAvailable ?? true);
            setBio(p.bio || "");
          }
        }
      })
      .catch((err) => console.error("Error loading profile:", err))
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
          name,
          phone,
          workshopName,
          region,
          city,
          specialties,
          experienceYears: parseInt(experienceYears),
          startingPrice: parseFloat(startingPrice),
          isAvailable,
          bio,
        }),
      });

      if (!res.ok) {
        setError("Profilni yangilashda xatolik yuz berdi");
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
    <DashboardLayout allowedRole="CREATOR">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">
            Ustaxona profili
          </h1>
          <p className="text-xs text-charcoal/60">
            Mijozlar sizni topganda ko‘radigan ommaviy profilingiz ma’lumotlari
          </p>
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Ustaxona profili muvaffaqiyatli saqlandi!</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Ism va familiyangiz:
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
                Ustaxona / Brend nomi:
              </label>
              <input
                type="text"
                value={workshopName}
                onChange={(e) => setWorkshopName(e.target.value)}
                placeholder="Masalan: Dilnoza Couture"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Telefon raqami:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Ish tajribasi (yil):
              </label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30 font-mono"
              />
            </div>
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
              Boshlang‘ich xizmat narxi (so‘m):
            </label>
            <input
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30 font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              Mutaxassislik va xizmatlar ro‘yxati:
            </label>
            <input
              type="text"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="Masalan: Kechki liboslar, zamonaviy adras kostyumlar, kelin sarpolari, zardo‘zlik"
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              Ustaxona haqida batafsil ma’lumot (Bio):
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="O‘z mahoratingiz, qanday matolar bilan ishlashingiz va mijozlarga taklifingiz..."
              className="w-full p-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="available"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 accent-burgundy rounded cursor-pointer"
            />
            <label htmlFor="available" className="text-xs text-charcoal font-medium cursor-pointer">
              Hozirda yangi buyurtmalarni qabul qilishga tayyorman
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saqlanmoqda..." : "Profilni saqlash"}</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
