"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import { Scissors, ArrowLeft, Eye } from "lucide-react";

export default function AdminOrdersPage() {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        if (data?.orders) setOrders(data.orders);
      })
      .catch((err) => console.error("Error loading admin orders:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole="ADMIN">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 hover:text-burgundy uppercase tracking-wider transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Admin paneliga qaytish</span>
          </Link>

          <h1 className="text-3xl font-serif font-bold text-charcoal">
            Barcha buyurtmalar nazorati
          </h1>
          <p className="text-xs text-charcoal/60">
            Platformada yaratilgan barcha kiyim tikish so‘rovlari va ularning amaldagi holati
          </p>
        </div>

        {loading ? (
          <p className="text-xs text-charcoal/50">Buyurtmalar yuklanmoqda...</p>
        ) : (
          <div className="bg-white rounded-3xl border border-burgundy/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-light/60 border-b border-charcoal/10 font-mono uppercase text-charcoal/60 text-[10px]">
                  <tr>
                    <th className="p-4">Raqam</th>
                    <th className="p-4">Mijoz</th>
                    <th className="p-4">Tikuvchi</th>
                    <th className="p-4">Holat</th>
                    <th className="p-4">Qiymat</th>
                    <th className="p-4">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-cream-light/20 transition-colors">
                      <td className="p-4 font-mono font-bold text-burgundy">
                        {o.orderNumber}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-charcoal">{o.customer?.name}</p>
                        <p className="text-[10px] text-charcoal/50">{o.customer?.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-charcoal">{o.creator?.name}</p>
                        <p className="text-[10px] text-charcoal/50">{o.creator?.email}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-burgundy/10 text-burgundy">
                          {t.orderStatuses[o.status as keyof typeof t.orderStatuses] || o.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-charcoal">
                        {o.totalPrice
                          ? `${new Intl.NumberFormat("uz-UZ").format(o.totalPrice)} so‘m`
                          : "Kelishilmoqda"}
                      </td>
                      <td className="p-4 font-mono text-charcoal/60 text-[11px]">
                        {new Date(o.createdAt).toLocaleDateString("uz-UZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
