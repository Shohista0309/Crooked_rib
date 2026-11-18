"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  ShoppingBag,
  Search,
  Filter,
  MapPin,
  Tag,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function MarketplacePage() {
  const { t } = useLanguage();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "ALL") params.append("category", category);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.products) setProducts(data.products);
        else setProducts([]);
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const categories = [
    { key: "ALL", label: "Barchasi" },
    { key: "FABRIC", label: "Matolar" },
    { key: "THREAD", label: "Iplar" },
    { key: "BUTTONS", label: "Tugmalar" },
    { key: "ZIPPERS", label: "Zamoklar" },
    { key: "ACCESSORIES", label: "Aksessuarlar" },
    { key: "TRIM", label: "Bezaklar" },
  ];

  return (
    <div className="py-12 bg-cream-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5 text-hotpink" />
            <span>Xomashyo va furnituralar bozori</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
            Mato va aksessuarlar katalogi
          </h1>
          <p className="text-sm text-charcoal/70 max-w-2xl font-sans">
            Tikuvchilik uchun kerak bo‘ladigan tabiiy ipak, adras, sifatli iplar va antiqa tugmalarni to‘g‘ridan-to‘g‘ri ishlab chiqaruvchi va do‘konlardan toping.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                category === c.key
                  ? "bg-burgundy text-cream shadow-md"
                  : "bg-white text-charcoal border border-charcoal/15 hover:border-burgundy"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Mato nomi, tarkibi yoki rangi bo‘yicha qidirish..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-charcoal/20 bg-cream-light/50 text-xs text-charcoal focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="md:col-span-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min narx..."
                className="w-full px-3 py-2.5 rounded-lg border border-charcoal/20 bg-cream-light/50 text-xs text-charcoal focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="md:col-span-2">
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Maks narx..."
                className="w-full px-3 py-2.5 rounded-lg border border-charcoal/20 bg-cream-light/50 text-xs text-charcoal focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-colors"
              >
                Qidirish
              </button>
            </div>
          </form>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-16 text-sm text-charcoal/60">
            Mahsulotlar yuklanmoqda...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-burgundy/10 p-8 space-y-3">
            <ShoppingBag className="w-8 h-8 text-charcoal/30 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-charcoal">
              Mos mahsulot topilmadi
            </h3>
            <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
              Qidiruv parametrlarini o‘zgartiring yoki barcha toifalar bo‘yicha ko‘ring.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-burgundy/10 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 bg-charcoal overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-charcoal/80 backdrop-blur-md text-cream text-[10px] font-mono uppercase">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-charcoal text-sm line-clamp-1 group-hover:text-burgundy transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-charcoal/60 line-clamp-1">
                      {product.material} • {product.color}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-charcoal/60">
                      <MapPin className="w-3 h-3 text-burgundy" />
                      <span>{product.region}, {product.city}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-charcoal/10 flex items-center justify-between mt-2">
                  <div className="pt-2">
                    <span className="text-[10px] text-charcoal/50 uppercase block font-mono">
                      Narxi:
                    </span>
                    <span className="text-sm font-bold text-burgundy font-mono">
                      {new Intl.NumberFormat("uz-UZ").format(product.price)} so‘m
                      <span className="text-[10px] text-charcoal/60 font-normal"> / {product.unit}</span>
                    </span>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/marketplace/${product.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-colors"
                    >
                      Batafsil
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
