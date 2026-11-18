"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Scissors,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  BarChart2,
  Lock,
} from "lucide-react";

export default function SocialImpactPage() {
  const { t } = useLanguage();

  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => {
        if (data?.metrics) setMetrics(data.metrics);
      })
      .catch((err) => console.error("Error fetching social impact:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="py-16 bg-cream-light min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shaffof ijtimoiy statistika</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal">
            Xotin-qizlar bandligi va ijtimoiy ta’sir
          </h1>
          <p className="text-sm sm:text-base text-charcoal/70 leading-relaxed font-sans">
            CROOKED RIB platformasining kambag‘allikni qisqartirish va ayollar bandligiga qo‘shayotgan real hissasi. Barcha ko‘rsatkichlar faqat haqiqiy ma’lumotlar bazasidagi amallar asosida shakllanadi.
          </p>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-charcoal/50">
              <span className="text-xs font-mono uppercase">Ro‘yxatdan o‘tgan tikuvchilar</span>
              <Users className="w-5 h-5 text-hotpink" />
            </div>
            <p className="text-3xl font-mono font-bold text-charcoal">
              {loading ? "..." : metrics?.totalCreators ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">
              Uyda tikuvchilik qiluvchi xotin-qizlar va mustaqil modelyerlar
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-charcoal/50">
              <span className="text-xs font-mono uppercase">Faol hunarmandlar</span>
              <Scissors className="w-5 h-5 text-burgundy" />
            </div>
            <p className="text-3xl font-mono font-bold text-burgundy">
              {loading ? "..." : metrics?.activeCreators ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">
              Hozirda yangi buyurtmalarni qabul qilishga tayyor tikuvchilar
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-charcoal/50">
              <span className="text-xs font-mono uppercase">Yuborilgan so‘rovlar</span>
              <BarChart2 className="w-5 h-5 text-hotpink" />
            </div>
            <p className="text-3xl font-mono font-bold text-charcoal">
              {loading ? "..." : metrics?.totalOrders ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">
              Mijozlar tomonidan tikuvchilarga yuborilgan barcha kiyim buyurtmalari
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-charcoal/50">
              <span className="text-xs font-mono uppercase">Jarayondagi buyurtmalar</span>
              <TrendingUp className="w-5 h-5 text-burgundy" />
            </div>
            <p className="text-3xl font-mono font-bold text-burgundy">
              {loading ? "..." : metrics?.activeOrders ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">
              Narx taklifi berilgan, tasdiqlangan va tikilayotgan buyurtmalar
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-charcoal/50">
              <span className="text-xs font-mono uppercase">Yakunlangan buyurtmalar</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-mono font-bold text-emerald-600">
              {loading ? "..." : metrics?.completedOrders ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">
              Muvaffaqiyatli tikib topshirilgan kiyimlar soni
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-charcoal/50">
              <span className="text-xs font-mono uppercase">Hamkor do‘konlar</span>
              <ShoppingBag className="w-5 h-5 text-hotpink" />
            </div>
            <p className="text-3xl font-mono font-bold text-charcoal">
              {loading ? "..." : metrics?.totalSellers ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">
              Mato, ipak va aksessuarlar yetkazib beruvchi do‘konlar
            </p>
          </div>
        </div>

        {/* Confirmed Platform Gross Volume */}
        <div className="p-8 rounded-3xl bg-charcoal text-cream space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-hotpink">
              Platforma orqali tasdiqlangan buyurtmalar umumiy hajmi
            </span>
            <span className="px-2.5 py-0.5 rounded bg-hotpink/20 text-hotpink font-mono text-[10px]">
              REAL DATABASE VALUE
            </span>
          </div>

          <p className="text-4xl sm:text-5xl font-mono font-bold text-white">
            {loading ? "..." : new Intl.NumberFormat("uz-UZ").format(metrics?.grossOrderVolume ?? 0)} so‘m
          </p>

          <div className="pt-2 border-t border-cream/10 text-xs text-cream/70 leading-relaxed flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-hotpink mt-0.5 flex-shrink-0" />
            <p>
              <strong>Muhim eslatma:</strong> Ushbu summa platforma orqali mijozlar tomonidan tasdiqlangan buyurtmalarning umumiy hisoblangan qiymatini ko‘rsatadi va alohida tikuvchining sof daromadini anglatmaydi. Ayollarning shaxsiy daromadlari yoki cheklangan daromad holati maxfiylik tamoyillariga binoan ommaviy profilda aslo ko‘rsatilmaydi.
            </p>
          </div>
        </div>

        {/* Methodology & Academic Value */}
        <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-xl text-charcoal flex items-center gap-2">
            <Lock className="w-5 h-5 text-burgundy" />
            <span>Tadqiqot va metodologiya asosi</span>
          </h3>
          <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
            Ushbu modul “Raqamli avlod qizlari” dasturi doirasida va kelgusida O‘zbekiston ayollarining bandligini ta’minlash, hunarmandchilikni raqamlashtirish hamda kambag‘allikni qisqartirish bo‘yicha ilmiy va amaliy tadqiqotlar uchun aniq va ishonchli statistik poydevor vazifasini o‘taydi.
          </p>
        </div>
      </div>
    </div>
  );
}
