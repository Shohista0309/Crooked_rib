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
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  FileText,
  AlertCircle,
  Send,
  RefreshCw,
} from "lucide-react";

export default function CreatorOrderDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Quote form state
  const [offeredPrice, setOfferedPrice] = useState("");
  const [estimatedDays, setEstimatedDays] = useState("7");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [sendingQuote, setSendingQuote] = useState(false);

  // Status update state
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchOrder = () => {
    if (!params?.id) return;
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.order) {
          setOrder(data.order);
          if (data.order.totalPrice) setOfferedPrice(data.order.totalPrice.toString());
          if (data.order.estimatedDays) setEstimatedDays(data.order.estimatedDays.toString());
        }
      })
      .catch((err) => console.error("Error loading order:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrder();
  }, [params?.id]);

  const handleSendQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offeredPrice || !estimatedDays) return;

    setSendingQuote(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "SEND_QUOTE",
          offeredPrice: parseFloat(offeredPrice),
          estimatedDays: parseInt(estimatedDays),
          notes: quoteNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Narx taklifini yuborishda xatolik");
      } else {
        setSuccess("Narx va muddat taklifi mijozga muvaffaqiyatli yuborildi!");
        setOrder(data.order);
        fetchOrder();
      }
    } catch (err) {
      setError("Tarmoq xatosi");
    } finally {
      setSendingQuote(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus) return;

    setUpdatingStatus(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_STATUS",
          status: newStatus,
          notes: statusNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Holatni yangilashda xatolik");
      } else {
        setSuccess(`Buyurtma holati yangilandi: ${newStatus}`);
        setOrder(data.order);
        fetchOrder();
      }
    } catch (err) {
      setError("Tarmoq xatosi");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRole="CREATOR">
        <div className="py-24 text-center text-xs text-charcoal/60">
          Buyurtma ma’lumotlari yuklanmoqda...
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout allowedRole="CREATOR">
        <div className="py-24 text-center space-y-4">
          <p className="font-serif font-bold text-lg text-charcoal">Buyurtma topilmadi</p>
          <Link href="/dashboard/creator/orders" className="text-xs text-burgundy font-bold uppercase underline">
            Buyurtmalarga qaytish
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRole="CREATOR">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard/creator/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 hover:text-burgundy uppercase tracking-wider transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Buyurtmalarga qaytish</span>
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono font-bold text-hotpink block">
                Mijoz buyurtmasi
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
                href={`/dashboard/creator/messages?userId=${order.customerId}&orderId=${order.id}`}
                className="px-4 py-2 rounded-xl bg-cream border border-burgundy/20 text-burgundy text-xs font-semibold uppercase hover:bg-burgundy hover:text-cream transition-colors inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Mijozga yozish</span>
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

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* 1. SEND QUOTATION FORM (ACTIVE IF REQUEST_SUBMITTED OR UNDER_REVIEW) */}
        {(order.status === "REQUEST_SUBMITTED" || order.status === "UNDER_REVIEW") && (
          <div className="p-8 rounded-3xl bg-burgundy text-cream shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-cream/20 pb-3">
              <h3 className="font-serif font-bold text-lg text-cream">
                Mijozga narx va muddat taklif qilish
              </h3>
              <span className="text-[10px] font-mono uppercase bg-hotpink/20 text-cream px-2.5 py-0.5 rounded-full">
                Quotation Form
              </span>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-cream/80 block">
                    Taklif etiladigan narx (so‘m):
                  </label>
                  <input
                    type="number"
                    required
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    placeholder="Masalan: 550000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-charcoal text-xs font-mono font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-cream/80 block">
                    Tayyorlanish muddati (ish kuni):
                  </label>
                  <input
                    type="number"
                    required
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    placeholder="Masalan: 7"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white text-charcoal text-xs font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-cream/80 block">
                  Mijozga izoh va tikuv rejangiz:
                </label>
                <textarea
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  rows={2}
                  placeholder="Bichim, mato va fitting jarayoni bo‘yicha takliflaringiz..."
                  className="w-full p-3 rounded-xl bg-white text-charcoal text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={sendingQuote}
                className="w-full py-3.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{sendingQuote ? "Yuborilmoqda..." : "Taklifni mijozga jo‘natish"}</span>
              </button>
            </form>
          </div>
        )}

        {/* 2. STATUS UPDATE CONTROLLER (IF CUSTOMER APPROVED OR IN PROGRESS) */}
        {(order.status === "CUSTOMER_APPROVED" ||
          order.status === "IN_PROGRESS" ||
          order.status === "READY") && (
          <div className="p-8 rounded-3xl bg-charcoal text-cream shadow-xl space-y-5 border border-cream/15">
            <div className="flex items-center justify-between border-b border-cream/20 pb-3">
              <h3 className="font-serif font-bold text-lg text-cream">
                Tikish jarayoni holatini yangilash
              </h3>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
                Mijoz tasdiqlagan ✓
              </span>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-cream/80 block">
                  Yangi holatni tanlang:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-charcoal text-xs font-semibold focus:outline-none"
                  required
                >
                  <option value="">Holatni tanlang...</option>
                  <option value="IN_PROGRESS">Tikish jarayonida (In Progress)</option>
                  <option value="READY">Libos tayyor bo‘ldi (Ready)</option>
                  <option value="COMPLETED">Mijozga topshirildi va yakunlandi (Completed)</option>
                  <option value="CANCELLED">Bekor qilish (Cancelled)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-cream/80 block">
                  Holat o‘zgarishi bo‘yicha izoh (ixtiyoriy):
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Masalan: Birinchi fitting (primerka) muvaffaqiyatli o‘tdi, yakuniy choklar qo‘yilmoqda..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-charcoal text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={updatingStatus}
                className="w-full py-3.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 text-hotpink" />
                <span>{updatingStatus ? "Yangilanmoqda..." : "Holatni yangilash"}</span>
              </button>
            </form>
          </div>
        )}

        {/* 3. CUSTOMER ORDER DETAILS */}
        <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-6">
          <h2 className="font-serif font-bold text-xl text-charcoal">
            Mijoz ma’lumotlari va o‘lchamlari
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
                Mijoz ismi:
              </span>
              <p className="font-bold text-charcoal text-sm">
                {order.customer?.name}
              </p>
              <p className="text-charcoal/60">
                Email: {order.customer?.email} • Tel: {order.customer?.phone || "Mavjud emas"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
                Kelgan sana:
              </span>
              <p className="font-semibold text-charcoal">
                {new Date(order.createdAt).toLocaleString("uz-UZ")}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-charcoal/10 space-y-2">
            <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
              Tana o‘lchamlari (Mijoz kiritgan):
            </span>
            <div className="p-4 rounded-2xl bg-cream-light border border-burgundy/10 font-mono text-xs text-charcoal font-medium">
              {order.measurements || "Ko‘rsatilmagan"}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
              Mijozning qo‘shimcha talablari va izohi:
            </span>
            <p className="text-xs text-charcoal/80 leading-relaxed bg-cream-light/40 p-4 rounded-2xl border border-charcoal/10">
              {order.customerNotes}
            </p>
          </div>

          {order.deliveryAddress && (
            <div className="space-y-1">
              <span className="text-charcoal/50 uppercase font-mono text-[10px] block">
                Yetkazib berish / fitting manzili:
              </span>
              <p className="text-xs text-charcoal/80">
                {order.deliveryAddress}
              </p>
            </div>
          )}
        </div>

        {/* 4. ATTACHED DESIGN */}
        {order.design && (
          <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-hotpink">
                Mijoz yuborgan kiyim dizayni
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
                Texnik izoh: {order.design.technicalNotes}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
