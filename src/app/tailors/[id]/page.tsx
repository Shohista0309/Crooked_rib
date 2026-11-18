"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  Scissors,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from "lucide-react";

export default function TailorDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();

  const [tailor, setTailor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/tailors/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.tailor) setTailor(data.tailor);
        })
        .catch((err) => console.error("Error fetching tailor details:", err))
        .finally(() => setLoading(false));
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-charcoal/60 bg-cream-light min-h-screen">
        Tikuvchi ma’lumotlari yuklanmoqda...
      </div>
    );
  }

  if (!tailor) {
    return (
      <div className="py-24 text-center bg-cream-light min-h-screen space-y-4">
        <h2 className="text-2xl font-serif font-bold text-charcoal">Tikuvchi topilmadi</h2>
        <Link href="/tailors" className="text-xs font-bold text-burgundy uppercase underline">
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-cream-light min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back Link */}
        <div>
          <Link
            href="/tailors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 hover:text-burgundy uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Katalogga qaytish</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider font-mono">
                <Scissors className="w-3.5 h-3.5 text-hotpink" />
                <span>Verified Tailor</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
                {tailor.name}
              </h1>

              <p className="text-lg font-medium text-hotpink">
                {tailor.workshopName}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal/70 pt-1">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-burgundy" />
                  <span>{tailor.region}, {tailor.city}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-burgundy" />
                  <span>{tailor.experienceYears} yillik professional tajriba</span>
                </span>
              </div>

              <div className="pt-2 text-sm text-charcoal/80 leading-relaxed max-w-2xl">
                {tailor.bio}
              </div>

              <div className="pt-4 border-t border-charcoal/10 space-y-2">
                <span className="text-xs uppercase font-mono font-bold text-charcoal/60">
                  Ixtisoslik va xizmatlar:
                </span>
                <p className="text-xs font-semibold text-burgundy bg-cream-light p-3 rounded-xl border border-burgundy/10">
                  {tailor.specialties}
                </p>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="md:col-span-4 p-6 rounded-2xl bg-cream-light border border-burgundy/15 space-y-6">
              <div className="space-y-1">
                <span className="text-xs text-charcoal/60 uppercase font-mono block">
                  Boshlang‘ich xizmat narxi:
                </span>
                <p className="text-2xl font-serif font-bold text-burgundy">
                  {new Intl.NumberFormat("uz-UZ").format(tailor.startingPrice)} so‘m
                </p>
                <p className="text-[11px] text-charcoal/50">
                  Aniq narx dizayn murakkabligiga qarab kelishiladi
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href={`/dashboard/customer/orders/new?tailorId=${tailor.id}`}
                  className="w-full py-3.5 rounded-lg bg-hotpink text-white font-semibold text-xs uppercase tracking-wider hover:bg-hotpink-hover shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Kiyim tikishga buyurtma berish</span>
                </Link>

                <Link
                  href={`/dashboard/customer/messages?userId=${tailor.id}`}
                  className="w-full py-3 rounded-lg border border-burgundy text-burgundy font-semibold text-xs uppercase tracking-wider hover:bg-burgundy hover:text-cream transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Tikuvchiga xabar yozish</span>
                </Link>
              </div>

              <div className="pt-3 border-t border-charcoal/10 flex items-center gap-2 text-[11px] text-charcoal/60">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Shaffof shartnoma va narx taklifi kafolatlangan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Gallery */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-charcoal">
              Portfolio va ish namunalari
            </h2>
            <span className="text-xs text-charcoal/50 font-mono">
              {tailor.portfolios?.length || 0} ta ish namunasi
            </span>
          </div>

          {!tailor.portfolios || tailor.portfolios.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-burgundy/10 text-xs text-charcoal/60">
              Hozircha portfolio rasmlari yuklanmagan.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tailor.portfolios.map((item: any) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-burgundy/10 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all group"
                >
                  <div className="h-64 bg-charcoal overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.category && (
                      <span className="absolute top-3 left-3 bg-charcoal/80 text-cream px-2.5 py-1 rounded-full text-[10px] font-mono uppercase">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif font-bold text-charcoal text-base">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-charcoal/70 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
