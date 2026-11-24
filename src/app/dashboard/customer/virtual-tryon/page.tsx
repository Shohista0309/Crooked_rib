"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { DecartAiTryOn } from "@/components/DecartAiTryOn";
import { Camera } from "lucide-react";

function TryOnContent() {
  const searchParams = useSearchParams();
  const designId = searchParams.get("designId");
  const title = searchParams.get("title");
  const category = searchParams.get("category");
  const initialDesign = designId
    ? {
        id: designId,
        title: title || "Tanlangan libos",
        category: category || "DRESS",
      }
    : null;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy text-xs font-semibold uppercase tracking-wider font-mono">
          <Camera className="w-3.5 h-3.5 text-hotpink" />
          <span>CROOKED RIB Virtual Try-On</span>
        </div>
        <h1 className="text-3xl font-serif font-bold text-charcoal">
          Virtual Kiyib Ko‘rish Xonasi
        </h1>
        <p className="text-xs text-charcoal/70 max-w-2xl leading-relaxed">
          Decart AI bilan real vaqtda virtual kiyib ko‘ring.
        </p>
      </div>
      <DecartAiTryOn initialDesign={initialDesign} />
    </div>
  );
}

export default function VirtualTryOnPage() {
  return (
    <DashboardLayout allowedRole="CUSTOMER">
      <Suspense
        fallback={
          <div className="py-20 text-center text-xs text-charcoal/50">
            Virtual studiya yuklanmoqda...
          </div>
        }
      >
        <TryOnContent />
      </Suspense>
    </DashboardLayout>
  );
}
