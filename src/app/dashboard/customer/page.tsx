"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Sparkles,
  Scissors,
  FileText,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";

export default function CustomerDashboardPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/designs").then((r) => r.json()),
    ])
      .then(([ordersData, designsData]) => {
        if (ordersData?.orders) setOrders(ordersData.orders);
        if (designsData?.designs) setDesigns(designsData.designs);
      })
      .catch((err) => console.error("Error loading customer dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status !== "COMPLETED" && o.status !== "CANCELLED"
  );

  return (
    <DashboardLayout allowedRole="CUSTOMER">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="p-8 rounded-3xl bg-burgundy text-cream relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-64 h-64 bg-hotpink/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="px-3 py-1 rounded-full bg-hotpink/20 text-hotpink text-xs font-semibold uppercase tracking-wider font-mono">
              Mijoz Kabineti
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-cream">
              Xush kelibsiz!
            </h1>
            <p className="text-cream/80 text-xs sm:text-sm leading-relaxed">
              Bu yerda siz o‘z kiyim g‘oyalaringizni AI orqali loyihalashtirishingiz, mahoratli tikuvchilarga buyurtma berishingiz va jarayonni real vaqtda kuzatishingiz mumkin.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/dashboard/customer/ai-studio"
                className="px-5 py-2.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow transition-all inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Yangi kiyim loyihalash</span>
              </Link>
              <Link
                href="/tailors"
                className="px-5 py-2.5 rounded-xl border border-cream/30 text-cream text-xs font-semibold uppercase tracking-wider hover:bg-cream/10 transition-all inline-flex items-center gap-1.5"
              >
                <Scissors className="w-4 h-4 text-hotpink" />
                <span>Tikuvchi qidirish</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Jarayondagi buyurtmalar</span>
            <p className="text-3xl font-mono font-bold text-burgundy">
              {loading ? "..." : activeOrders.length}
            </p>
            <p className="text-[11px] text-charcoal/60">Tikilayotgan va taklif kutilayotgan</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Saqlangan dizaynlar</span>
            <p className="text-3xl font-mono font-bold text-charcoal">
              {loading ? "..." : designs.length}
            </p>
            <p className="text-[11px] text-charcoal/60">AI va shaxsiy loyihalar</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Yakunlangan liboslar</span>
            <p className="text-3xl font-mono font-bold text-emerald-600">
              {loading ? "..." : orders.filter((o) => o.status === "COMPLETED").length}
            </p>
            <p className="text-[11px] text-charcoal/60">Muvaffaqiyatli tikib berilgan</p>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-charcoal">
              Oxirgi buyurtmalaringiz
            </h2>
            <Link
              href="/dashboard/customer/orders"
              className="text-xs font-bold text-burgundy uppercase hover:text-hotpink inline-flex items-center gap-1 transition-colors"
            >
              <span>Barchasini ko‘rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <p className="text-xs text-charcoal/50">Buyurtmalar yuklanmoqda...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Scissors className="w-8 h-8 text-charcoal/30 mx-auto" />
              <p className="text-sm font-semibold text-charcoal">Hozircha buyurtma berilmagan</p>
              <Link
                href="/dashboard/customer/ai-studio"
                className="inline-block px-4 py-2 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase"
              >
                Birinchi dizayningizni yarating
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="p-4 sm:p-5 rounded-2xl border border-charcoal/10 bg-cream-light/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-burgundy/30 transition-all"
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
                    <p className="text-xs font-medium text-charcoal">
                      Tikuvchi: <strong>{order.creator?.name}</strong> ({order.creator?.creatorProfile?.workshopName})
                    </p>
                    {order.design && (
                      <p className="text-[11px] text-charcoal/60">
                        Libos: {order.design.title}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {order.totalPrice && (
                      <div className="text-right">
                        <span className="text-[10px] text-charcoal/50 uppercase block font-mono">Narx:</span>
                        <span className="text-xs font-bold text-burgundy font-mono">
                          {new Intl.NumberFormat("uz-UZ").format(order.totalPrice)} so‘m
                        </span>
                      </div>
                    )}
                    <Link
                      href={`/dashboard/customer/orders/${order.id}`}
                      className="px-4 py-2 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light transition-colors"
                    >
                      Batafsil
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
