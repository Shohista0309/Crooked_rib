"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import { User, ShieldCheck, ArrowLeft, Search } from "lucide-react";

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((data) => {
        if (data?.users) setUsers(data.users);
      })
      .catch((err) => console.error("Error loading users:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout allowedRole="ADMIN">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <Link
            href="/dashboard/admin"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 hover:text-burgundy uppercase tracking-wider transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Admin paneliga qaytish</span>
          </Link>

          <h1 className="text-3xl font-serif font-bold text-charcoal">
            Foydalanuvchilar boshqaruvi
          </h1>
          <p className="text-xs text-charcoal/60">
            Platformada ro‘yxatdan o‘tgan barcha mijozlar, tikuvchilar va sotuvchilar ro‘yxati
          </p>
        </div>

        {/* Search */}
        <div className="p-4 rounded-2xl bg-white border border-burgundy/10 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ism, email yoki rol bo‘yicha qidirish..."
            className="w-full px-4 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
          />
        </div>

        {loading ? (
          <p className="text-xs text-charcoal/50">Foydalanuvchilar yuklanmoqda...</p>
        ) : (
          <div className="bg-white rounded-3xl border border-burgundy/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-light/60 border-b border-charcoal/10 font-mono uppercase text-charcoal/60 text-[10px]">
                  <tr>
                    <th className="p-4">Foydalanuvchi</th>
                    <th className="p-4">Rol</th>
                    <th className="p-4">Telefon</th>
                    <th className="p-4">Tafsilot</th>
                    <th className="p-4">Ro‘yxatdan o‘tgan sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-cream-light/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-charcoal">{u.name}</p>
                        <p className="text-[11px] text-charcoal/60">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                            u.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800"
                              : u.role === "CREATOR"
                              ? "bg-burgundy/10 text-burgundy"
                              : u.role === "SELLER"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-charcoal/70 font-mono">
                        {u.phone || "—"}
                      </td>
                      <td className="p-4 text-charcoal/70">
                        {u.creatorProfile
                          ? `${u.creatorProfile.workshopName} (${u.creatorProfile.city})`
                          : u.sellerProfile
                          ? `${u.sellerProfile.shopName} (${u.sellerProfile.city})`
                          : "Mijoz"}
                      </td>
                      <td className="p-4 text-charcoal/60 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString("uz-UZ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
