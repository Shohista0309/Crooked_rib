"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";
import { Logo } from "./Logo";
import { Heart, Sparkles, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal text-cream pt-16 pb-12 border-t border-burgundy/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-cream/10">
          {/* Brand info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo light={true} />
            <p className="text-cream/70 text-sm max-w-sm leading-relaxed">
              {t.common.brandPhilosophy} CROOKED RIB connects customers, women tailors, fashion designers, and fabric suppliers through an AI-powered marketplace.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-cream/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>“Raqamli avlod qizlari” startap tashabbusi, O‘zbekiston</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-hotpink">
              Platforma
            </h4>
            <ul className="space-y-2 text-sm text-cream/75">
              <li>
                <Link href="/how-it-works" className="hover:text-cream transition-colors">
                  {t.nav.howItWorks}
                </Link>
              </li>
              <li>
                <Link href="/tailors" className="hover:text-cream transition-colors">
                  {t.nav.tailors}
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="hover:text-cream transition-colors">
                  {t.nav.marketplace}
                </Link>
              </li>
              <li>
                <Link href="/social-impact" className="hover:text-cream transition-colors">
                  {t.nav.socialImpact}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-cream transition-colors">
                  {t.nav.about}
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Impact statement */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-hotpink">
              Ijtimoiy missiya
            </h4>
            <p className="text-xs text-cream/70 leading-relaxed">
              Uyda tikuvchilik qiluvchi xotin-qizlar, ishsiz tikuvchi ayollar va kichik ustaxonalarga to‘g‘ridan-to‘g‘ri buyurtma va daromad olish imkonini yaratish.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-xs text-cream/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-hotpink" />
              <span>Haqiqiy ma’lumotlar bazasi</span>
            </div>
          </div>

          {/* Account Portal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-hotpink">
              Kabinet
            </h4>
            <ul className="space-y-2 text-sm text-cream/75">
              <li>
                <Link href="/login" className="hover:text-cream transition-colors">
                  {t.common.login}
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cream transition-colors">
                  {t.common.register}
                </Link>
              </li>
              <li>
                <Link href="/dashboard/customer/ai-studio" className="hover:text-cream transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-hotpink" />
                  <span>{t.nav.aiStudio}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream/50 gap-4">
          <p>© {new Date().getFullYear()} CROOKED RIB. Barcha huquqlar himoyalangan.</p>
          <p className="flex items-center gap-1">
            <span>O‘zbekiston xotin-qizlarining iqtisodiy mustaqilligi yo‘lida</span>
            <Heart className="w-3.5 h-3.5 text-hotpink inline fill-hotpink" />
          </p>
        </div>
      </div>
    </footer>
  );
};
