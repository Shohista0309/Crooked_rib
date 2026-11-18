"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Eye,
} from "lucide-react";

export default function SellerProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    fetch("/api/users/profile")
      .then((r) => r.json())
      .then((profileData) => {
        if (profileData?.user?.id) {
          return fetch(`/api/products?sellerId=${profileData.user.id}`)
            .then((r) => r.json())
            .then((data) => {
              if (data?.products) setProducts(data.products);
            });
        }
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Haqiqatan ham ushbu mahsulotni o‘chirmoqchimisiz?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <DashboardLayout allowedRole="SELLER">
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal">
              Mahsulotlar katalogi
            </h1>
            <p className="text-xs text-charcoal/60">
              Sotuvga qo‘yilgan matolar, iplar va furnituralar ro‘yxati
            </p>
          </div>

          <Link
            href="/dashboard/seller/products/new"
            className="px-5 py-2.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow transition-all inline-flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi mahsulot</span>
          </Link>
        </div>

        {loading ? (
          <p className="text-xs text-charcoal/50">Mahsulotlar yuklanmoqda...</p>
        ) : products.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-burgundy/10 space-y-4">
            <Package className="w-10 h-10 text-charcoal/30 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-charcoal">
              Hozircha mahsulot qo‘shilmagan
            </h3>
            <p className="text-xs text-charcoal/60 max-w-md mx-auto">
              Mato yoki aksessuarlaringizni katalogga joylashtiring va xaridorlarga taklif qiling.
            </p>
            <Link
              href="/dashboard/seller/products/new"
              className="inline-block px-5 py-2.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase"
            >
              Mahsulot qo‘shish
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-burgundy/10 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-light/60 border-b border-charcoal/10 font-mono uppercase text-charcoal/60 text-[10px]">
                  <tr>
                    <th className="p-4">Rasm & Nomi</th>
                    <th className="p-4">Kategoriya</th>
                    <th className="p-4">Material & Rang</th>
                    <th className="p-4">Narxi</th>
                    <th className="p-4">Zaxira</th>
                    <th className="p-4">Holat</th>
                    <th className="p-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-cream-light/20 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-charcoal"
                        />
                        <div>
                          <p className="font-bold text-charcoal line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-charcoal/50">{p.city}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-burgundy/10 text-burgundy font-mono text-[10px]">
                          {p.category}
                        </span>
                      </td>

                      <td className="p-4 text-charcoal/70">
                        {p.material} ({p.color})
                      </td>

                      <td className="p-4 font-mono font-bold text-burgundy">
                        {new Intl.NumberFormat("uz-UZ").format(p.price)} so‘m
                        <span className="text-[10px] font-normal text-charcoal/50"> / {p.unit}</span>
                      </td>

                      <td className="p-4 font-mono font-semibold">
                        {p.quantity} {p.unit}
                      </td>

                      <td className="p-4">
                        {p.isAvailable ? (
                          <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                            Mavjud
                          </span>
                        ) : (
                          <span className="text-red-700 font-semibold text-[10px] bg-red-50 px-2 py-0.5 rounded">
                            Tugagan
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/marketplace/${p.id}`}
                            className="p-1.5 text-charcoal/50 hover:text-burgundy transition-colors"
                            title="Ko‘rish"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/seller/products/${p.id}/edit`}
                            className="p-1.5 text-charcoal/50 hover:text-burgundy transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 text-charcoal/50 hover:text-red-600 transition-colors"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
