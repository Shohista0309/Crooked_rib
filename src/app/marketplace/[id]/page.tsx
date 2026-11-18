"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShoppingBag,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Send,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState("");

  useEffect(() => {
    if (params?.id) {
      fetch(`/api/products/${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data?.product) setProduct(data.product);
        })
        .catch((err) => console.error("Error fetching product:", err))
        .finally(() => setLoading(false));
    }
  }, [params?.id]);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;

    setSendingInquiry(true);
    setInquiryError("");
    setInquirySuccess(false);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          message: inquiryMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?redirect=" + encodeURIComponent(window.location.pathname));
          return;
        }
        setInquiryError(data.error || "So‘rov yuborishda xatolik yuz berdi");
      } else {
        setInquirySuccess(true);
        setInquiryMessage("");
      }
    } catch (err: any) {
      setInquiryError("Tarmoq xatosi, qayta urinib ko‘ring");
    } finally {
      setSendingInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-charcoal/60 bg-cream-light min-h-screen">
        Mahsulot ma’lumotlari yuklanmoqda...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center bg-cream-light min-h-screen space-y-4">
        <h2 className="text-2xl font-serif font-bold text-charcoal">Mahsulot topilmadi</h2>
        <Link href="/marketplace" className="text-xs font-bold text-burgundy uppercase underline">
          Katalogga qaytish
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-cream-light min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 hover:text-burgundy uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mato bozoriga qaytish</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Product Image */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden bg-charcoal border-4 border-white shadow-xl">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[450px] object-cover"
            />
          </div>

          {/* Details & Inquiries */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider font-mono">
                  {product.category}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mavjud: {product.quantity} {product.unit}</span>
                </span>
              </div>

              <h1 className="text-3xl font-serif font-bold text-charcoal leading-tight">
                {product.name}
              </h1>

              <div className="space-y-1">
                <span className="text-xs text-charcoal/50 uppercase font-mono block">
                  Narx:
                </span>
                <p className="text-3xl font-serif font-bold text-burgundy">
                  {new Intl.NumberFormat("uz-UZ").format(product.price)} so‘m
                  <span className="text-sm font-normal text-charcoal/60"> / {product.unit}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-cream-light border border-burgundy/10">
                  <span className="text-charcoal/50 uppercase font-mono text-[10px] block">Material:</span>
                  <span className="font-semibold text-charcoal">{product.material}</span>
                </div>
                <div className="p-3 rounded-xl bg-cream-light border border-burgundy/10">
                  <span className="text-charcoal/50 uppercase font-mono text-[10px] block">Rangi:</span>
                  <span className="font-semibold text-charcoal">{product.color}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-charcoal/80 leading-relaxed pt-2">
                <span className="text-charcoal/50 uppercase font-mono text-[10px] block">Tavsif:</span>
                <p>{product.description}</p>
              </div>

              {/* Seller Box */}
              <div className="p-4 rounded-xl bg-cream border border-burgundy/15 space-y-2 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-hotpink block">
                  Sotuvchi do‘kon:
                </span>
                <p className="font-bold text-charcoal text-sm">
                  {product.sellerProfile?.shopName}
                </p>
                <div className="flex items-center gap-1.5 text-charcoal/70">
                  <MapPin className="w-3.5 h-3.5 text-burgundy" />
                  <span>{product.region}, {product.city}</span>
                </div>
              </div>
            </div>

            {/* Product Inquiry Box */}
            <div className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-charcoal flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-hotpink" />
                <span>Sotuvchiga so‘rov yuborish</span>
              </h3>
              <p className="text-xs text-charcoal/60 leading-relaxed">
                Mato mavjudligi, namuna yuborish yoki ulgurji narxlar bo‘yicha to‘g‘ridan-to‘g‘ri sotuvchiga so‘rov qoldiring.
              </p>

              {inquirySuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>So‘rovingiz sotuvchiga yuborildi! Javob xabarnomasi kabinetingizga keladi.</span>
                </div>
              )}

              {inquiryError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                  {inquiryError}
                </div>
              )}

              <form onSubmit={handleSendInquiry} className="space-y-3">
                <textarea
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  rows={3}
                  placeholder="Masalan: 5 metr olmoqchiman, yetkazib berish bormi yoki Toshkentda filialingiz bormi?..."
                  className="w-full p-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/40"
                  required
                />
                <button
                  type="submit"
                  disabled={sendingInquiry}
                  className="w-full py-3 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingInquiry ? "Yuborilmoqda..." : "So‘rovni jo‘natish"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
