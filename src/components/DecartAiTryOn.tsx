"use client";

import {
  createDecartClient,
  models,
  type ConnectionState,
  type RealTimeClient,
} from "@decartai/sdk";
import { AlertCircle, Camera, CameraOff, ImagePlus, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CatalogGender, CatalogGarment, GARMENT_CATALOG } from "@/lib/tryOn/garmentCatalog";

interface SavedDesign {
  id: string;
  title: string;
  category: string;
  conceptDescription: string;
  sketchUrl: string | null;
}

interface InitialDesign {
  id?: string;
  title: string;
  category: string;
  sketchUrl?: string;
  conceptDescription?: string;
}

interface DecartAiTryOnProps {
  initialDesign?: InitialDesign | null;
  isModal?: boolean;
  onClose?: () => void;
}

type SelectionSource = "catalog" | "saved" | "upload";

interface GarmentSelection {
  id: string;
  title: string;
  source: SelectionSource;
  image: File | string | null;
  prompt: string;
  catalogGarment?: CatalogGarment;
}

const SESSION_DURATIONS = [60, 120, 180, 300] as const;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MODEL = models.realtime("lucy-vton-3.6");

function makeSelection(item: CatalogGarment): GarmentSelection {
  return {
    id: item.id,
    title: item.title,
    source: "catalog",
    image: item.imageUrl,
    prompt: item.prompt,
    catalogGarment: item,
  };
}

export function normalizeDecartImage(
  image: File | string | null,
  origin: string
): File | string | null {
  if (typeof image !== "string" || image.startsWith("data:")) return image;
  try {
    const url = new URL(image, origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported image URL protocol.");
    }
    return url.toString();
  } catch {
    throw new Error("Kiyim reference rasmi uchun URL yaroqsiz.");
  }
}

function describeError(error: unknown): string {
  const value = error instanceof Error ? error as Error & { code?: string } : null;
  if (!value) return "AI kiyib ko‘rish sessiyasi boshlanmadi.";
  if (value.code === "INVALID_API_KEY") {
    return "Decart API kaliti yaroqsiz. Server sozlamalarini tekshiring.";
  }
  if (value.code === "WEBRTC_ICE_ERROR" || value.code === "WEBRTC_TIMEOUT_ERROR") {
    return "Decart video aloqasini o‘rnatib bo‘lmadi. Tarmoq yoki xavfsizlik devori sozlamalarini tekshiring.";
  }
  const message = value.message?.toLowerCase() || "";
  const isQuotaError =
    ["insufficient_credits", "insufficient_quota", "quota_exhausted", "quota_exceeded", "resource_exhausted"].includes(value.code || "") ||
    message.includes("insufficient credit") ||
    message.includes("quota exhausted") ||
    message.includes("quota exceeded");
  if (isQuotaError) return "Ajratilgan AI kreditlari tugagan";
  if (value.message?.toLowerCase().includes("camera") || value.name === "NotAllowedError") {
    return "Kameraga ruxsat berilmadi. Brauzer sozlamalarida kameraga ruxsat bering.";
  }
  if (value.message?.toLowerCase().includes("failed to fetch image")) {
    return "Tanlangan kiyim rasmini yuklab bo‘lmadi. Boshqa rasm tanlang.";
  }
  return value.message || "AI kiyib ko‘rish sessiyasi boshlanmadi.";
}

function sessionEndMessage(reason: string): string {
  if (["insufficient_credits", "insufficient_quota", "quota_exhausted", "quota_exceeded", "resource_exhausted"].includes(reason)) {
    return "Ajratilgan AI kreditlari tugagan";
  }
  if (reason === "session_limit") return "Decart hisobidagi bir vaqtdagi sessiya limiti tugagan.";
  if (reason === "policy_violation" || reason === "moderation_violation") {
    return "Decart sessiyani xizmat siyosati sababli to‘xtatdi.";
  }
  return `Decart sessiyasi yakunlandi (${reason}).`;
}

