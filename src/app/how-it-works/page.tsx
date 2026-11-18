"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import { Sparkles, Scissors, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

export default function HowItWorksPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"customer" | "creator" | "seller">("customer");

  return (
    <div className="py-16 bg-cream-light min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-hotpink" />
            <span>Qo‘llanma</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-charcoal">
            CROOKED RIB qanday ishlaydi?
          </h1>
          <p className="text-base text-charcoal/70 leading-relaxed font-sans">
            Har bir ishtirokchi uchun qulay, shaffof va xavfsiz ish tartibi
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex justify-center">
          <div className="p-1.5 rounded-xl bg-white border border-burgundy/10 shadow-sm inline-flex gap-2">
            <button
              onClick={() => setActiveTab("customer")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "customer"
                  ? "bg-burgundy text-cream shadow-md"
                  : "text-charcoal/70 hover:text-burgundy"
              }`}
            >
              <Sparkles className="w-4 h-4 text-hotpink" />
              <span>Mijozlar uchun</span>
            </button>
            <button
              onClick={() => setActiveTab("creator")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "creator"
                  ? "bg-burgundy text-cream shadow-md"
                  : "text-charcoal/70 hover:text-burgundy"
              }`}
            >
              <Scissors className="w-4 h-4 text-hotpink" />
              <span>Tikuvchilar uchun</span>
            </button>
            <button
              onClick={() => setActiveTab("seller")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === "seller"
                  ? "bg-burgundy text-cream shadow-md"
                  : "text-charcoal/70 hover:text-burgundy"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-hotpink" />
              <span>Sotuvchilar uchun</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "customer" && (
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
                Mijozning buyurtma berish yo‘li
              </h2>
              <p className="text-xs text-charcoal/60">
                Orzungizdagi kiyimni loyihalash va uni tikuvchiga topshirish bosqichlari
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  num: "1",
                  title: "Dizayn g‘oyasini ishlab chiqish",
                  desc: "AI Fashion Studio orqali kiyim toifasi, uslubi, ranglari va faslini tanlang. AI sizga kiyim konsepsiyasi, mos matolar va tikuvchiga beriladigan texnik ko‘rsatmalarni tuzib beradi. O‘z eskizingiz bo‘lsa, uni ham yuklashingiz mumkin.",
                },
                {
                  num: "2",
                  title: "Matolar va bezaklarni ko‘rib chiqish",
                  desc: "Tizim dizayningizga mos keladigan haqiqiy sotuvchilar matolarini (Marg‘ilon atlasi, paxta-adras, furnitura) tavsiya etadi.",
                },
                {
                  num: "3",
                  title: "Tikuvchini tanlash va so‘rov yuborish",
                  desc: "O‘z hududingizdagi yoki respublika bo‘ylab mohir tikuvchilar portfoliosi va ish tajribasini solishtiring. Tanlangan tikuvchiga dizayn va tana o‘lchamlaringizni biriktirib buyurtma so‘rovi yuboring.",
                },
                {
                  num: "4",
                  title: "Narx taklifini tasdiqlash va jarayonni kuzatish",
                  desc: "Tikuvchi narx va tayyorlanish muddatini taklif qiladi. Agar sizga ma’qul kelsa, taklifni tasdiqlaysiz. Tikish jarayoni shaxsiy kabinetda bosqichma-bosqich yangilanib boradi.",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-burgundy text-cream font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-charcoal text-base">
                      {step.title}
                    </h3>
                    <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between">
              <span className="text-xs text-charcoal/60">Buyurtma berishga tayyormisiz?</span>
              <Link
                href="/dashboard/customer/ai-studio"
                className="px-5 py-2.5 rounded-lg bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow transition-all inline-flex items-center gap-1.5"
              >
                <span>Kiyim loyihalash</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === "creator" && (
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
                Tikuvchi va dizaynerning ish jarayoni
              </h2>
              <p className="text-xs text-charcoal/60">
                Portfolio yaratish, yangi mijozlar olish va narx belgilash
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  num: "1",
                  title: "Professional profil va portfolio yaratish",
                  desc: "Ismingiz yoki ustaxona nomingiz, hudud, ixtisosligingiz (masalan, kechki liboslar, milliy sarpolar, zardo‘zlik) va avval tikkan ishlaringiz rasmlarini yuklang.",
                },
                {
                  num: "2",
                  title: "Yangi buyurtma so‘rovlarini qabul qilish",
                  desc: "Mijoz sizning mahoratingizni ko‘rib, kiyim dizayni, tana o‘lchamlari va izohlari bilan so‘rov yuboradi. So‘rov bevosita sizning boshqaruv panelingizda ko‘rinadi.",
                },
                {
                  num: "3",
                  title: "Narx va tayyorlanish muddatini taklif qilish",
                  desc: "Dizaynning murakkabligini ko‘rib chiqib, o‘zingizga qulay narx va necha kunda tayyor bo‘lishini belgilaysiz va mijozga taklif yuborasiz.",
                },
                {
                  num: "4",
                  title: "Tikish jarayonini boshqarish",
                  desc: "Mijoz taklifni tasdiqlaganidan keyin ishni boshlaysiz. Buyurtma holatini “Tikish jarayonida”, “Tayyor”, “Yakunlandi” deb yangilab borasiz va mijoz bilan to‘g‘ridan-to‘g‘ri yozishasiz.",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-burgundy text-cream font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-charcoal text-base">
                      {step.title}
                    </h3>
                    <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between">
              <span className="text-xs text-charcoal/60">Tikuvchi sifatida qo‘shiling</span>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all inline-flex items-center gap-1.5"
              >
                <span>Tikuvchi akkauntini ochish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === "seller" && (
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-burgundy/10 shadow-sm space-y-8 animate-in fade-in duration-200">
            <div>
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
                Mato va furnituralar sotuvchisi jarayoni
              </h2>
              <p className="text-xs text-charcoal/60">
                Mahsulot joylashtirish, zaxira nazorati va tikuvchilar bilan aloqa
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  num: "1",
                  title: "Do‘kon profilini to‘ldirish",
                  desc: "Do‘kon nomi, joylashgan viloyat, shahar, manzil va telefon raqamingizni kiriting.",
                },
                {
                  num: "2",
                  title: "Mahsulotlarni katalogga kiritish",
                  desc: "Mato, ip, tugma, zamok va bezaklaringizning aniq fotosurati, materiali, rangi, narxi va mavjud miqdorini joylashtiring.",
                },
                {
                  num: "3",
                  title: "Mijoz va tikuvchilar so‘rovlariga javob berish",
                  desc: "Xaridorlar mahsulot mavjudligi yoki xususiyatlari bo‘yicha so‘rov yuborganda kabinetingizda xabarnoma olasiz va darhol javob bera olasiz.",
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-burgundy text-cream font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {step.num}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-charcoal text-base">
                      {step.title}
                    </h3>
                    <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between">
              <span className="text-xs text-charcoal/60">Do‘koningizni platformaga ulang</span>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all inline-flex items-center gap-1.5"
              >
                <span>Sotuvchi sifatida ro‘yxatdan o‘tish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
