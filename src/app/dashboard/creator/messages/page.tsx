"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ChatBox } from "@/components/ChatBox";
import { useLanguage } from "@/components/LanguageContext";

function CreatorMessagesContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const userIdParam = searchParams.get("userId") || undefined;
  const orderIdParam = searchParams.get("orderId") || undefined;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user?.id) setCurrentUserId(d.user.id);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold text-charcoal">
          {t.nav.messages}
        </h1>
        <p className="text-xs text-charcoal/60">
          Mijozlar bilan buyurtma tafsilotlari bo‘yicha to‘g‘ridan-to‘g‘ri muloqot
        </p>
      </div>

      {currentUserId && (
        <ChatBox
          currentUserId={currentUserId}
          initialOtherUserId={userIdParam}
          initialOrderId={orderIdParam}
        />
      )}
    </div>
  );
}

export default function CreatorMessagesPage() {
  return (
    <DashboardLayout allowedRole="CREATOR">
      <Suspense fallback={<div className="text-xs text-charcoal/50">Xabarlar yuklanmoqda...</div>}>
        <CreatorMessagesContent />
      </Suspense>
    </DashboardLayout>
  );
}