export function DecartAiTryOn({
  initialDesign,
  isModal = false,
  onClose,
}: DecartAiTryOnProps) {
  const outputVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const clientRef = useRef<RealTimeClient | null>(null);
  const startAttemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const outputTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const uploadPreviewUrlRef = useRef<string | null>(null);
  const selectionRef = useRef<GarmentSelection | null>(null);
  const [activeGender, setActiveGender] = useState<CatalogGender>("women");
  const [activeTab, setActiveTab] = useState<SelectionSource>("catalog");
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [designsLoading, setDesignsLoading] = useState(false);
  const [designsError, setDesignsError] = useState<string | null>(null);
  const [selection, setSelection] = useState<GarmentSelection | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [durationSeconds, setDurationSeconds] =
    useState<(typeof SESSION_DURATIONS)[number]>(60);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [isStarting, setIsStarting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasOutput, setHasOutput] = useState(false);
  const [serviceAvailable, setServiceAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignSelection = useCallback((next: GarmentSelection) => {
    selectionRef.current = next;
    setSelection(next);
    setError(null);
    const client = clientRef.current;
    if (client) {
      client
        .set({ image: normalizeDecartImage(next.image, window.location.origin), prompt: next.prompt })
        .catch((cause: unknown) => setError(describeError(cause)));
    }
  }, []);

  const selectSavedDesign = useCallback((design: SavedDesign) => {
    const prompt = [
      `The person is trying on the clothing design "${design.title}" (${design.category}).`,
      design.conceptDescription,
    ]
      .filter(Boolean)
      .join(" ");
    assignSelection({
      id: design.id,
      title: design.title,
      source: "saved",
      image: design.sketchUrl || null,
      prompt,
    });
  }, [assignSelection]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/decart/realtime-token")
      .then(async (response) => {
        const data: { configured?: boolean; error?: string } = await response.json();
        if (!response.ok) throw new Error(data.error || "Decart sozlamasini tekshirib bo‘lmadi.");
        if (typeof data.configured !== "boolean") {
          throw new Error("Decart sozlamasi javobi noto‘g‘ri formatda.");
        }
        return data.configured;
      })
      .then((configured) => {
        if (!cancelled) setServiceAvailable(configured);
      })
      .catch(() => {
        if (!cancelled) setServiceAvailable(false);
      });

    setDesignsLoading(true);
    fetch("/api/designs")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Saqlangan dizaynlarni yuklab bo‘lmadi.");
        }
        if (!Array.isArray(data.designs)) {
          throw new Error("Saqlangan dizaynlar javobi noto‘g‘ri formatda.");
        }
        return data.designs as SavedDesign[];
      })
      .then((designs) => {
        if (!cancelled) {
          setSavedDesigns(designs);
          if (initialDesign?.id) {
            const design = designs.find((item) => item.id === initialDesign.id) ?? {
              id: initialDesign.id,
              title: initialDesign.title,
              category: initialDesign.category,
              conceptDescription: initialDesign.conceptDescription ?? "",
              sketchUrl: initialDesign.sketchUrl ?? null,
            };
            selectSavedDesign(design);
          }
        }
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setDesignsError(
            cause instanceof Error ? cause.message : "Saqlangan dizaynlarni yuklab bo‘lmadi."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setDesignsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialDesign?.id, selectSavedDesign]);

  const stopSession = useCallback((reason?: string) => {
    startAttemptRef.current += 1;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (outputTimeoutRef.current) {
      clearTimeout(outputTimeoutRef.current);
      outputTimeoutRef.current = null;
    }
    clientRef.current?.disconnect();
    clientRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const output = outputVideoRef.current;
    if (output) {
      output.pause();
      const remoteStream = output.srcObject;
      if (remoteStream instanceof MediaStream) {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
      output.srcObject = null;
      output.onloadeddata = null;
    }
    setIsStarting(false);
    setIsRunning(false);
    setHasOutput(false);
    setSecondsLeft(0);
    setConnectionState("disconnected");
    if (reason) setError(reason);
  }, []);

  useEffect(
    () => () => {
      startAttemptRef.current += 1;
      if (timerRef.current) clearInterval(timerRef.current);
      if (outputTimeoutRef.current) clearTimeout(outputTimeoutRef.current);
      clientRef.current?.disconnect();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      const output = outputVideoRef.current;
      output?.pause();
      if (output?.srcObject instanceof MediaStream) {
        output.srcObject.getTracks().forEach((track) => track.stop());
      }
      if (output) output.srcObject = null;
      if (uploadPreviewUrlRef.current) URL.revokeObjectURL(uploadPreviewUrlRef.current);
    },
    []
  );

  function selectCatalogGarment(garment: CatalogGarment) {
    assignSelection(makeSelection(garment));
  }

  function handleUpload(file: File | undefined) {
    setUploadError(null);
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("JPG, PNG yoki WEBP formatidagi rasm tanlang.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError("Rasm hajmi 10 MB dan oshmasligi kerak.");
      return;
    }
    if (uploadPreviewUrlRef.current) URL.revokeObjectURL(uploadPreviewUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    uploadPreviewUrlRef.current = previewUrl;
    setUploadPreviewUrl(previewUrl);
    assignSelection({
      id: `upload-${file.name}`,
      title: file.name,
      source: "upload",
      image: file,
      prompt: "The person is trying on the clothing shown in the reference image.",
    });
    setActiveTab("upload");
  }

  async function startSession() {
    if (!consentAccepted || !selection) return;
    if (!serviceAvailable) {
      setError("AI Virtual Try-On uchun ajratilgan kreditlar tugagan.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Ushbu brauzer kameradan foydalanishni qo‘llab-quvvatlamaydi.");
      return;
    }

    const attempt = ++startAttemptRef.current;
    setError(null);
    setIsStarting(true);
    setConnectionState("connecting");
    let clientToken: string | null = null;
    let tokenExpiresAt = 0;

    const fetchClientToken = async () => {
      const response = await fetch("/api/decart/realtime-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: true, durationSeconds }),
      });
      const data: { apiKey?: string; expiresAt?: string; error?: string } = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Decart sessiyasi uchun ruxsat olinmadi.");
      }
      if (typeof data.apiKey !== "string" || typeof data.expiresAt !== "string") {
        throw new Error("Decart serveri qisqa muddatli ruxsat bermadi.");
      }
      clientToken = data.apiKey;
      tokenExpiresAt = Date.parse(data.expiresAt);
      return clientToken;
    };

    try {
      const chosen = selectionRef.current;
      if (!chosen) throw new Error("Avval kiyim rasmi yoki saqlangan dizaynni tanlang.");

      await fetchClientToken();
      if (attempt !== startAttemptRef.current) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          frameRate: MODEL.fps,
          width: MODEL.width,
          height: MODEL.height,
        },
      });
      if (attempt !== startAttemptRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;

      const client = createDecartClient({
        telemetry: false,
        apiKeyProvider: async () => {
          if (!clientToken || tokenExpiresAt - Date.now() < 15_000) {
            return fetchClientToken();
          }
          return clientToken;
        },
      });

      const initialSelection = selectionRef.current;
      if (!initialSelection) throw new Error("Avval kiyim rasmini tanlang.");
      setHasOutput(false);
      if (outputTimeoutRef.current) clearTimeout(outputTimeoutRef.current);
      outputTimeoutRef.current = setTimeout(() => {
        if (attempt === startAttemptRef.current) {
          stopSession("Decart video oqimi 20 soniya ichida kelmadi. Aloqani tekshirib qayta urinib ko‘ring.");
        }
      }, 20_000);

      const remoteClient = await client.realtime.connect(stream, {
        model: MODEL,
        mirror: "auto",
        retries: 0,
        initialState: {
          prompt: { text: initialSelection.prompt, enhance: true },
          ...(initialSelection.image
            ? {
                image: normalizeDecartImage(initialSelection.image, window.location.origin) ?? undefined,
              }
            : {}),
        },
        onConnectionChange: (state) => {
          if (attempt === startAttemptRef.current) setConnectionState(state);
        },
        onRemoteStream: (remoteStream) => {
          if (attempt !== startAttemptRef.current) {
            remoteStream.getTracks().forEach((track) => track.stop());
            return;
          }
          const output = outputVideoRef.current;
          if (!output) {
            remoteStream.getTracks().forEach((track) => track.stop());
            return;
          }
          output.srcObject = remoteStream;
          output.onloadeddata = () => {
            if (attempt !== startAttemptRef.current) return;
            if (outputTimeoutRef.current) {
              clearTimeout(outputTimeoutRef.current);
              outputTimeoutRef.current = null;
            }
            setHasOutput(true);
          };
          output.play().catch(() => {
            if (attempt === startAttemptRef.current) {
              stopSession("AI video oqimini brauzerda ijro qilib bo‘lmadi.");
            }
          });
        },
      });

      if (attempt !== startAttemptRef.current) {
        remoteClient.disconnect();
        return;
      }
      clientRef.current = remoteClient;
      remoteClient.on("sessionEnded", ({ reason }) => {
        stopSession(sessionEndMessage(reason));
      });
      remoteClient.on("error", (cause) => {
        if (attempt === startAttemptRef.current) setError(describeError(cause));
      });
      setIsStarting(false);
      setIsRunning(true);
      setSecondsLeft(durationSeconds);

      const endsAt = Date.now() + durationSeconds * 1000;
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
        setSecondsLeft(remaining);
        if (remaining === 0) {
          stopSession("Belgilangan sessiya muddati tugadi.");
        }
      }, 500);
    } catch (cause) {
      if (attempt === startAttemptRef.current) {
        stopSession(describeError(cause));
      }
    } finally {
      if (attempt === startAttemptRef.current) setIsStarting(false);
    }
  }

  const visibleGarments = GARMENT_CATALOG.filter((garment) => garment.gender === activeGender);
  const selectedImageUrl =
    typeof selection?.image === "string"
      ? selection.image
      : selection?.image instanceof File
        ? uploadPreviewUrl
        : null;

  return (
    <div className={`${isModal ? "max-h-[92vh] overflow-y-auto " : ""}bg-white rounded-3xl border border-burgundy/15 overflow-hidden`}>
      <div className="flex items-center justify-between border-b border-burgundy/10 bg-charcoal px-5 py-3 text-cream">
        <div>
          <h2 className="font-serif text-base font-bold">Decart Lucy AI Virtual Try-On</h2>
          <p className="text-[10px] text-cream/65">Haqiqiy vaqt rejimidagi tashqi AI video xizmati</p>
        </div>
        {isModal && onClose && (
          <button
            type="button"
            aria-label="Yopish"
            onClick={() => {
              stopSession();
              onClose();
            }}
            className="rounded-lg p-2 text-cream/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <section className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-charcoal">
            <video
              ref={outputVideoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-contain ${hasOutput ? "opacity-100" : "opacity-0"}`}
            />
            {!hasOutput && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-cream">
                <Camera className="h-8 w-8 text-hotpink" />
                <p className="max-w-sm text-sm">
                  Decart’ning haqiqiy AI video oqimi sessiya tasdiqlangach shu yerda ko‘rsatiladi.
                </p>
              </div>
            )}
            {isRunning && (
              <div className="absolute left-3 top-3 rounded-full bg-charcoal/85 px-3 py-1 text-xs text-white">
                {connectionState === "generating" ? "AI kiyimni moslashtirmoqda" : connectionState}
                {" · "}
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
              </div>
            )}
          </div>
          <p className="text-xs text-charcoal/60">
            AI natija Decart’dan jonli uzatiladi; bu sahifada kiyim tasviri ustiga chizilmaydi.
          </p>
        </section>

        <section className="space-y-4">
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-cream-light p-1">
            {([
              ["catalog", "Atelier"],
              ["saved", "Dizaynlarim"],
              ["upload", "Rasm yuklash"],
            ] as const).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-2 py-2 text-[11px] font-semibold ${
                  activeTab === tab ? "bg-white text-burgundy shadow-sm" : "text-charcoal/60"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wide text-charcoal/65">
              Kiyim katalogini tanlang
            </p>
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-cream-light p-1">
              {([
                ["men", "Erkaklar kiyimlari"],
                ["women", "Ayollar kiyimlari"],
              ] as const).map(([gender, label]) => (
                <button
                  key={gender}
                  type="button"
                  aria-pressed={activeGender === gender}
                  disabled={isStarting || isRunning}
                  onClick={() => {
                    setActiveGender(gender);
                    setSelection(null);
                    selectionRef.current = null;
                    setActiveTab("catalog");
                  }}
                  className={`rounded-lg px-2 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    activeGender === gender
                      ? "bg-white text-burgundy shadow-sm"
                      : "text-charcoal/60 hover:text-charcoal"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "catalog" && (
            <div className="space-y-3">
              <p className="text-[10px] leading-relaxed text-charcoal/55">
                Wikimedia Commons’dan olingan, litsenziyasi tekshirilgan haqiqiy moda suratlari.
                Surat — AI reference; natija aynan bir xil bo‘lishi kafolatlanmaydi.
              </p>
              <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto pr-1">
                {visibleGarments.map((garment) => (
                    <button
                      key={garment.id}
                      type="button"
                      onClick={() => selectCatalogGarment(garment)}
                      aria-pressed={selection?.id === garment.id}
                      className={`overflow-hidden rounded-xl border bg-white text-left transition-colors ${
                        selection?.id === garment.id
                          ? "border-hotpink ring-2 ring-hotpink/20"
                          : "border-burgundy/10 hover:border-burgundy/35"
                      }`}
                    >
                      <img
                        src={garment.imageUrl}
                        alt={`${garment.title} — ${garment.category}`}
                        loading="lazy"
                        className="h-36 w-full bg-cream-light object-cover object-top"
                      />
                      <span className="block p-2.5">
                        <span className="block truncate text-xs font-semibold text-charcoal">{garment.title}</span>
                        <span className="mt-1 block text-[10px] text-charcoal/55">{garment.category}</span>
                        <span className="mt-1 block text-[9px] text-charcoal/45">
                          {garment.attribution} · {garment.license}
                        </span>
                      </span>
                    </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="max-h-52 space-y-2 overflow-y-auto">
              {designsLoading && <p className="text-xs text-charcoal/60">Dizaynlar yuklanmoqda…</p>}
              {designsError && <p role="alert" className="text-xs text-red-700">{designsError}</p>}
              {!designsLoading && !designsError && savedDesigns.length === 0 && (
                <p className="rounded-xl bg-cream-light p-4 text-xs text-charcoal/70">
                  Saqlangan dizaynlar topilmadi. AI Studio’da saqlangan rasmlari bo‘lmagan dizaynlar matnli tavsif sifatida ishlatiladi.
                </p>
              )}
              {savedDesigns.map((design) => (
                <button
                  key={design.id}
                  type="button"
                  onClick={() => selectSavedDesign(design)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                    selection?.id === design.id ? "border-hotpink bg-hotpink/5" : "border-burgundy/10"
                  }`}
                >
                  {design.sketchUrl ? (
                    <img src={design.sketchUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-cream-light text-[10px] text-charcoal/50">
                      Matn
                    </span>
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-charcoal">{design.title}</span>
                    <span className="text-[10px] text-charcoal/55">
                      {design.sketchUrl ? "Rasmli dizayn" : "Tavsif asosida · rasm biriktirilmagan"}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {activeTab === "upload" && (
            <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-burgundy/20 bg-cream-light/40 p-5 text-center text-xs text-charcoal/70">
              <ImagePlus className="h-6 w-6 text-burgundy" />
              <span>Kiyimning JPG, PNG yoki WEBP rasmini tanlang (10 MB gacha)</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => handleUpload(event.target.files?.[0])}
              />
            </label>
          )}

          {uploadError && <p role="alert" className="text-xs text-red-700">{uploadError}</p>}

          {selection && (
            <div className="flex items-center gap-3 rounded-xl border border-burgundy/10 bg-white p-3">
              {selectedImageUrl && (
                <img
                  src={selectedImageUrl}
                  alt={`Tanlangan kiyim: ${selection.title}`}
                  className="h-20 w-16 rounded-lg bg-cream-light object-cover object-top"
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-charcoal">{selection.title}</p>
                <p className="text-[10px] text-charcoal/55">
                  {selection.image ? "Rasm Decart’ga yuboriladi" : "Faqat matnli tavsif yuboriladi"}
                </p>
                {selection.catalogGarment && (
                  <a
                    href={selection.catalogGarment.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-[9px] text-burgundy underline"
                  >
                    {selection.catalogGarment.attribution} · {selection.catalogGarment.license}
                  </a>
                )}
              </div>
            </div>
          )}

          <label className="block space-y-1 text-xs text-charcoal/70">
            Sessiya vaqti (eng ko‘pi 5 daqiqa)
            <select
              value={durationSeconds}
              disabled={isStarting || isRunning}
              onChange={(event) =>
                setDurationSeconds(Number(event.target.value) as (typeof SESSION_DURATIONS)[number])
              }
              className="w-full rounded-lg border border-burgundy/20 bg-white px-3 py-2 text-charcoal"
            >
              {SESSION_DURATIONS.map((seconds) => (
                <option key={seconds} value={seconds}>{seconds / 60} daqiqa</option>
              ))}
            </select>
          </label>

          <label className="flex items-start gap-2 rounded-xl border border-amber-400/40 bg-amber-50 p-3 text-[11px] leading-relaxed text-charcoal/80">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(event) => setConsentAccepted(event.target.checked)}
              className="mt-0.5 accent-burgundy"
            />
            <span>
              Roziman: sessiyani boshlasam, kamera videom va tanlangan kiyim rasmi/tavsifi jonli ishlov uchun Decart serverlariga yuboriladi. Kamera videosi CROOKED RIB tomonidan yozib olinmaydi yoki saqlanmaydi. Tashqi xizmat Decart hisobidan pulli kredit sarflashi mumkin; sessiya {durationSeconds} soniyadan oshmaydi.
            </span>
          </label>

          <div className="flex items-start gap-2 text-[10px] text-charcoal/55">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
            <span>
              {serviceAvailable
                ? "Decart kaliti faqat serverda saqlanadi. Video oqimi uchun rozilik talab qilinadi."
                : "AI Virtual Try-On uchun ajratilgan kreditlar tugagan."}
            </span>
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {isRunning || isStarting ? (
            <button
              type="button"
              onClick={() => stopSession()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-4 py-3 text-xs font-bold uppercase text-cream hover:bg-burgundy"
            >
              <CameraOff className="h-4 w-4" />
              {isStarting ? "Ulanishni bekor qilish" : "Kamerani to‘xtatish"}
            </button>
          ) : (
            <button
              type="button"
              disabled={!selection || !consentAccepted || !serviceAvailable}
              onClick={startSession}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-hotpink px-4 py-3 text-xs font-bold uppercase text-white hover:bg-hotpink-hover disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Camera className="h-4 w-4" />
              {serviceAvailable ? "Kamerani yoqish" : "AI Virtual Try-On mavjud emas"}
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
