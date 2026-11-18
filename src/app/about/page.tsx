"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { Heart, Users, Target, ShieldCheck, Sparkles, Scissors, ShoppingBag, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="py-16 bg-cream-light min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-hotpink" />
            <span>Ijtimoiy missiyamiz</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal">
            CROOKED RIB haqida
          </h1>
          <p className="text-lg text-charcoal/80 font-sans leading-relaxed">
            {t.common.brandPhilosophy} Moda, hunarmandchilik va zamonaviy texnologiyalarni birlashtirib, O‘zbekiston xotin-qizlarining iqtisodiy imkoniyatlarini kengaytiramiz.
          </p>
        </div>

        {/* The Core Social Problem */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-burgundy/10 text-burgundy">
              <Target className="w-6 h-6 text-hotpink" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal">
                Asosiy ijtimoiy muammo va maqsad
              </h2>
              <p className="text-xs text-charcoal/60 uppercase tracking-wider font-mono">
                Kambag‘allikni qisqartirish va bandlikni oshirish
              </p>
            </div>
          </div>

          <p className="text-sm text-charcoal/80 leading-relaxed">
            O‘zbekistonda yuz minglab ayollar tikuvchilik mahoratiga ega bo‘lsa-da, ularning ko‘pchiligi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-charcoal/80">
            <div className="p-4 rounded-xl bg-cream-light border border-burgundy/5 space-y-1">
              <span className="font-bold text-burgundy block">1. Doimiy mijoz topish qiyinligi:</span>
              <p className="text-charcoal/70">Mijozlar faqat yaqin tanishlar doirasi bilan cheklanib qoladi.</p>
            </div>
            <div className="p-4 rounded-xl bg-cream-light border border-burgundy/5 space-y-1">
              <span className="font-bold text-burgundy block">2. Raqamli ko‘rinishning yo‘qligi:</span>
              <p className="text-charcoal/70">O‘z portfoliosi va ish namunalarini keng auditoriyaga taqdim eta olmaydi.</p>
            </div>
            <div className="p-4 rounded-xl bg-cream-light border border-burgundy/5 space-y-1">
              <span className="font-bold text-burgundy block">3. Buyurtma vositalarining yetishmasligi:</span>
              <p className="text-charcoal/70">Narx taklif qilish, muddat kelishish va buyurtma holatini kuzatishda qiyinchiliklar mavjud.</p>
            </div>
            <div className="p-4 rounded-xl bg-cream-light border border-burgundy/5 space-y-1">
              <span className="font-bold text-burgundy block">4. Xomashyo ta’minotidagi cheklovlar:</span>
              <p className="text-charcoal/70">Mato va bezaklarni arzon hamda sifatli manbalardan to‘g‘ridan-to‘g‘ri topish murakkab.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-burgundy/5 border-l-4 border-burgundy text-xs text-charcoal/85 leading-relaxed">
            <strong>Bizning yechim:</strong> CROOKED RIB mijozlar, tikuvchi xotin-qizlar, mustaqil dizaynerlar va mato yetkazib beruvchilarni sun’iy intellekt asosidagi yagona platformada birlashtiradi. AI texnologiyasi esa buyurtmachi va tikuvchi o‘rtasidagi tushunmovchiliklarni bartaraf etuvchi texnik ko‘prik vazifasini o‘taydi.
          </div>
        </div>

        {/* 3 Groups of Women We Serve */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-charcoal text-center">
            Biz qo‘llab-quvvatlaydigan uch asosiy toifa
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-burgundy/10 text-burgundy flex items-center justify-center font-mono font-bold">
                01
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal">
                Uyda tikuvchilik qiluvchi ayollar
              </h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Oilaviy sharoiti yoki farzand tarbiyasi sababli uydan ishlovchi ayollar uchun onlayn buyurtmalar va doimiy daromad manbaini yaratamiz.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-hotpink/10 text-hotpink flex items-center justify-center font-mono font-bold">
                02
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal">
                Tikuvchilikni biladigan, ammo ishsiz xotin-qizlar
              </h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Hunari bo‘la turib rasmiy ishga joylasha olmagan xotin-qizlarga o‘z mijozlar bazasini noldan shakllantirish imkonini beramiz.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-lg bg-charcoal/10 text-charcoal flex items-center justify-center font-mono font-bold">
                03
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal">
                Kichik tikuvchilik ustaxonalari
              </h3>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                Bir nechta xodimi bor kichik atelyelarga yirik buyurtmalar olish va xomashyo yetkazib beruvchilar bilan to‘g‘ridan-to‘g‘ri ishlash vositalarini taqdim etamiz.
              </p>
            </div>
          </div>
        </div>

        {/* Commitment to Transparency */}
        <div className="p-8 rounded-2xl bg-charcoal text-cream space-y-4">
          <div className="flex items-center gap-2 text-hotpink text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Shaffoflik va mas’uliyat</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-cream">
            Hech qanday soxta va’dalar yoki shishirilgan raqamlar yo‘q
          </h3>
          <p className="text-xs text-cream/70 leading-relaxed">
            Biz platforma statistikalarini (tikuvchilar soni, faol buyurtmalar, umumiy hajm) faqat real ma’lumotlar bazasiga tayangan holda namoyish qilamiz. Ayollarning ijtimoiy holati yoki cheklangan daromadi ularning ommaviy profilida aslo oshkor qilinmaydi, ularning mehnati va qadr-qimmati doimo birinchi o‘rinda turadi.
          </p>
          <div className="pt-2">
            <Link
              href="/social-impact"
              className="text-xs font-semibold text-hotpink hover:text-white inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Ijtimoiy ta’sir ko‘rsatkichlarini ko‘rish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
