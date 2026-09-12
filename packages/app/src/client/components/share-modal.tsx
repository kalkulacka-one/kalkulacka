import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiCheck, mdiClose, mdiContentCopy } from "@mdi/js";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => Promise<{ publicId: string }>;
  buildShareUrl: (publicId: string) => string;
  privacyHref?: string;
};

export function ShareModal({ isOpen, onClose, onShare, buildShareUrl, privacyHref }: ShareModalProps) {
  const t = useTranslations("koa.components.shareModal");
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
      onShare()
        .then((data) => {
          setPublicId(data.publicId);
        })
        .catch(() => {
          setError(t("error"));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen, publicId, onShare, t]);

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

  const shareUrl = publicId ? buildShareUrl(publicId) : "";
  const xHandle = process.env.NEXT_PUBLIC_X_HANDLE;
  const shareText = xHandle ? t("shareTextWithHandle", { handle: xHandle }) : t("shareText");

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
        const file = new File([blob], t("fileName"), { type: "image/png" });

        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: t("shareTitle"),
            text: t("shareFileText"),
          });
          return;
        }
      } catch (error) {
        console.error("Share failed:", error);
      }
    }

    const link = document.createElement("a");
    link.href = instagramStoryUrl;
    link.download = t("fileName");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="koa:fixed koa:inset-0 koa:z-50 koa:flex koa:items-center koa:justify-center koa:p-4 koa:bg-black/50 koa:backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="koa:bg-white koa:rounded-2xl koa:shadow-xl koa:max-w-lg koa:w-full koa:p-6 koa:relative" onClick={(e) => e.stopPropagation()} role="document">
        <button type="button" onClick={onClose} className="koa:absolute koa:top-4 koa:right-4 koa:text-slate-400 koa:hover:text-slate-600 koa:transition-colors" aria-label={t("close")}>
          <Icon icon={mdiClose} size="medium" decorative />
        </button>

        <h2 className="koa:font-display koa:text-2xl koa:font-bold koa:text-slate-800 koa:mb-4">{t("title")}</h2>

        {isLoading && (
          <div className="koa:flex koa:items-center koa:justify-center koa:py-8">
            <div className="koa:text-slate-500">{t("creating")}</div>
          </div>
        )}

        {error && <div className="koa:mb-4 koa:p-4 koa:bg-red-50 koa:text-red-700 koa:rounded-lg">{error}</div>}

        {shareUrl && !isLoading && !error && (
          <>
            <p className="koa:text-slate-600 koa:text-sm koa:mb-4">{t("intro")}</p>

            <div className="koa:flex koa:gap-2 koa:mb-6">
              <input
                ref={inputRef}
                type="text"
                readOnly
                value={shareUrl}
                className="koa:flex-1 koa:min-w-0 koa:px-3 koa:py-2 koa:border koa:border-slate-200 koa:rounded-lg koa:bg-slate-50 koa:text-slate-700 koa:text-sm koa:truncate"
              />
              {hasClipboardAccess && (
                <div className="koa:shrink-0">
                  <Button onClick={handleCopy} variant="outline" color="neutral" size="small">
                    <Icon icon={isCopied ? mdiCheck : mdiContentCopy} size="medium" decorative />
                    {isCopied ? t("copied") : t("copy")}
                  </Button>
                </div>
              )}
            </div>

            <div className="koa:mb-2">
              <Button onClick={handleDownloadInstagramStory} variant="outline" color="neutral" size="small">
                <svg className="koa:w-5 koa:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                {t("shareInstagram")}
              </Button>
            </div>

            <div>
              <Button onClick={() => window.open(twitterUrl, "_blank", "noopener,noreferrer")} variant="outline" color="neutral" size="small">
                <svg className="koa:w-5 koa:h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
                {t("shareX")}
              </Button>
            </div>

            {privacyHref && (
              <p className="koa:text-slate-500 koa:text-xs koa:mt-4">
                {t("consentPrefix")}{" "}
                <a href={privacyHref} target="_blank" rel="noopener noreferrer" className="koa:text-slate-700 koa:hover:text-slate-900 koa:underline">
                  {t("privacyPolicy")}
                </a>
                .
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
