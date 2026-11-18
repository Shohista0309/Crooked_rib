"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Package,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

export default function NewProductPage() {
  const { t } = useLanguage();
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("FABRIC");
  const [material, setMaterial] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("50");
  const [unit, setUnit] = useState("metr");
  const [region, setRegion] = useState("Farg'ona viloyati");
  const [city, setCity] = useState("Marg'ilon");
  const [imageUrl, setImageUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/users/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.sellerProfile) {
          setRegion(data.user.sellerProfile.region || "Toshkent shahri");
          setCity(data.user.sellerProfile.city || "Toshkent");
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !imageUrl) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          material,
          color,
          price: parseFloat(price),
          currency: "UZS",
          quantity: parseInt(quantity),
          unit,
          region,
          city,
          imageUrl,
          isAvailable: true,
          isPublished: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Mahsulot qo‘shishda xatolik");
        setSaving(false);
      } else {
        router.push("/dashboard/seller/products");
      }
    } catch (err) {
      setError("Tarmoq xatosi, qayta urinib ko‘ring");
      setSaving(false);
    }
  };

  return (
    <DashboardLayout allowedRole="SELLER">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard/seller/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/60 hover:text-burgundy uppercase tracking-wider transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Mahsulotlar ro‘yxatiga qaytish</span>
          </Link>

          <h1 className="text-3xl font-serif font-bold text-charcoal">
            Yangi mahsulot qo‘shish
          </h1>
          <p className="text-xs text-charcoal/60">
            Mato, ip yoki furnituralaringizni platformaga joylang
          </p>
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
              placeholder="Masalan: Marg‘ilon tabiiy ipak xon-atlasi"
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
                placeholder="100% Ipak, Paxta, Baxmal..."
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
                placeholder="Qizil-sariq, To‘q qizil..."
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
                placeholder="120000"
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
                placeholder="metr, dona, o‘ram..."
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
              placeholder="https://images.unsplash.com/..."
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
              placeholder="Mato eni, zichligi, qanday liboslar uchun mosligi..."
              className="w-full p-3 rounded-xl border border-charcoal/20 text-xs text-charcoal focus:outline-none focus:border-burgundy bg-cream-light/30"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase tracking-wider hover:bg-burgundy-light shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saqlanmoqda..." : "Mahsulotni e’lon qilish"}</span>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
