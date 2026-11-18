"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShoppingBag,
  Package,
  Plus,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export default function SellerDashboardPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/users/profile").then((r) => r.json()),
      fetch("/api/inquiries").then((r) => r.json()),
    ])
      .then(([profileData, inqData]) => {
        if (profileData?.user?.sellerProfile) {
          setShop(profileData.user.sellerProfile);
          // Fetch products for this seller
          return fetch(`/api/products?sellerId=${profileData.user.id}`)
            .then((r) => r.json())
            .then((pData) => {
              if (pData?.products) setProducts(pData.products);
              if (inqData?.inquiries) setInquiries(inqData.inquiries);
            });
        }
      })
      .catch((err) => console.error("Error loading seller dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  const totalQuantity = products.reduce((acc, curr) => acc + (curr.quantity || 0), 0);

  return (
    <DashboardLayout allowedRole="SELLER">
      <div className="space-y-8">
        {/* Banner */}
        <div className="p-8 rounded-3xl bg-burgundy text-cream relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-64 h-64 bg-hotpink/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="px-3 py-1 rounded-full bg-hotpink/20 text-hotpink text-xs font-semibold uppercase tracking-wider font-mono">
              Sotuvchi Do‘koni
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-cream">
              {shop?.shopName || "Mato va Aksessuarlar Do‘koni"}
            </h1>
            <p className="text-cream/80 text-xs sm:text-sm leading-relaxed">
              Mato, ipak, ip, tugma va zamok mahsulotlaringizni joylashtiring, narxlarni belgilang va tikuvchilar hamda to‘g‘ridan-to‘g‘ri mijozlardan buyurtma qabul qiling.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/dashboard/seller/products/new"
                className="px-5 py-2.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi mahsulot qo‘shish</span>
              </Link>
              <Link
                href="/dashboard/seller/inquiries"
                className="px-5 py-2.5 rounded-xl border border-cream/30 text-cream text-xs font-semibold uppercase tracking-wider hover:bg-cream/10 transition-all inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-hotpink" />
                <span>So‘rovlar ({inquiries.length})</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">E’lon qilingan mahsulotlar</span>
            <p className="text-3xl font-mono font-bold text-burgundy">
              {loading ? "..." : products.length}
            </p>
            <p className="text-[11px] text-charcoal/60">Katalogdagi faol tovarlar</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Umumiy zaxira miqdori</span>
            <p className="text-3xl font-mono font-bold text-charcoal">
              {loading ? "..." : totalQuantity}
            </p>
            <p className="text-[11px] text-charcoal/60">Metr, dona va o‘ramlar</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-1">
            <span className="text-xs text-charcoal/50 uppercase font-mono">Xaridor so‘rovlari</span>
            <p className="text-3xl font-mono font-bold text-hotpink">
              {loading ? "..." : inquiries.length}
            </p>
            <p className="text-[11px] text-charcoal/60">Mavjudlik va narx bo‘yicha</p>
          </div>
        </div>

        {/* Recent Products */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-charcoal">
              Oxirgi qo‘shilgan mahsulotlar
            </h2>
            <Link
              href="/dashboard/seller/products"
              className="text-xs font-bold text-burgundy uppercase hover:text-hotpink inline-flex items-center gap-1 transition-colors"
            >
              <span>Barchasini ko‘rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <p className="text-xs text-charcoal/50">Mahsulotlar yuklanmoqda...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-8 h-8 text-charcoal/30 mx-auto" />
              <p className="text-sm font-semibold text-charcoal">Hozircha mahsulot qo‘shilmagan</p>
              <Link
                href="/dashboard/seller/products/new"
                className="inline-block px-4 py-2 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase"
              >
                Birinchi mahsulotni joylang
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-burgundy/10 bg-cream-light/30 overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 bg-charcoal overflow-hidden">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-serif font-bold text-charcoal text-sm line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-charcoal/60">
                        {p.material} • {p.color}
                      </p>
                      <p className="text-xs font-bold font-mono text-burgundy">
                        {new Intl.NumberFormat("uz-UZ").format(p.price)} so‘m / {p.unit}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Link
                      href={`/dashboard/seller/products/${p.id}/edit`}
                      className="block text-center py-2 rounded-lg bg-cream text-charcoal text-xs font-semibold uppercase hover:bg-burgundy hover:text-cream transition-colors"
                    >
                      Tahrirlash
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
