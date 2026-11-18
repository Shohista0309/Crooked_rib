"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Scissors,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";

export default function CustomerOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data?.orders) setOrders(data.orders);
      })
      .catch((err) => console.error("Error loading customer orders:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole="CUSTOMER">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal">
              {t.nav.myOrders}
            </h1>
            <p className="text-xs text-charcoal/60">
              Tikuvchilarga yuborilgan barcha kiyim buyurtmalaringiz va ularning holati
            </p>
          </div>
          <Link
            href="/dashboard/customer/orders/new"
            className="px-5 py-2.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow transition-all inline-flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi buyurtma</span>
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-charcoal/50">Buyurtmalar yuklanmoqda...</p>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-burgundy/10 space-y-4">
            <Scissors className="w-10 h-10 text-charcoal/30 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-charcoal">
              {t.orders.noOrdersFound}
            </h3>
            <p className="text-xs text-charcoal/60 max-w-md mx-auto">
              Mahalliy mohir tikuvchilarimizga kiyim tikish bo‘yicha ilk buyurtmangizni yuboring.
            </p>
            <Link
              href="/dashboard/customer/orders/new"
              className="inline-block px-5 py-2.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase"
            >
              Buyurtma berish
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-3xl bg-white border border-burgundy/10 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-burgundy">
                      {order.orderNumber}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-burgundy/10 text-burgundy font-mono">
                      {t.orderStatuses[order.status as keyof typeof t.orderStatuses] || order.status}
                    </span>
                    {order.status === "QUOTATION_SENT" && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-hotpink/10 text-hotpink font-mono animate-pulse">
                        Narx taklifi kutilmoqda!
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-charcoal">
                    Tikuvchi: {order.creator?.name}{" "}
                    <span className="text-xs font-normal text-charcoal/60">
                      ({order.creator?.creatorProfile?.workshopName})
                    </span>
                  </p>

                  {order.design && (
                    <p className="text-xs text-charcoal/70">
                      Libos: <strong>{order.design.title}</strong>
                    </p>
                  )}

                  <p className="text-[11px] text-charcoal/60 line-clamp-1">
                    Izoh: {order.customerNotes}
                  </p>
                </div>

                <div className="flex items-center gap-6 self-end md:self-center">
                  {order.totalPrice && (
                    <div className="text-right">
                      <span className="text-[10px] text-charcoal/50 uppercase font-mono block">
                        Taklif narxi:
                      </span>
                      <span className="text-base font-bold text-burgundy font-mono">
                        {new Intl.NumberFormat("uz-UZ").format(order.totalPrice)} so‘m
                      </span>
                      {order.estimatedDays && (
                        <span className="text-[10px] text-charcoal/60 block">
                          Muddat: {order.estimatedDays} kun
                        </span>
                      )}
                    </div>
                  )}

                  <Link
                    href={`/dashboard/customer/orders/${order.id}`}
                    className="px-5 py-2.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{t.common.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
