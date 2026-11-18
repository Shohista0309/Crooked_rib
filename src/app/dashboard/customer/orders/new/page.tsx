"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Scissors,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  MapPin,
  CheckCircle2,
  FileText,
} from "lucide-react";

function NewOrderForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tailorIdParam = searchParams.get("tailorId");
  const designIdParam = searchParams.get("designId");

  const [tailors, setTailors] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [selectedTailorId, setSelectedTailorId] = useState(tailorIdParam || "");
  const [selectedDesignId, setSelectedDesignId] = useState(designIdParam || "");
  const [customerNotes, setCustomerNotes] = useState("");
  const [measurements, setMeasurements] = useState(
    "Bo‘y: 170 sm, Ko‘krak: 92 sm, Bel: 72 sm, Son: 98 sm"
  );
  const [deliveryAddress, setDeliveryAddress] = useState("Toshkent shahri, Chilonzor tumani");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/tailors").then((r) => r.json()),
      fetch("/api/designs").then((r) => r.json()),
    ])
      .then(([tailorsData, designsData]) => {
        if (tailorsData?.tailors) {
          setTailors(tailorsData.tailors);
          if (!selectedTailorId && tailorsData.tailors.length > 0) {
            setSelectedTailorId(tailorsData.tailors[0].id);
          }
        }
        if (designsData?.designs) {
          setDesigns(designsData.designs);
          if (!selectedDesignId && designsData.designs.length > 0) {
            setSelectedDesignId(designsData.designs[0].id);
          }
        }
      })
      .catch((err) => console.error("Error fetching order initial data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTailorId) {
      setError("Iltimos, tikuvchini tanlang");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorId: selectedTailorId,
          designId: selectedDesignId || undefined,
          customerNotes,
          measurements,
          deliveryAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Buyurtma yaratishda xatolik yuz berdi");
        setSubmitting(false);
        return;
      }

      router.push(`/dashboard/customer/orders/${data.order.id}`);
    } catch (err: any) {
      setError("Tarmoq xatosi, qayta urinib ko‘ring");
      setSubmitting(false);
    }
  };

  const selectedTailor = tailors.find((t) => t.id === selectedTailorId);
  const selectedDesign = designs.find((d) => d.id === selectedDesignId);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <span className="text-xs uppercase font-mono font-bold text-hotpink block">
          Yangi buyurtma so‘rovi
        </span>
        <h1 className="text-3xl font-serif font-bold text-charcoal">
          {t.orders.createOrderTitle}
        </h1>
        <p className="text-xs text-charcoal/60">
          Dizayn va o‘lchamlaringizni tikuvchiga yuboring. Tikuvchi buyurtmani ko‘rib chiqib, narx va muddat taklif qiladi.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-6">
          {/* Step 1: Tailor selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
              1. Tikuvchini tanlang:
            </label>
            <select
              value={selectedTailorId}
              onChange={(e) => setSelectedTailorId(e.target.value)}
              className="w-full px-3.5 py-3 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy font-medium"
              required
            >
              {tailors.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.workshopName}) — {t.region}, {t.city} (boshlang‘ich {new Intl.NumberFormat("uz-UZ").format(t.startingPrice)} so‘m)
                </option>
              ))}
            </select>

            {selectedTailor && (
              <div className="p-3 rounded-xl bg-cream-light border border-burgundy/10 text-xs flex items-center justify-between text-charcoal/70">
                <span>Ixtisosligi: <strong>{selectedTailor.specialties}</strong></span>
                <span className="font-mono text-burgundy font-bold">
                  {selectedTailor.experienceYears} yillik tajriba
                </span>
              </div>
            )}
          </div>

          {/* Step 2: Design selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
                2. Kiyim dizayni:
              </label>
              <Link
                href="/dashboard/customer/ai-studio"
                className="text-[11px] text-hotpink font-bold hover:underline inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Yangi AI dizayn yaratish</span>
              </Link>
            </div>

            {designs.length > 0 ? (
              <select
                value={selectedDesignId}
                onChange={(e) => setSelectedDesignId(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
              >
                <option value="">(Dizaynsiz, faqat matnli izoh orqali)</option>
                {designs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.category} - {d.style})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-charcoal/50">
                Hozircha saqlangan dizaynlaringiz yo‘q. Quyida matnli tavsif kiritishingiz mumkin.
              </p>
            )}

            {selectedDesign && (
              <div className="p-4 rounded-xl bg-charcoal text-cream text-xs space-y-1">
                <p className="font-bold text-hotpink">{selectedDesign.title}</p>
                <p className="text-[11px] text-cream/80 line-clamp-2">
                  {selectedDesign.conceptDescription}
                </p>
                {selectedDesign.technicalNotes && (
                  <p className="text-[10px] text-cream/60 font-mono pt-1">
                    Izoh: {selectedDesign.technicalNotes}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Body measurements */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
              3. {t.orders.measurements}:
            </label>
            <textarea
              value={measurements}
              onChange={(e) => setMeasurements(e.target.value)}
              rows={2}
              placeholder="Bo‘y, ko‘krak, bel, son, yeng uzunligi va boshqa kerakli o‘lchamlar..."
              className="w-full p-3.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
            />
          </div>

          {/* Step 4: Notes and preferences */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
              4. {t.orders.designNotes}:
            </label>
            <textarea
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              rows={3}
              placeholder="Kiyim bo‘yicha qo‘shimcha talablaringiz, tayyor bo‘lishi zarur bo‘lgan sana, astar turi va h.k..."
              className="w-full p-3.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
              required
            />
          </div>

          {/* Step 5: Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-charcoal uppercase tracking-wider block">
              5. {t.orders.deliveryAddress}:
            </label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Shahar, tuman, ko‘cha va uy raqami"
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/40 focus:outline-none focus:border-burgundy"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Scissors className="w-4 h-4" />
          <span>{submitting ? "Yuborilmoqda..." : t.orders.sendRequestBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}

export default function NewOrderPage() {
  return (
    <DashboardLayout allowedRole="CUSTOMER">
      <Suspense fallback={<div className="text-xs text-charcoal/50">Yuklanmoqda...</div>}>
        <NewOrderForm />
      </Suspense>
    </DashboardLayout>
  );
}
