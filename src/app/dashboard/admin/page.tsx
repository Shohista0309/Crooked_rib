"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShieldCheck,
  Users,
  Scissors,
  ShoppingBag,
  TrendingUp,
  Package,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => {
        if (data?.metrics) setAnalytics(data.metrics);
      })
      .catch((err) => console.error("Error loading admin analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole="ADMIN">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-burgundy/10 text-burgundy text-xs font-mono uppercase font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-hotpink" />
              <span>Himoyalangan Boshqaruv</span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-charcoal pt-1">
              Administrator Boshqaruv Paneli
            </h1>
            <p className="text-xs text-charcoal/60">
              CROOKED RIB platformasining foydalanuvchilar, buyurtmalar va ijtimoiy ta’sir ko‘rsatkichlari nazorati
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/dashboard/admin/users"
              className="px-4 py-2 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-all"
            >
              Foydalanuvchilar
            </Link>
            <Link
              href="/dashboard/admin/orders"
              className="px-4 py-2 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase hover:bg-hotpink-hover shadow transition-all"
            >
              Buyurtmalar
            </Link>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Tikuvchilar</span>
            <p className="text-3xl font-mono font-bold text-burgundy">
              {loading ? "..." : analytics?.totalCreators ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">Ro‘yxatdan o‘tgan xotin-qizlar</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Faol tikuvchilar</span>
            <p className="text-3xl font-mono font-bold text-charcoal">
              {loading ? "..." : analytics?.activeCreators ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">Buyurtma qabul qilishga tayyor</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Barcha buyurtmalar</span>
            <p className="text-3xl font-mono font-bold text-hotpink">
              {loading ? "..." : analytics?.totalOrders ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">Yuborilgan so‘rovlar soni</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Jarayonda</span>
            <p className="text-3xl font-mono font-bold text-burgundy">
              {loading ? "..." : analytics?.activeOrders ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">Hozirda tikilayotgan</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Yakunlangan</span>
            <p className="text-3xl font-mono font-bold text-emerald-600">
              {loading ? "..." : analytics?.completedOrders ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">Topshirilgan liboslar</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Sotuvchilar</span>
            <p className="text-3xl font-mono font-bold text-charcoal">
              {loading ? "..." : analytics?.totalSellers ?? 0}
            </p>
            <p className="text-[11px] text-charcoal/60">Faol mato do‘konlari</p>
          </div>
        </div>

        {/* Volume statement */}
        <div className="p-8 rounded-3xl bg-charcoal text-cream space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-hotpink">
            Tasdiqlangan buyurtmalar umumiy qiymati
          </span>
          <p className="text-4xl font-mono font-bold text-white">
            {loading ? "..." : new Intl.NumberFormat("uz-UZ").format(analytics?.grossOrderVolume ?? 0)} so‘m
          </p>
          <p className="text-xs text-cream/60 leading-relaxed max-w-2xl">
            Barcha ko‘rsatkichlar sun’iy shishirishlarsiz, PostgreSQL/SQLite bazasidagi amallar orqali shakllanadi.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
