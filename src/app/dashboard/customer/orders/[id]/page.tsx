"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Scissors,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  FileText,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

export default function CustomerOrderDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = () => {
    if (!params?.id) return;
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.order) setOrder(data.order);
      })
      .catch((err) => console.error("Error loading order:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [params?.id]);

  const handleQuotationAction = async (action: "APPROVE_QUOTE" | "REJECT_QUOTE") => {
    setActionLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Amalni bajarishda xatolik yuz berdi");
      } else {
        setOrder(data.order);
        fetchOrder();
      }
    } catch (err) {
      setError("Tarmoq xatosi");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRole="CUSTOMER">
        <div className="py-24 text-center text-xs text-charcoal/60">
          Buyurtma yuklanmoqda...
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout allowedRole="CUSTOMER">
        <div className="py-24 text-center space-y-4">
          <p className="font-serif font-bold text-lg text-charcoal">Buyurtma topilmadi</p>
          <Link href="/dashboard/customer/orders" className="text-xs text-burgundy font-bold uppercase underline">
            Buyurtmalar ro‘yxatiga qaytish
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const latestQuote = order.quotations?.[0];

  return (
    <DashboardLayout allowedRole="CUSTOMER">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard/customer/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 hover:text-burgundy uppercase tracking-wider transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Buyurtmalarga qaytish</span>
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono font-bold text-hotpink block">
                Buyurtma tafsilotlari
              </span>
              <h1 className="text-3xl font-serif font-bold text-charcoal">
                {order.orderNumber}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase bg-burgundy/10 text-burgundy font-mono">
                {t.orderStatuses[order.status as keyof typeof t.orderStatuses] || order.status}
              </span>
              <Link
                href={`/dashboard/customer/messages?userId=${order.creatorId}&orderId=${order.id}`}
                className="px-4 py-2 rounded-xl bg-cream border border-burgundy/20 text-burgundy text-xs font-semibold uppercase hover:bg-burgundy hover:text-cream transition-colors inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Tikuvchiga yozish</span>
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. QUOTATION ACTION CARD (IF QUOTE IS RECEIVED) */}
        {order.status === "QUOTATION_SENT" && latestQuote && (
          <div className="p-8 rounded-3xl bg-burgundy text-cream shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-cream/20 pb-4">
              <span className="text-xs uppercase font-mono font-bold text-hotpink">
                Tikuvchidan narx taklifi keldi!
              </span>
              <span className="text-xs font-mono bg-hotpink/20 text-cream px-2.5 py-1 rounded-full">
                Kutilmoqda
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-cream/70 uppercase font-mono">
                  Taklif qilingan narx:
                </span>
                <p className="text-3xl sm:text-4xl font-serif font-bold text-hotpink">
                  {new Intl.NumberFormat("uz-UZ").format(latestQuote.offeredPrice)} so‘m
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-cream/70 uppercase font-mono">
                  Tayyor bo‘lish muddati:
                </span>
                <p className="text-2xl sm:text-3xl font-serif font-bold text-cream">
                  {latestQuote.estimatedDays} ish kuni
                </p>
              </div>
            </div>

            {latestQuote.notes && (
              <div className="p-4 rounded-2xl bg-charcoal/40 border border-cream/10 text-xs space-y-1">
                <span className="text-hotpink font-mono text-[10px] uppercase font-bold block">
                  Tikuvchi izohi:
                </span>
                <p className="text-cream/90 leading-relaxed font-sans">
                  {latestQuote.notes}
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => handleQuotationAction("APPROVE_QUOTE")}
                disabled={actionLoading}
                className="flex-1 py-3.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{t.orders.acceptQuotation}</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuotationAction("REJECT_QUOTE")}
                disabled={actionLoading}
                className="py-3.5 px-6 rounded-xl border border-cream/30 text-cream text-xs font-semibold uppercase tracking-wider hover:bg-cream/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                <span>{t.orders.rejectQuotation}</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. ORDER DETAILS */}
        <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-6">
          <h2 className="font-serif font-bold text-xl text-charcoal">
            Buyurtma ma’lumotlari
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
                Tikuvchi:
              </span>
              <p className="font-bold text-charcoal text-sm">
                {order.creator?.name}
              </p>
              <p className="text-charcoal/60">
                {order.creator?.creatorProfile?.workshopName} ({order.creator?.creatorProfile?.city})
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
                Yaratilgan sana:
              </span>
              <p className="font-semibold text-charcoal">
                {new Date(order.createdAt).toLocaleString("uz-UZ")}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-charcoal/10 space-y-3">
            <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
              Tana o‘lchamlari:
            </span>
            <div className="p-4 rounded-2xl bg-cream-light border border-burgundy/10 font-mono text-xs text-charcoal">
              {order.measurements || "Ko‘rsatilmagan"}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
              Buyurtma bo‘yicha izohlar:
            </span>
            <p className="text-xs text-charcoal/80 leading-relaxed bg-cream-light/40 p-4 rounded-2xl border border-charcoal/10">
              {order.customerNotes}
            </p>
          </div>

          {order.deliveryAddress && (
            <div className="space-y-1">
              <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
                Yetkazib berish manzili:
              </span>
              <p className="text-xs text-charcoal/80">
                {order.deliveryAddress}
              </p>
            </div>
          )}
        </div>

        {/* 3. ATTACHED DESIGN CARD */}
        {order.design && (
          <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-hotpink">
                Biriktirilgan kiyim dizayni
              </span>
              <span className="px-2.5 py-0.5 rounded bg-burgundy/10 text-burgundy text-[10px] font-mono font-semibold">
                {order.design.category}
              </span>
            </div>
            <h3 className="font-serif font-bold text-xl text-charcoal">
              {order.design.title}
            </h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              {order.design.conceptDescription}
            </p>
            {order.design.technicalNotes && (
              <div className="p-3 rounded-xl bg-charcoal text-cream text-[11px] font-mono">
                {order.design.technicalNotes}
              </div>
            )}
          </div>
        )}

        {/* 4. STATUS HISTORY TIMELINE */}
        <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-lg text-charcoal">
            Buyurtma tarixi va bosqichlari
          </h3>
          <div className="space-y-4">
            {order.statusHistory?.map((step: any, idx: number) => (
              <div key={step.id || idx} className="flex gap-4 items-start">
                <div className="w-6 h-6 rounded-full bg-burgundy text-cream text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="space-y-0.5 text-xs">
                  <span className="font-bold text-charcoal uppercase font-mono">
                    {t.orderStatuses[step.status as keyof typeof t.orderStatuses] || step.status}
                  </span>
                  {step.note && (
                    <p className="text-charcoal/70">{step.note}</p>
                  )}
                  <span className="text-[10px] text-charcoal/40 block font-mono">
                    {new Date(step.createdAt).toLocaleString("uz-UZ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
