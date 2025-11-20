import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiCheck, mdiClose, mdiContentCopy } from "@mdi/js";
import { useEffect, useRef, useState } from "react";

import { shareSession } from "@/lib/api";
import { canonical, type RouteSegments } from "@/lib/routing";

export type ShareModalProps = {
  calculatorId: string;
  segments: RouteSegments;
  isOpen: boolean;
  onClose: () => void;
};

export function ShareModal({ calculatorId, segments, isOpen, onClose }: ShareModalProps) {
  const [publicId, setPublicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasClipboardAccess, setHasClipboardAccess] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !publicId) {
      setIsLoading(true);
      setError(null);
      shareSession(calculatorId)
        .then((data) => {
          setPublicId(data.publicId);
        })
        .catch(() => {
          setError("Nepodařilo se vytvořit odkaz ke sdílení");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, publicId, calculatorId]);

  useEffect(() => {
    if (isOpen && navigator.permissions) {
      navigator.permissions
        .query({ name: "clipboard-write" as PermissionName })
        .then((result) => {
          setHasClipboardAccess(result.state !== "denied");
        })
        .catch(() => {
          setHasClipboardAccess(true);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    if (publicId) {
      const instagramUrl = `/api/images/sessions/${publicId}/instagram`;
      fetch(instagramUrl).catch(() => {});
    }
  }, [publicId]);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  if (!isOpen) return null;

  const nonEmbedSegments = { first: segments.first, second: segments.second };
  const shareUrl = publicId ? canonical.publicResult(nonEmbedSegments, publicId) : "";
  const xHandle = process.env.NEXT_PUBLIC_X_HANDLE;
  const shareText = xHandle ? `Podívejte se, jak mi vyšla ${xHandle}:` : "Podívejte se, jak mi vyšla Volební kalkulačka:";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
    } catch {
      inputRef.current?.select();
    }
  };

  const twitterUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const instagramStoryUrl = publicId ? `/api/images/sessions/${publicId}/instagram` : "";

  const handleDownloadInstagramStory = async () => {
    if (!instagramStoryUrl) return;

    if (navigator.share) {
      try {
        const response = await fetch(instagramStoryUrl);
        const blob = await response.blob();
        const file = new File([blob], "Moje Volební kalkulačka.png", { type: "image/png" });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "Volební kalkulačka",
            text: "Podívejte se, jak mi vyšla Volební kalkulačka",
          });
          return;
        }
      } catch (error) {
        console.error("Share failed:", error);
      }
    }

    const link = document.createElement("a");
    link.href = instagramStoryUrl;
    link.download = "Moje Volební kalkulačka.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative" onClick={(e) => e.stopPropagation()} role="document">
        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors" aria-label="Zavřít">
          <Icon icon={mdiClose} size="medium" decorative />
        </button>

        <h2 className="font-display text-2xl font-bold text-slate-800 mb-4">Sdílet výsledek</h2>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-slate-500">Vytváření odkazu...</div>
          </div>
        )}

        {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>}

        {shareUrl && !isLoading && !error && (
          <>
            <p className="text-slate-600 text-sm mb-4">Sdílejte svůj výsledek se svými blízkými:</p>

            <div className="flex gap-2 mb-6">
              <input ref={inputRef} type="text" readOnly value={shareUrl} className="flex-1 min-w-0 px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 text-sm truncate" />
              {hasClipboardAccess && (
                <div className="shrink-0">
                  <Button onClick={handleCopy} variant="outline" color="neutral" size="small">
                    <Icon icon={isCopied ? mdiCheck : mdiContentCopy} size="medium" decorative />
                    {isCopied ? "Zkopírováno" : "Kopírovat"}
                  </Button>
                </div>
              )}
            </div>

            <div className="mb-2">
              <Button onClick={handleDownloadInstagramStory} variant="outline" color="neutral" size="small">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Sdílet na Instagram
              </Button>
            </div>

            <div>
              <Button onClick={() => window.open(twitterUrl, "_blank", "noopener,noreferrer")} variant="outline" color="neutral" size="small">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
                Sdílet na X
              </Button>
            </div>

            <p className="text-slate-500 text-xs mt-4">
              Sdílením výsledků souhlasíte s našimi{" "}
              <a href="/soukromi" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-slate-900 underline">
                zásadami ochrany osobních údajů
              </a>
              .
            </p>
          </>
        )}
      </div>
    </div>
  );
}
