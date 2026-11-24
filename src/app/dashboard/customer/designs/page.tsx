"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Sparkles,
  Scissors,
  Trash2,
  ArrowRight,
  FileText,
  Calendar,
  Layers,
  Camera,
} from "lucide-react";

export default function SavedDesignsPage() {
  const { t } = useLanguage();
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDesigns = () => {
    fetch("/api/designs")
      .then((r) => r.json())
      .then((data) => {
        if (data?.designs) setDesigns(data.designs);
      })
      .catch((err) => console.error("Error loading designs:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Haqiqatan ham bu dizaynni o‘chirmoqchimisiz?")) return;
    try {
      await fetch(`/api/designs/${id}`, { method: "DELETE" });
      fetchDesigns();
    } catch (err) {
      console.error("Delete design error:", err);
    }
  };

  return (
    <DashboardLayout allowedRole="CUSTOMER">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal">
              Saqlangan dizaynlar
            </h1>
            <p className="text-xs text-charcoal/60">
              AI orqali yoki shaxsiy g‘oyangiz asosida yaratilgan libos loyihalari
            </p>
          </div>
          <Link
            href="/dashboard/customer/ai-studio"
            className="px-5 py-2.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow transition-all inline-flex items-center gap-2 self-start"
          >
            <Sparkles className="w-4 h-4" />
            <span>Yangi dizayn yaratish</span>
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-charcoal/50">Dizaynlar yuklanmoqda...</p>
        ) : designs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-burgundy/10 space-y-4">
            <FileText className="w-10 h-10 text-charcoal/30 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-charcoal">
              Hozircha saqlangan dizaynlar yo‘q
            </h3>
            <p className="text-xs text-charcoal/60 max-w-md mx-auto">
              AI Fashion Studio bo‘limiga o‘ting va o‘zingiz uchun maxsus kiyim loyihasini yarating.
            </p>
            <Link
              href="/dashboard/customer/ai-studio"
              className="inline-block px-5 py-2.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase"
            >
              Dizayn yaratish
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {designs.map((d) => (
              <div
                key={d.id}
                className="p-6 rounded-3xl bg-white border border-burgundy/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-burgundy/10 text-burgundy">
                      {d.category} • {d.style}
                    </span>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="p-1.5 text-charcoal/40 hover:text-red-600 transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-charcoal">
                    {d.title}
                  </h3>

                  <p className="text-xs text-charcoal/70 line-clamp-3 leading-relaxed">
                    {d.conceptDescription}
                  </p>

                  <div className="p-3 rounded-xl bg-cream-light border border-burgundy/10 text-xs space-y-1">
                    <div className="flex justify-between text-charcoal/70">
                      <span>Ranglar:</span>
                      <strong className="text-charcoal">{d.colors}</strong>
                    </div>
                    {d.budget && (
                      <div className="flex justify-between text-charcoal/70">
                        <span>Budjet:</span>
                        <strong className="text-burgundy font-mono">
                          {new Intl.NumberFormat("uz-UZ").format(d.budget)} so‘m
                        </strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-charcoal/10 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-charcoal/50 font-mono">
                    {new Date(d.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/customer/virtual-tryon?designId=${d.id}&title=${encodeURIComponent(
                        d.title
                      )}&category=${d.category}`}
                      className="px-3 py-1.5 rounded-lg bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider hover:bg-burgundy hover:text-cream transition-all inline-flex items-center gap-1.5"
                      title="Ushbu dizaynni kiyib ko‘rish"
                    >
                      <Camera className="w-3.5 h-3.5 text-hotpink" />
                      <span>Kiyib ko‘rish</span>
                    </Link>
                    <Link
                      href={`/dashboard/customer/orders/new?designId=${d.id}`}
                      className="px-4 py-1.5 rounded-lg bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow-sm transition-all inline-flex items-center gap-1.5"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Buyurtma</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
