"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  Sparkles,
  Scissors,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Heart,
  TrendingUp,
  Users,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Layers,
  Palette,
  Compass,
} from "lucide-react";

export default function HomePage() {
  const { t, language } = useLanguage();

  const [analytics, setAnalytics] = useState<any>(null);
  const [featuredTailors, setFeaturedTailors] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics").then((r) => r.json()),
      fetch("/api/tailors").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ])
      .then(([analyticsData, tailorsData, productsData]) => {
        if (analyticsData?.metrics) setAnalytics(analyticsData.metrics);
        if (tailorsData?.tailors) setFeaturedTailors(tailorsData.tailors.slice(0, 3));
        if (productsData?.products) setFeaturedProducts(productsData.products.slice(0, 4));
      })
      .catch((err) => console.error("Error loading home data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-light via-cream/40 to-cream-light py-20 lg:py-28 border-b border-burgundy/10">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#651D32_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-hotpink" />
                <span>AI-Powered Social Fashion Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-charcoal leading-[1.15] tracking-tight">
                {t.landing.heroTitle}
              </h1>

              <p className="text-lg sm:text-xl text-charcoal/80 font-sans leading-relaxed max-w-2xl">
                {t.landing.heroSubtitle}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/dashboard/customer/ai-studio"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg bg-hotpink text-white font-semibold text-sm uppercase tracking-wider hover:bg-hotpink-hover shadow-lg shadow-hotpink/25 hover:shadow-xl hover:shadow-hotpink/35 transition-all transform hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.landing.ctaDesign}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/tailors"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-lg bg-burgundy text-cream font-semibold text-sm uppercase tracking-wider hover:bg-burgundy-light shadow-md transition-all"
                >
                  <Scissors className="w-4 h-4 text-hotpink" />
                  <span>{t.landing.ctaTailors}</span>
                </Link>
              </div>

              {/* Social Mission badge */}
              <div className="pt-6 border-t border-charcoal/10 flex items-center gap-3 text-xs text-charcoal/70">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>O‘zbekiston xotin-qizlarining bandligi va mustaqil daromad olishini qo‘llab-quvvatlaymiz</span>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-charcoal">
                  <img
                    src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80"
                    alt="Fashion tailoring editorial"
                    className="w-full h-[450px] object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-charcoal/90 backdrop-blur-md border border-cream/20 text-cream">
                    <div className="flex items-center justify-between text-xs text-hotpink font-mono uppercase mb-1">
                      <span>Bespoke Artisan Studio</span>
                      <span>100% Verified</span>
                    </div>
                    <p className="font-serif text-base font-semibold">
                      “Tikuvchi ayollarimiz mehnati qadrlanadigan zamonaviy FashionTech ekotizimi.”
                    </p>
                  </div>
                </div>

                {/* Floating mini badge */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl border border-charcoal/10 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-hotpink/10 text-hotpink">
                    <Heart className="w-5 h-5 fill-hotpink" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-charcoal">Uyda tikuvchi ayollar</p>
                    <p className="text-[11px] text-charcoal/60">Doimiy mijoz va kafolatlangan buyurtma</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="py-20 bg-white border-b border-burgundy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-hotpink">
              Bosqichma-bosqich
            </h2>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
              Platforma qanday ishlaydi?
            </p>
            <p className="text-charcoal/70 text-base">
              G‘oyadan tortib tayyor libosgacha bo‘lgan to‘liq shaffof jarayon
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
            {[
              {
                step: "01",
                icon: Sparkles,
                title: "Dizayn g‘oyasi",
                desc: "AI Studio orqali kiyim turi, uslubi, ranglari va faslini tanlang yoki o‘z eskizingizni kiriting.",
              },
              {
                step: "02",
                icon: Palette,
                title: "Material tanlash",
                desc: "Haqiqiy do‘konlardan tabiiy ipak, adras yoki bezaklarni tanlab, buyurtmaga moslang.",
              },
              {
                step: "03",
                icon: Scissors,
                title: "Tikuvchini topish",
                desc: "Mahalliy mohir tikuvchilar portfoliosi va narxlarini ko‘rib, to‘g‘ridan-to‘g‘ri so‘rov yuboring.",
              },
              {
                step: "04",
                icon: ShieldCheck,
                title: "Taklif va ijro",
                desc: "Tikuvchi narx va muddat taklif qiladi. Tasdiqlangach, tikish jarayoni shaffof kuzatiladi.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="relative p-6 rounded-xl bg-cream-light border border-burgundy/10 hover:border-burgundy/30 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-bold text-burgundy/30 group-hover:text-hotpink transition-colors">
                      {item.step}
                    </span>
                    <div className="p-2.5 rounded-lg bg-burgundy/5 text-burgundy group-hover:bg-hotpink group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3, 4, 5. THREE PILLARS (Customers, Tailors, Sellers) */}
      <section className="py-20 bg-cream/30 border-b border-burgundy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-hotpink">
              Ekotizim ishtirokchilari
            </h2>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
              Har bir tomon uchun haqiqiy imkoniyatlar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* For Customers */}
            <div className="p-8 rounded-2xl bg-white border border-burgundy/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-charcoal">
                  {t.landing.forCustomersTitle}
                </h3>
                <p className="text-sm text-charcoal/75 leading-relaxed">
                  {t.landing.forCustomersDesc}
                </p>
                <ul className="space-y-2 pt-2 text-xs text-charcoal/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hotpink flex-shrink-0" />
                    <span>AI yordamida noyob libos konseptsiyasini yaratish</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hotpink flex-shrink-0" />
                    <span>Haqiqiy matolar katalogidan material tanlash</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hotpink flex-shrink-0" />
                    <span>Shaffof narx va qulay muddatga buyurtma berish</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-charcoal/10">
                <Link
                  href="/tailors"
                  className="text-xs font-bold text-burgundy uppercase tracking-wider inline-flex items-center gap-1.5 hover:text-hotpink transition-colors"
                >
                  <span>Tikuvchilarni qidirish</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* For Tailors */}
            <div className="p-8 rounded-2xl bg-burgundy text-cream shadow-xl border border-burgundy flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-hotpink/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-hotpink/20 text-hotpink flex items-center justify-center">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-cream">
                  {t.landing.forTailorsTitle}
                </h3>
                <p className="text-sm text-cream/80 leading-relaxed">
                  {t.landing.forTailorsDesc}
                </p>
                <ul className="space-y-2 pt-2 text-xs text-cream/75">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hotpink flex-shrink-0" />
                    <span>Professional portfolio va o‘z ustaxonasi sahifasi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hotpink flex-shrink-0" />
                    <span>Mustaqil narx va muddat belgilash erkinligi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hotpink flex-shrink-0" />
                    <span>Doimiy buyurtmalar orqali barqaror daromad</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-cream/20 relative z-10">
                <Link
                  href="/register"
                  className="text-xs font-bold text-hotpink uppercase tracking-wider inline-flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span>Tikuvchi sifatida qo‘shilish</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* For Sellers */}
            <div className="p-8 rounded-2xl bg-white border border-burgundy/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-burgundy/10 text-burgundy flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-charcoal">
                  {t.landing.forSellersTitle}
                </h3>
                <p className="text-sm text-charcoal/75 leading-relaxed">
                  {t.landing.forSellersDesc}
                </p>
                <ul className="space-y-2 pt-2 text-xs text-charcoal/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hotpink flex-shrink-0" />
                    <span>Mato, ip va furnituralarni onlayn sotish</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hotpink flex-shrink-0" />
                    <span>Tikuvchilar bilan to‘g‘ridan-to‘g‘ri B2B aloqa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-hotpink flex-shrink-0" />
                    <span>Zaxira va narxlarni mustaqil boshqarish</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-charcoal/10">
                <Link
                  href="/marketplace"
                  className="text-xs font-bold text-burgundy uppercase tracking-wider inline-flex items-center gap-1.5 hover:text-hotpink transition-colors"
                >
                  <span>Mato katalogini ko‘rish</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AI DESIGN STUDIO SHOWCASE */}
      <section className="py-20 bg-charcoal text-cream border-b border-burgundy/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hotpink/20 text-hotpink text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Texnologik innovatsiya</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cream">
                {t.landing.aiSectionTitle}
              </h2>
              <p className="text-hotpink font-medium text-lg">
                {t.landing.aiSectionSubtitle}
              </p>
              <p className="text-cream/70 text-sm leading-relaxed">
                {t.landing.aiSectionDesc}
              </p>
              <div className="space-y-3 pt-2 text-xs text-cream/80">
                <div className="p-3 rounded-lg bg-charcoal-muted border border-cream/10 flex items-start gap-3">
                  <Layers className="w-4 h-4 text-hotpink mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-cream">Haqiqiy AI konfiguratsiyasi:</span> Tashqi OpenAI/Gemini API bilan integratsiya. Agar kalit mavjud bo‘lmasa, tizim soxta natija chiqarmasdan, qo‘lda reja kiritish yoki eskiz yuklash imkonini beradi.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-charcoal-muted border border-cream/10 flex items-start gap-3">
                  <Palette className="w-4 h-4 text-hotpink mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-cream">Aqlli material tavsiyasi:</span> Dizayn uchun mos matolar bevosita platformadagi sotuvchilar zaxirasidan tanlab olinadi.
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Link
                  href="/dashboard/customer/ai-studio"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Studio orqali loyihalash</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-6 rounded-2xl bg-charcoal-muted border border-cream/15 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-cream/10 pb-3">
                  <span className="text-xs uppercase font-mono tracking-widest text-hotpink">
                    AI Design Specification Example
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-hotpink/20 text-hotpink font-mono">
                    CROOKED RIB SPEC
                  </span>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-cream/50 uppercase font-mono text-[10px]">Libos:</span>
                    <p className="font-semibold text-cream text-sm">Shohona Adras Trench & Kechki Kostyum</p>
                  </div>
                  <div>
                    <span className="text-cream/50 uppercase font-mono text-[10px]">Konseptsiya:</span>
                    <p className="text-cream/80 leading-relaxed text-[11px]">
                      Zamonaviy bichim va milliy nafislik uyg‘unligi. Beli kamar bilan urg‘ulangan, yoqa qismi nozik qirqimli Marg‘ilon ipak-adras jaketi.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-2.5 rounded bg-charcoal border border-cream/10">
                      <span className="text-hotpink font-semibold block text-[11px] mb-1">Mos mato:</span>
                      <p className="text-cream/70 text-[10px]">100% Marg‘ilon Ipak Xon-Atlasi, Paxta astar</p>
                    </div>
                    <div className="p-2.5 rounded bg-charcoal border border-cream/10">
                      <span className="text-hotpink font-semibold block text-[11px] mb-1">Furnitura:</span>
                      <p className="text-cream/70 text-[10px]">6 dona antiqa metall tugma, yashirin zamok</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-charcoal border border-cream/10">
                    <span className="text-cream/50 uppercase font-mono text-[10px] block mb-1">Tikuvchiga ko‘rsatma:</span>
                    <p className="text-cream/80 text-[10px]">
                      Adras gullari ko‘krak va yeng tutashgan joyda to‘liq simmetriyada birlashtirilsin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FEATURED TAILORS SECTION */}
      <section className="py-20 bg-white border-b border-burgundy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs uppercase tracking-widest font-semibold text-hotpink mb-2">
                Mahoratli hunarmandlar
              </h2>
              <p className="text-3xl font-serif font-bold text-charcoal">
                {t.landing.featuredTailors}
              </p>
            </div>
            <Link
              href="/tailors"
              className="text-xs font-bold text-burgundy uppercase tracking-wider hover:text-hotpink inline-flex items-center gap-1 transition-colors"
            >
              <span>Barcha tikuvchilarni ko‘rish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTailors.map((tailor) => (
              <div
                key={tailor.id}
                className="rounded-2xl border border-burgundy/10 bg-cream-light overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-charcoal overflow-hidden">
                    <img
                      src={
                        tailor.portfolios?.[0]?.imageUrl ||
                        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={tailor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-burgundy">
                      {tailor.experienceYears} yillik tajriba
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-xl font-bold text-charcoal">
                        {tailor.name}
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-hotpink">
                      {tailor.workshopName}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal/60">
                      <MapPin className="w-3.5 h-3.5 text-burgundy" />
                      <span>{tailor.region}, {tailor.city}</span>
                    </div>
                    <p className="text-xs text-charcoal/70 line-clamp-2 leading-relaxed">
                      {tailor.specialties}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-charcoal/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-charcoal/50 uppercase block font-mono">Boshlang‘ich narx:</span>
                    <span className="text-sm font-bold text-burgundy font-mono">
                      {new Intl.NumberFormat("uz-UZ").format(tailor.startingPrice)} so‘m
                    </span>
                  </div>
                  <Link
                    href={`/tailors/${tailor.id}`}
                    className="px-4 py-2 rounded-md bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light transition-colors"
                  >
                    Profil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FEATURED MATERIALS SECTION */}
      <section className="py-20 bg-cream/30 border-b border-burgundy/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xs uppercase tracking-widest font-semibold text-hotpink mb-2">
                Haqiqiy do‘konlar zaxirasi
              </h2>
              <p className="text-3xl font-serif font-bold text-charcoal">
                {t.landing.featuredMaterials}
              </p>
            </div>
            <Link
              href="/marketplace"
              className="text-xs font-bold text-burgundy uppercase tracking-wider hover:text-hotpink inline-flex items-center gap-1 transition-colors"
            >
              <span>Barcha mahsulotlar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-burgundy/10 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-charcoal overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-charcoal/80 text-cream text-[10px] font-mono uppercase">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <h4 className="font-serif font-bold text-charcoal text-sm line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-charcoal/60 line-clamp-1">
                      {product.material} • {product.color}
                    </p>
                    <p className="text-xs font-bold text-burgundy font-mono">
                      {new Intl.NumberFormat("uz-UZ").format(product.price)} so‘m / {product.unit}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Link
                    href={`/marketplace/${product.id}`}
                    className="w-full block text-center py-2 rounded bg-cream text-charcoal text-xs font-semibold uppercase hover:bg-burgundy hover:text-cream transition-colors"
                  >
                    Batafsil
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. SOCIAL IMPACT ANALYTICS (REAL DATABASE METRICS) */}
      <section className="py-20 bg-charcoal text-cream border-b border-burgundy/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Haqiqiy ma’lumotlar bazasi ko‘rsatkichlari</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-cream">
              {t.landing.impactTitle}
            </h2>
            <p className="text-cream/70 text-sm leading-relaxed">
              {t.landing.impactDesc}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-charcoal-muted border border-cream/10 text-center space-y-2">
              <Users className="w-6 h-6 text-hotpink mx-auto" />
              <p className="text-3xl font-mono font-bold text-cream">
                {analytics?.totalCreators ?? 0}
              </p>
              <p className="text-xs text-cream/70 uppercase tracking-wider">
                {t.impact.registeredTailors}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-charcoal-muted border border-cream/10 text-center space-y-2">
              <Scissors className="w-6 h-6 text-hotpink mx-auto" />
              <p className="text-3xl font-mono font-bold text-cream">
                {analytics?.activeOrders ?? 0}
              </p>
              <p className="text-xs text-cream/70 uppercase tracking-wider">
                {t.impact.activeOrders}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-charcoal-muted border border-cream/10 text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-3xl font-mono font-bold text-cream">
                {analytics?.completedOrders ?? 0}
              </p>
              <p className="text-xs text-cream/70 uppercase tracking-wider">
                {t.impact.completedOrders}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-charcoal-muted border border-cream/10 text-center space-y-2">
              <ShoppingBag className="w-6 h-6 text-hotpink mx-auto" />
              <p className="text-3xl font-mono font-bold text-cream">
                {analytics?.totalSellers ?? 0}
              </p>
              <p className="text-xs text-cream/70 uppercase tracking-wider">
                {t.impact.registeredSellers}
              </p>
            </div>
          </div>

          {/* Transparent gross volume badge */}
          <div className="p-6 rounded-xl bg-charcoal-muted/60 border border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase text-cream/60">
                Tasdiqlangan buyurtmalar umumiy hajmi:
              </span>
              <p className="text-2xl font-mono font-bold text-hotpink">
                {new Intl.NumberFormat("uz-UZ").format(analytics?.grossOrderVolume ?? 0)} so‘m
              </p>
            </div>
            <p className="text-xs text-cream/60 max-w-md leading-relaxed text-left">
              {t.landing.impactDisclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* 10. REGISTER CALL TO ACTION */}
      <section className="py-20 bg-gradient-to-r from-burgundy via-burgundy-dark to-charcoal text-cream text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-cream leading-tight">
            {t.landing.ctaRegisterTitle}
          </h2>
          <p className="text-cream/80 text-base max-w-xl mx-auto">
            {t.landing.ctaRegisterDesc}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-hotpink text-white font-semibold text-sm uppercase tracking-wider hover:bg-hotpink-hover shadow-xl transition-all"
            >
              Bepul ro‘yxatdan o‘tish
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-4 rounded-lg border border-cream/30 text-cream font-semibold text-sm uppercase tracking-wider hover:bg-cream/10 transition-all"
            >
              Loyiha haqida batafsil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
