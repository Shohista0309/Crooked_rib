"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { SessionUser, Role } from "@/lib/types";
import {
  Sparkles,
  Scissors,
  ShoppingBag,
  Package,
  Layers,
  MessageSquare,
  Settings,
  LogOut,
  User,
  PlusCircle,
  FileText,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole?: Role;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  allowedRole,
}) => {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (!data?.user) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        } else {
          setUser(data.user);
          if (allowedRole && data.user.role !== allowedRole && data.user.role !== "ADMIN") {
            // Redirect to their own dashboard
            if (data.user.role === "CREATOR") router.push("/dashboard/creator");
            else if (data.user.role === "SELLER") router.push("/dashboard/seller");
            else router.push("/dashboard/customer");
          }
        }
      })
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [pathname, allowedRole, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 text-center text-xs text-charcoal/60 bg-cream-light">
        Kabinetingiz yuklanmoqda...
      </div>
    );
  }

  if (!user) return null;

  // Determine nav items based on role
  let navItems: { href: string; label: string; icon: any }[] = [];

  if (user.role === "CUSTOMER") {
    navItems = [
      { href: "/dashboard/customer", label: "Umumiy ko‘rinish", icon: Layers },
      { href: "/dashboard/customer/ai-studio", label: "AI Kiyim Studio", icon: Sparkles },
      { href: "/dashboard/customer/designs", label: "Saqlangan dizaynlar", icon: FileText },
      { href: "/dashboard/customer/orders", label: "Buyurtmalarim", icon: Scissors },
      { href: "/dashboard/customer/messages", label: "Xabarlar", icon: MessageSquare },
      { href: "/dashboard/customer/settings", label: "Sozlamalar", icon: Settings },
    ];
  } else if (user.role === "CREATOR") {
    navItems = [
      { href: "/dashboard/creator", label: "Umumiy ko‘rinish", icon: Layers },
      { href: "/dashboard/creator/orders", label: "Kelgan buyurtmalar", icon: Scissors },
      { href: "/dashboard/creator/portfolio", label: "Portfolio boshqaruvi", icon: Sparkles },
      { href: "/dashboard/creator/profile", label: "Ustaxona profili", icon: User },
      { href: "/dashboard/creator/messages", label: "Xabarlar", icon: MessageSquare },
      { href: "/dashboard/creator/settings", label: "Sozlamalar", icon: Settings },
    ];
  } else if (user.role === "SELLER") {
    navItems = [
      { href: "/dashboard/seller", label: "Umumiy ko‘rinish", icon: Layers },
      { href: "/dashboard/seller/products", label: "Mahsulotlar katalogi", icon: Package },
      { href: "/dashboard/seller/products/new", label: "Yangi mahsulot qo‘shish", icon: PlusCircle },
      { href: "/dashboard/seller/inquiries", label: "Xaridor so‘rovlari", icon: MessageSquare },
      { href: "/dashboard/seller/shop", label: "Do‘kon profili", icon: ShoppingBag },
      { href: "/dashboard/seller/settings", label: "Sozlamalar", icon: Settings },
    ];
  } else if (user.role === "ADMIN") {
    navItems = [
      { href: "/dashboard/admin", label: "Platforma tahlili", icon: BarChart3 },
      { href: "/dashboard/admin/users", label: "Foydalanuvchilar", icon: User },
      { href: "/dashboard/admin/orders", label: "Barcha buyurtmalar", icon: Scissors },
    ];
  }

  return (
    <div className="min-h-screen bg-cream-light flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-burgundy/10 flex flex-col justify-between p-4 sm:p-6 flex-shrink-0">
        <div className="space-y-6">
          {/* User profile card */}
          <div className="p-3.5 rounded-2xl bg-cream-light border border-burgundy/10 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-burgundy text-cream font-bold text-xs flex items-center justify-center font-serif">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-charcoal truncate">{user.name}</p>
                <p className="text-[10px] text-hotpink font-mono uppercase font-semibold">
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-burgundy text-cream font-semibold shadow-sm"
                      : "text-charcoal/75 hover:bg-cream hover:text-burgundy"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-hotpink" : "text-charcoal/60"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="pt-6 border-t border-charcoal/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3.5 py-2 text-xs text-charcoal/70 hover:text-burgundy transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 text-hotpink" />
            <span>Asosiy saytga o‘tish</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-charcoal/60 hover:text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.common.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
