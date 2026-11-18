"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Package,
} from "lucide-react";

export default function SellerInquiriesPage() {
  const { t } = useLanguage();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const fetchInquiries = () => {
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data) => {
        if (data?.inquiries) setInquiries(data.inquiries);
      })
      .catch((err) => console.error("Error loading inquiries:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleReply = async (inquiryId: string) => {
    const text = replyText[inquiryId];
    if (!text?.trim()) return;

    setSubmittingId(inquiryId);
    try {
      const res = await fetch(`/api/inquiries/${inquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: text }),
      });

      if (res.ok) {
        setReplyText((prev) => ({ ...prev, [inquiryId]: "" }));
        fetchInquiries();
      }
    } catch (err) {
      console.error("Reply error:", err);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <DashboardLayout allowedRole="SELLER">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">
            Xaridor so‘rovlari
          </h1>
          <p className="text-xs text-charcoal/60">
            Tikuvchilar va buyurtmachilarning mahsulot mavjudligi bo‘yicha so‘rovlari
          </p>
        </div>

        {loading ? (
          <p className="text-xs text-charcoal/50">So‘rovlar yuklanmoqda...</p>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-burgundy/10 space-y-3">
            <MessageSquare className="w-10 h-10 text-charcoal/30 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-charcoal">
              Hozircha so‘rovlar yo‘q
            </h3>
            <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
              Xaridorlar mahsulotlaringiz sahifasida so‘rov yuborganida bu yerda paydo bo‘ladi.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-6 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-4"
              >
                {/* Product snapshot */}
                <div className="flex items-center gap-3 border-b border-charcoal/10 pb-3">
                  <img
                    src={inq.product?.imageUrl}
                    alt={inq.product?.name}
                    className="w-12 h-12 rounded-lg object-cover bg-charcoal"
                  />
                  <div>
                    <span className="text-[10px] text-hotpink uppercase font-mono font-bold block">
                      Mahsulot:
                    </span>
                    <h4 className="font-serif font-bold text-sm text-charcoal">
                      {inq.product?.name}
                    </h4>
                    <p className="text-xs font-mono text-burgundy">
                      {new Intl.NumberFormat("uz-UZ").format(inq.product?.price)} so‘m
                    </p>
                  </div>
                </div>

                {/* Sender & Message */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-charcoal/60">
                    <span>Yuboruvchi: <strong>{inq.sender?.name}</strong> ({inq.sender?.phone || inq.sender?.email})</span>
                    <span className="font-mono text-[10px]">
                      {new Date(inq.createdAt).toLocaleString("uz-UZ")}
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-cream-light border border-burgundy/10 text-charcoal leading-relaxed">
                    {inq.message}
                  </div>
                </div>

                {/* Existing Reply */}
                {inq.reply ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <span className="font-bold text-emerald-800 text-[11px] block">
                      Sizning javobingiz:
                    </span>
                    <p className="text-emerald-900">{inq.reply}</p>
                  </div>
                ) : (
                  /* Reply Input form */
                  <div className="space-y-2 pt-2">
                    <textarea
                      value={replyText[inq.id] || ""}
                      onChange={(e) =>
                        setReplyText({ ...replyText, [inq.id]: e.target.value })
                      }
                      rows={2}
                      placeholder="Xaridorga javob yozing (masalan: Ha, 10 metr mavjud, bugunoq yetkazib beramiz)..."
                      className="w-full p-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
                    />
                    <button
                      type="button"
                      onClick={() => handleReply(inq.id)}
                      disabled={submittingId === inq.id || !replyText[inq.id]?.trim()}
                      className="px-5 py-2.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{submittingId === inq.id ? "Yuborilmoqda..." : "Javob yuborish"}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
