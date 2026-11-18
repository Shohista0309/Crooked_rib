"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Package,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

export default function EditProductPage() {
  const { t } = useLanguage();
  const params = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("FABRIC");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("metr");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/products/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.product) {
          const p = data.product;
          setName(p.name);
          setDescription(p.description);
          setCategory(p.category);
          setMaterial(p.material);
          setColor(p.color);
          setPrice(p.price.toString());
          setQuantity(p.quantity.toString());
          setUnit(p.unit);
          setImageUrl(p.imageUrl);
          setIsAvailable(p.isAvailable);
        }
      })
      .catch((err) => console.error("Error loading product:", err))
      .finally(() => setLoading(false));
  }, [params?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          material,
          color,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          unit,
          imageUrl,
          isAvailable,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Mahsulotni yangilashda xatolik");
        setSaving(false);
      } else {
        router.push("/dashboard/seller/products");
      }
    } catch (err) {
      setError("Tarmoq xatosi");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRole="SELLER">
        <div className="py-24 text-center text-xs text-charcoal/60">
          Mahsulot ma’lumotlari yuklanmoqda...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRole="SELLER">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard/seller/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 hover:text-burgundy uppercase tracking-wider transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mahsulotlarga qaytish</span>
          </Link>

          <h1 className="text-3xl font-serif font-bold text-charcoal">
            Mahsulotni tahrirlash
          </h1>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-white border border-burgundy/10 shadow-sm space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              Mahsulot nomi:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Kategoriya:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              >
                <option value="FABRIC">Mato (Fabric)</option>
                <option value="THREAD">Ip (Thread)</option>
                <option value="BUTTONS">Tugmalar (Buttons)</option>
                <option value="ZIPPERS">Zamok (Zippers)</option>
                <option value="ACCESSORIES">Aksessuarlar</option>
                <option value="TRIM">Bezak / Lenta (Trim)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Material tarkibi:
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Rangi:
              </label>
              <input
                type="text"
                required
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Narxi (so‘m):
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30 font-mono font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Mavjud miqdor:
              </label>
              <input
                type="number"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                O‘lchov birligi:
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              Rasm havolasi (URL):
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-charcoal">
              Batafsil tavsif:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              required
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isAvail"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 accent-burgundy rounded cursor-pointer"
            />
            <label htmlFor="isAvail" className="text-xs text-charcoal font-medium cursor-pointer">
              Mahsulot do‘konda mavjud va xarid qilish mumkin
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saqlanmoqda..." : "O‘zgarishlarni saqlash"}</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
