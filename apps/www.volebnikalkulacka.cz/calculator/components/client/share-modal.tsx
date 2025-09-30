import { mdiCheck, mdiClose, mdiContentCopy, mdiFacebook, mdiLinkedin } from "@mdi/js";
import { Button, Icon } from "@repo/design-system/client";
import { useEffect, useState } from "react";

import { shareSession } from "../../../lib/api/sessions/share-session";
import type { RouteSegments } from "../../../lib/routing/route-builders";
import { canonical } from "../../../lib/routing/url-builders";

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
    if (isCopied) {
      const timeout = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  if (!isOpen) return null;

  const shareUrl = publicId ? canonical.publicResult(segments, publicId) : "";
  const xHandle = process.env.NEXT_PUBLIC_X_HANDLE;
  const shareText = xHandle ? `Podívejte se, jak mi vyšla ${xHandle}:` : "Podívejte se, jak mi vyšla Volební kalkulačka:";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
  };

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

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
              <input type="text" readOnly value={shareUrl} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 text-sm" />
              <Button onClick={handleCopy} variant="outline" color="neutral" size="small">
                <Icon icon={isCopied ? mdiCheck : mdiContentCopy} size="medium" decorative />
                {isCopied ? "Zkopírováno" : "Kopírovat"}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => window.open(facebookUrl, "_blank", "noopener,noreferrer")} variant="outline" color="neutral" size="small">
                <Icon icon={mdiFacebook} size="medium" decorative />
                Facebook
              </Button>
              <Button onClick={() => window.open(twitterUrl, "_blank", "noopener,noreferrer")} variant="outline" color="neutral" size="small">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
                X
              </Button>
              <Button onClick={() => window.open(linkedinUrl, "_blank", "noopener,noreferrer")} variant="outline" color="neutral" size="small">
                <Icon icon={mdiLinkedin} size="medium" decorative />
                LinkedIn
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
