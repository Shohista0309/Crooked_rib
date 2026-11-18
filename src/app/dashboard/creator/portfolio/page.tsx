"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useLanguage } from "@/components/LanguageContext";
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";

export default function CreatorPortfolioPage() {
  const { t } = useLanguage();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kechki libos");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchPortfolio = () => {
    fetch("/api/creators/portfolio")
      .then((r) => r.json())
      .then((data) => {
        if (data?.portfolios) setPortfolios(data.portfolios);
      })
      .catch((err) => console.error("Error loading portfolio:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/creators/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          imageUrl,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Portfolio qo‘shishda xatolik yuz berdi");
      } else {
        setTitle("");
        setImageUrl("");
        setDescription("");
        setShowAddForm(false);
        fetchPortfolio();
      }
    } catch (err) {
      setError("Tarmoq xatosi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Haqiqatan ham ushbu ish namunasini o‘chirmoqchimisiz?")) return;
    try {
      await fetch(`/api/creators/portfolio/${id}`, { method: "DELETE" });
      fetchPortfolio();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <DashboardLayout allowedRole="CREATOR">
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-charcoal">
              Portfolio boshqaruvi
            </h1>
            <p className="text-xs text-charcoal/60">
              Tikkan ishlaringiz fotosuratlari va tavsiflarini boshqaring
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-2.5 rounded-xl bg-hotpink text-white text-xs font-semibold uppercase tracking-wider hover:bg-hotpink-hover shadow transition-all inline-flex items-center gap-2 self-start"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? "Bekor qilish" : "Yangi ish namunasi qo‘shish"}</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add item form modal/card */}
        {showAddForm && (
          <form
            onSubmit={handleCreate}
            className="p-8 rounded-3xl bg-white border border-burgundy/15 shadow-xl space-y-4 animate-in fade-in duration-200"
          >
            <h3 className="font-serif font-bold text-lg text-charcoal">
              Yangi ish namunasini kiritish
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal">
                  Libos nomi:
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Shohona adras kechki libos"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/30 focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal">
                  Kategoriya / Fason:
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Masalan: Kechki libos, Milliy sarpo, Ofis kostyumi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/30 focus:outline-none focus:border-burgundy"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/30 focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal">
                Qisqacha tavsif va ishlatilgan matolar:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Marg‘ilon ipak atlasi, tilla ipli zardo‘zlik, maxsus bichim..."
                className="w-full p-3 rounded-xl border border-charcoal/20 text-xs text-charcoal bg-cream-light/30 focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-all disabled:opacity-50"
              >
                {saving ? "Saqlanmoqda..." : "Portfolioga saqlash"}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-semibold uppercase text-charcoal hover:bg-cream-light"
              >
                Bekor qilish
              </button>
            </div>
          </form>
        )}

        {/* Portfolio Grid */}
        {loading ? (
          <p className="text-xs text-charcoal/50">Portfolio yuklanmoqda...</p>
        ) : portfolios.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-burgundy/10 space-y-4">
            <ImageIcon className="w-10 h-10 text-charcoal/30 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-charcoal">
              Hozircha portfolio bo‘sh
            </h3>
            <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
              Avval tikkan eng chiroyli kiyimlaringiz rasmlarini joylang. Bu yangi mijozlar ishonchini oshiradi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-burgundy/10 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-60 bg-charcoal overflow-hidden relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-charcoal/70 text-white hover:bg-red-600 transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {item.category && (
                      <span className="absolute top-3 left-3 bg-charcoal/80 text-cream px-2.5 py-1 rounded-full text-[10px] font-mono uppercase">
                        {item.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif font-bold text-charcoal text-base">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-charcoal/70 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
