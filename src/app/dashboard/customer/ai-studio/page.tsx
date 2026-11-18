"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Sparkles,
  Scissors,
  Save,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Layers,
  Palette,
  FileText,
  Upload,
} from "lucide-react";

export default function AIStudioPage() {
  const { t } = useLanguage();
  const router = useRouter();

  // Form inputs
  const [category, setCategory] = useState("DRESS");
  const [genderCategory, setGenderCategory] = useState("WOMEN");
  const [style, setStyle] = useState("MODERN");
  const [season, setSeason] = useState("SPRING");
  const [colors, setColors] = useState("Burgundy, Krem va Oltin rang");
  const [occasion, setOccasion] = useState("Tantanali tadbir va to‘y");
  const [budget, setBudget] = useState("650000");
  const [fabricPreferences, setFabricPreferences] = useState("Ipak yoki tabiiy paxta-adras");
  const [description, setDescription] = useState(
    "Uzun nafis bichimli, bel qismi kamarli, qulay yoqali zamonaviy kechki ko‘ylak. Milliy matolarimiz jilosi zamonaviy yevropacha bichim bilan uyg‘unlashsin."
  );

  // Result & States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyMissing, setKeyMissing] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [matchedMaterials, setMatchedMaterials] = useState<any[]>([]);

  // Manual fallback state
  const [manualTitle, setManualTitle] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [sketchUrl, setSketchUrl] = useState("");

  // Save state
  const [saving, setSaving] = useState(false);
  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setKeyMissing(false);
    setAiResult(null);

    try {
      const res = await fetch("/api/ai/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          genderCategory,
          style,
          season,
          colors,
          occasion,
          budget: budget ? parseFloat(budget) : undefined,
          fabricPreferences,
          description,
        }),
      });

      const data = await res.json();

      if (data?.matchedMaterials) {
        setMatchedMaterials(data.matchedMaterials);
      }

      if (data?.isKeyMissing) {
        setKeyMissing(true);
        // Pre-fill manual title from category
        setManualTitle(`${category} — Shaxsiy eskiz loyihasi`);
      } else if (!data.success) {
        setError(data.error || "AI xizmatida xatolik yuz berdi");
      } else {
        setAiResult(data.result);
      }
    } catch (err: any) {
      setError("Tarmoq xatosi, qayta urinib ko‘ring");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDesign = async (designData: any) => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(designData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Dizaynni saqlashda xatolik yuz berdi");
      } else {
        setSavedDesignId(data.design.id);
      }
    } catch (err) {
      setError("Dizaynni saqlab bo‘lmadi");
    } finally {
      setSaving(false);
    }
  };

  const saveGeneratedDesign = () => {
    if (!aiResult) return;
    handleSaveDesign({
      title: aiResult.title,
      category,
      genderCategory,
      style,
      season,
      colors,
      occasion,
      budget: budget ? parseFloat(budget) : undefined,
      fabricPreferences,
      conceptDescription: aiResult.conceptDescription,
      recommendedFabrics: aiResult.recommendedFabrics?.join(", "),
      recommendedAccessories: aiResult.recommendedAccessories?.join(", "),
      technicalNotes: aiResult.technicalNotes?.join(" | "),
      aiGenerated: true,
    });
  };

  const saveManualDesign = () => {
    if (!manualTitle) {
      setError("Dizayn nomi kiritilishi shart");
      return;
    }
    handleSaveDesign({
      title: manualTitle,
      category,
      genderCategory,
      style,
      season,
      colors,
      occasion,
      budget: budget ? parseFloat(budget) : undefined,
      fabricPreferences,
      conceptDescription: description,
      recommendedFabrics: fabricPreferences,
      technicalNotes: manualNotes,
      sketchUrl: sketchUrl || undefined,
      aiGenerated: false,
    });
  };

  return (
    <DashboardLayout allowedRole="CUSTOMER">
      <div className="space-y-10 max-w-5xl mx-auto">
        {/* Studio Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-hotpink" />
            <span>CROOKED RIB Fashion Studio</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">
            {t.ai.studioTitle}
          </h1>
          <p className="text-xs text-charcoal/70">
            {t.ai.studioSubtitle}
          </p>
        </div>

        {/* Input Form */}
        <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-6">
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  {t.ai.categoryLabel}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
                >
                  <option value="DRESS">Ko‘ylak / Kechki libos</option>
                  <option value="SUIT">Kostyum / Jaket</option>
                  <option value="COAT">Palto / Trench</option>
                  <option value="BLOUSE">Bluzka / Kofta</option>
                  <option value="TRADITIONAL">Milliy sarpo / Chopon</option>
                  <option value="CASUAL">Kundalik kiyim</option>
                  <option value="OTHER">Boshqa fason</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  {t.ai.styleLabel}
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
                >
                  <option value="MODERN">Zamonaviy / Klassik</option>
                  <option value="TRADITIONAL_UZBEK">Milliy o‘zbek (Adras/Atlas)</option>
                  <option value="MINIMALIST">Minimalist nafis</option>
                  <option value="EVENING_GLAMOUR">Kechki tantana / Glamur</option>
                  <option value="AVANT_GARDE">Avangard / Ijodiy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  {t.ai.seasonLabel}
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
                >
                  <option value="SPRING">Bahor</option>
                  <option value="SUMMER">Yoz</option>
                  <option value="AUTUMN">Kuz</option>
                  <option value="WINTER">Qish</option>
                  <option value="ALL_SEASON">To‘rt fasl</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  {t.ai.colorsLabel}
                </label>
                <input
                  type="text"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  placeholder="Masalan: Burgundy, Krem, Zangori"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                  {t.ai.budgetLabel}
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Masalan: 500000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Mato va xomashyo afzalliklari
              </label>
              <input
                type="text"
                value={fabricPreferences}
                onChange={(e) => setFabricPreferences(e.target.value)}
                placeholder="Masalan: Marg‘ilon ipak xon-atlasi, paxta adras, shoyi yoki baxmal"
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider">
                {t.ai.descriptionLabel}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Kiyim fasoni, etak uzunligi, yoqasi, bel va yeng detallari haqida yozing..."
                className="w-full p-3.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "AI tahlil qilmoqda..." : t.ai.generateBtn}</span>
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Missing API Key Notice with Manual Input Fallback */}
        {keyMissing && (
          <div className="p-8 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 space-y-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-amber-900">
                  {t.ai.keyMissingTitle}
                </h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {t.ai.keyMissingDesc}
                </p>
              </div>
            </div>

            {/* Manual Form Box */}
            <div className="p-6 rounded-2xl bg-white border border-amber-200 space-y-4">
              <h4 className="font-serif font-bold text-sm text-charcoal">
                Dizaynni qo‘lda rasmiylashtirish va saqlash
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-charcoal block mb-1">
                    Dizayn nomi:
                  </label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="Masalan: Maxsus adras kechki libos"
                    className="w-full px-3 py-2 rounded-lg border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-charcoal block mb-1">
                    Eskiz yoki rasm havolasi (ixtiyoriy):
                  </label>
                  <input
                    type="url"
                    value={sketchUrl}
                    onChange={(e) => setSketchUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-lg border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-charcoal block mb-1">
                    Tikuvchiga texnik ko‘rsatmalar:
                  </label>
                  <textarea
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    rows={2}
                    placeholder="Masalan: Yengini qisqaroq qilish, choklarni simmetrik birlashtirish..."
                    className="w-full p-2.5 rounded-lg border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveManualDesign}
                  disabled={saving || !!savedDesignId}
                  className="px-5 py-2.5 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savedDesignId ? "Dizayn saqlandi ✓" : "Dizaynni saqlash"}</span>
                </button>

                {savedDesignId && (
                  <Link
                    href={`/dashboard/customer/orders/new?designId=${savedDesignId}`}
                    className="px-5 py-2.5 rounded-lg bg-hotpink text-white text-xs font-semibold uppercase hover:bg-hotpink-hover shadow transition-all flex items-center gap-1.5"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Tikuvchiga buyurtma yuborish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AI Result Specification Card */}
        {aiResult && (
          <div className="p-8 rounded-3xl bg-white border border-burgundy/15 shadow-xl space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-hotpink block">
                  AI Fashion Specification
                </span>
                <h3 className="font-serif font-bold text-2xl text-charcoal">
                  {aiResult.title}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-mono font-semibold">
                Daraja: {aiResult.estimatedDifficulty}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-mono text-charcoal/50 block">Konseptsiya tavsifi:</span>
              <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                {aiResult.conceptDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-cream-light border border-burgundy/10 space-y-2">
                <span className="text-xs font-bold text-burgundy uppercase font-mono block">
                  {t.ai.recommendedFabrics}
                </span>
                <ul className="space-y-1 text-xs text-charcoal/70">
                  {aiResult.recommendedFabrics?.map((fab: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-hotpink" />
                      <span>{fab}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-cream-light border border-burgundy/10 space-y-2">
                <span className="text-xs font-bold text-burgundy uppercase font-mono block">
                  {t.ai.recommendedAccessories}
                </span>
                <ul className="space-y-1 text-xs text-charcoal/70">
                  {aiResult.recommendedAccessories?.map((acc: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-hotpink" />
                      <span>{acc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-charcoal text-cream space-y-2">
              <span className="text-xs font-bold text-hotpink uppercase font-mono block">
                {t.ai.technicalNotes}
              </span>
              <ul className="space-y-1 text-xs text-cream/80">
                {aiResult.technicalNotes?.map((note: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-hotpink font-mono">›</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions: Save or Order */}
            <div className="pt-4 border-t border-charcoal/10 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={saveGeneratedDesign}
                disabled={saving || !!savedDesignId}
                className="px-6 py-3 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savedDesignId ? "Dizayn saqlandi ✓" : t.ai.saveDesignBtn}</span>
              </button>

              {savedDesignId && (
                <Link
                  href={`/dashboard/customer/orders/new?designId=${savedDesignId}`}
                  className="px-6 py-3 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase hover:bg-hotpink-hover shadow-lg transition-all flex items-center gap-2"
                >
                  <Scissors className="w-4 h-4" />
                  <span>{t.ai.orderWithDesignBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Smart Material Recommendations from Real Seller Catalog */}
        {matchedMaterials.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono font-semibold text-hotpink">
                  Smart Material Match
                </span>
                <h3 className="font-serif font-bold text-2xl text-charcoal">
                  Mavjud do‘konlardan mos materiallar
                </h3>
              </div>
              <Link
                href="/marketplace"
                className="text-xs font-bold text-burgundy uppercase hover:text-hotpink transition-colors"
              >
                Barchasini ko‘rish →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedMaterials.slice(0, 3).map((mat) => (
                <div
                  key={mat.id}
                  className="rounded-2xl border border-burgundy/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 bg-charcoal overflow-hidden">
                      <img
                        src={mat.imageUrl}
                        alt={mat.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h4 className="font-serif font-bold text-charcoal text-sm line-clamp-1">
                        {mat.name}
                      </h4>
                      <p className="text-xs text-charcoal/60">
                        {mat.material} • {mat.color}
                      </p>
                      <p className="text-xs font-mono font-bold text-burgundy">
                        {new Intl.NumberFormat("uz-UZ").format(mat.price)} so‘m / {mat.unit}
                      </p>
                      <p className="text-[11px] text-hotpink font-semibold">
                        Sotuvchi: {mat.sellerProfile?.shopName}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/marketplace/${mat.id}`}
                      className="block text-center py-2 rounded-lg bg-cream-light text-charcoal text-xs font-semibold uppercase hover:bg-burgundy hover:text-cream transition-colors"
                    >
                      Batafsil
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
