"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { Logo } from "./Logo";
import { Language } from "@/lib/i18n";
import { SessionUser } from "@/lib/types";
import {
  Menu,
  X,
  Globe,
  Sparkles,
  ShoppingBag,
  Scissors,
  BarChart3,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react";

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    // Fetch session user on mount and route change
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  const getDashboardPath = (role?: string) => {
    switch (role) {
      case "CREATOR":
        return "/dashboard/creator";
      case "SELLER":
        return "/dashboard/seller";
      case "ADMIN":
        return "/dashboard/admin";
      default:
        return "/dashboard/customer";
    }
  };

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/how-it-works", label: t.nav.howItWorks },
    { href: "/tailors", label: t.nav.tailors },
    { href: "/marketplace", label: t.nav.marketplace },
    { href: "/social-impact", label: t.nav.socialImpact },
    { href: "/about", label: t.nav.about },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: "uz", label: "O'zbekcha" },
    { code: "ru", label: "Русский" },
    { code: "en", label: "English" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream-light/95 backdrop-blur-md border-b border-burgundy/10 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "text-burgundy font-semibold bg-burgundy/5"
                      : "text-charcoal hover:text-burgundy hover:bg-cream"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Language, Auth/Dashboard */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase border border-charcoal/20 rounded-full text-charcoal hover:border-burgundy hover:text-burgundy transition-colors"
                aria-label="Select language"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-charcoal/10 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {languages.map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLanguage(item.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-cream transition-colors ${
                        language === item.code ? "font-bold text-burgundy bg-cream/60" : "text-charcoal"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="uppercase text-[10px] text-charcoal/50">{item.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons or Dashboard */}
            {!loadingUser && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    <Link
                      href={getDashboardPath(user.role)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>{t.common.dashboard}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      title={t.common.logout}
                      className="p-2 text-charcoal/60 hover:text-burgundy hover:bg-cream rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-burgundy transition-colors"
                    >
                      {t.common.login}
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 rounded-md bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow-sm transition-all"
                    >
                      {t.common.register}
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Quick Lang Switch */}
            <button
              onClick={() => {
                const nextLang: Language = language === "uz" ? "ru" : language === "ru" ? "en" : "uz";
                setLanguage(nextLang);
              }}
              className="px-2.5 py-1 text-xs font-bold uppercase rounded border border-charcoal/20 text-charcoal"
            >
              {language.toUpperCase()}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-charcoal hover:text-burgundy focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-burgundy/10 bg-cream-light px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href ? "bg-burgundy text-cream font-bold" : "text-charcoal hover:bg-cream"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-burgundy/10 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href={getDashboardPath(user.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded bg-burgundy text-cream font-semibold text-sm"
                >
                  {t.common.dashboard} ({user.name})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2 text-center text-sm font-medium text-charcoal/70 hover:text-burgundy"
                >
                  {t.common.logout}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold rounded border border-charcoal/20 text-charcoal"
                >
                  {t.common.login}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold rounded bg-hotpink text-white"
                >
                  {t.common.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
