"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Scissors,
  Sparkles,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  User,
  Plus,
} from "lucide-react";

export default function CreatorDashboardPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/users/profile").then((r) => r.json()),
    ])
      .then(([ordersData, profileData]) => {
        if (ordersData?.orders) setOrders(ordersData.orders);
        if (profileData?.user?.creatorProfile) setProfile(profileData.user.creatorProfile);
      })
      .catch((err) => console.error("Error loading creator dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const incomingRequests = orders.filter((o) => o.status === "REQUEST_SUBMITTED");
  const inProgressOrders = orders.filter(
    (o) => o.status === "CUSTOMER_APPROVED" || o.status === "IN_PROGRESS" || o.status === "READY"
  );
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");

  const totalEarnings = orders
    .filter((o) => o.status === "COMPLETED" || o.status === "CUSTOMER_APPROVED" || o.status === "IN_PROGRESS")
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  return (
    <DashboardLayout allowedRole="CREATOR">
      <div className="space-y-8">
        {/* Banner */}
        <div className="p-8 rounded-3xl bg-charcoal text-cream relative overflow-hidden shadow-xl border border-burgundy/30">
          <div className="absolute right-0 top-0 w-64 h-64 bg-hotpink/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="px-3 py-1 rounded-full bg-hotpink/20 text-hotpink text-xs font-semibold uppercase tracking-wider font-mono">
              Tikuvchi / Dizayner Paneli
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-cream">
              {profile?.workshopName || "Hunarmand ustaxonasi"}
            </h1>
            <p className="text-cream/80 text-xs sm:text-sm leading-relaxed">
              Mijozlardan kelgan kiyim tikish so‘rovlarini qabul qiling, o‘zingizga qulay narx va muddatni taklif qiling hamda buyurtmalarni boshqaring.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/dashboard/creator/orders"
                className="px-5 py-2.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow transition-all inline-flex items-center gap-1.5"
              >
                <Scissors className="w-4 h-4" />
                <span>Buyurtmalarni ko‘rish ({orders.length})</span>
              </Link>
              <Link
                href="/dashboard/creator/portfolio"
                className="px-5 py-2.5 rounded-xl border border-cream/30 text-cream text-xs font-semibold uppercase tracking-wider hover:bg-cream/10 transition-all inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-hotpink" />
                <span>Portfolioni yangilash</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Yangi so‘rovlar</span>
            <p className="text-3xl font-mono font-bold text-hotpink">
              {loading ? "..." : incomingRequests.length}
            </p>
            <p className="text-[11px] text-charcoal/60">Narx taklifi kutilayotgan</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Jarayondagi ishlar</span>
            <p className="text-3xl font-mono font-bold text-burgundy">
              {loading ? "..." : inProgressOrders.length}
            </p>
            <p className="text-[11px] text-charcoal/60">Tikilayotgan liboslar</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Tugatilgan liboslar</span>
            <p className="text-3xl font-mono font-bold text-emerald-600">
              {loading ? "..." : completedOrders.length}
            </p>
            <p className="text-[11px] text-charcoal/60">Muvaffaqiyatli topshirilgan</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Tasdiqlangan hajm</span>
            <p className="text-2xl font-mono font-bold text-charcoal">
              {loading ? "..." : new Intl.NumberFormat("uz-UZ").format(totalEarnings)}
            </p>
            <p className="text-[11px] text-charcoal/60">so‘m (tasdiqlangan takliflar)</p>
          </div>
        </div>

        {/* Actionable Orders List */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-charcoal">
              Kelgan buyurtmalar
            </h2>
            <Link
              href="/dashboard/creator/orders"
              className="text-xs font-bold text-burgundy uppercase hover:text-hotpink inline-flex items-center gap-1 transition-colors"
            >
              <span>Barchasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <p className="text-xs text-charcoal/50">Buyurtmalar yuklanmoqda...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-xs text-charcoal/50">
              Hozircha buyurtma so‘rovlari kelmagan. Portfoliongizni to‘ldiring, shunda mijozlar sizni tezroq topadi.
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl border border-charcoal/10 bg-cream-light/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-burgundy/30 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-burgundy">
                        {order.orderNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-burgundy/10 text-burgundy font-mono">
                        {t.orderStatuses[order.status as keyof typeof t.orderStatuses] || order.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-charcoal">
                      Mijoz: {order.customer?.name} ({order.customer?.email})
                    </p>
                    {order.design && (
                      <p className="text-[11px] text-charcoal/60">
                        Libos: {order.design.title}
                      </p>
                    )}
                    <p className="text-[11px] text-charcoal/70 line-clamp-1">
                      Mijoz izohi: {order.customerNotes}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/dashboard/creator/orders/${order.id}`}
                      className="px-5 py-2.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-colors"
                    >
                      Ko‘rib chiqish
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
