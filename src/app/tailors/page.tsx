"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageContext";
import {
  Scissors,
  Search,
  MapPin,
  Filter,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
} from "lucide-react";

export default function TailorsDirectoryPage() {
  const { t } = useLanguage();

  const [tailors, setTailors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchTailors = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (region && region !== "all") params.append("region", region);
    if (maxPrice) params.append("maxPrice", maxPrice);

    fetch(`/api/tailors?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.tailors) setTailors(data.tailors);
        else setTailors([]);
      })
      .catch((err) => console.error("Error fetching tailors:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTailors();
  }, [region]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTailors();
  };

  const regionsList = [
    { value: "all", label: "Barcha viloyatlar" },
    { value: "Toshkent", label: "Toshkent shahri va viloyati" },
    { value: "Samarqand", label: "Samarqand viloyati" },
    { value: "Farg'ona", label: "Farg'ona viloyati" },
    { value: "Buxoro", label: "Buxoro viloyati" },
    { value: "Andijon", label: "Andijon viloyati" },
    { value: "Namangan", label: "Namangan viloyati" },
    { value: "Xorazm", label: "Xorazm viloyati" },
    { value: "Qashqadaryo", label: "Qashqadaryo viloyati" },
  ];

  return (
    <div className="py-12 bg-cream-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider">
            <Scissors className="w-3.5 h-3.5 text-hotpink" />
            <span>Hunarmandlar katalogi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-charcoal">
            Mohir tikuvchilar va modelyerlar
          </h1>
          <p className="text-sm text-charcoal/70 max-w-2xl font-sans">
            O‘z hududingizdagi uyda tikuvchi ayollar, mahoratli ustalar va atelyelarni toping, ularning portfoliosini ko‘ring va to‘g‘ridan-to‘g‘ri kiyim tikishga buyurtma bering.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white border border-burgundy/10 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tikuvchi ismi, soha yoki kalit so‘z..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-charcoal/20 bg-cream-light/50 text-xs text-charcoal focus:outline-none focus:border-burgundy"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-charcoal/20 bg-cream-light/50 text-xs text-charcoal focus:outline-none focus:border-burgundy"
              >
                {regionsList.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex gap-2">
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Maksimal narx..."
                className="w-full px-3 py-2.5 rounded-lg border border-charcoal/20 bg-cream-light/50 text-xs text-charcoal focus:outline-none focus:border-burgundy"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-colors flex-shrink-0"
              >
                Qidirish
              </button>
            </div>
          </form>
        </div>

        {/* Tailors Grid */}
        {loading ? (
          <div className="text-center py-16 text-sm text-charcoal/60">
            Tikuvchilar ro‘yxati yuklanmoqda...
          </div>
        ) : tailors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-burgundy/10 p-8 space-y-3">
            <Scissors className="w-8 h-8 text-charcoal/30 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-charcoal">
              Mos tikuvchi topilmadi
            </h3>
            <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
              Qidiruv so‘zini o‘zgartirib ko‘ring yoki barcha viloyatlar bo‘yicha qidiring.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tailors.map((tailor) => (
              <div
                key={tailor.id}
                className="rounded-2xl border border-burgundy/10 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Portfolio Preview Cover */}
                  <div className="relative h-52 bg-charcoal overflow-hidden">
                    <img
                      src={
                        tailor.portfolios?.[0]?.imageUrl ||
                        "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={tailor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-burgundy font-mono">
                      {tailor.experienceYears} yillik tajriba
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <p className="text-xs font-semibold text-hotpink uppercase tracking-wider">
                        {tailor.workshopName}
                      </p>
                      <h3 className="font-serif text-lg font-bold text-white leading-tight">
                        {tailor.name}
                      </h3>
                    </div>
                  </div>

                  {/* Details Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-charcoal/70">
                      <MapPin className="w-3.5 h-3.5 text-burgundy flex-shrink-0" />
                      <span>{tailor.region}, {tailor.city}</span>
                    </div>

                    <p className="text-xs text-charcoal/80 line-clamp-3 leading-relaxed">
                      {tailor.bio || tailor.specialties}
                    </p>

                    <div className="pt-1">
                      <span className="text-[10px] text-charcoal/50 uppercase font-mono block mb-1">
                        Ixtisoslik:
                      </span>
                      <p className="text-xs font-medium text-burgundy line-clamp-1">
                        {tailor.specialties}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="p-5 pt-0 border-t border-charcoal/10 flex items-center justify-between gap-2 mt-2">
                  <div className="pt-3">
                    <span className="text-[10px] text-charcoal/50 uppercase font-mono block">
                      Boshlang‘ich narx:
                    </span>
                    <span className="text-sm font-bold text-burgundy font-mono">
                      {new Intl.NumberFormat("uz-UZ").format(tailor.startingPrice)} so‘m
                    </span>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <Link
                      href={`/tailors/${tailor.id}`}
                      className="px-4 py-2 rounded-lg bg-burgundy text-cream text-xs font-semibold uppercase hover:bg-burgundy-light shadow transition-colors inline-flex items-center gap-1"
                    >
                      <span>Profil</span>
                      <ArrowRight className="w-3.5 h-3.5" />
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
