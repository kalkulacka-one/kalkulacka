"use client";

import { Button, Icon } from "@kalkulacka-one/design-system/client";

import { mdiCheck, mdiContentCopy, mdiFacebook, mdiShareVariant, mdiTwitter } from "@mdi/js";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

// Bluesky butterfly icon (no MDI icon available)
const mdiBluesky =
  "M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.785 2.627 3.601 3.476 6.178 3.126-4.52.784-8.463 2.717-3.853 8.14C6.736 25.6 8.48 22.5 10.322 19.7c1.03-1.567 1.524-2.389 1.678-2.595.154.206.649 1.028 1.678 2.595 1.842 2.8 3.586 5.9 7.373 1.813 4.611-5.423.667-7.356-3.853-8.14 2.577.35 5.393-.499 6.178-3.126C23.622 9.418 24 4.458 24 3.768c0-.689-.139-1.86-.902-2.203-.659-.3-1.664-.62-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8";

type ShareDropdownProps = {
  shareUrl: string;
  shareText?: string;
  align?: "left" | "right";
};

export function ShareDropdown({ shareUrl, shareText, align = "right" }: ShareDropdownProps) {
  const t = useTranslations("calculator.result");
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setCopied(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleShareClick = useCallback(async () => {
    // On mobile, try native share API first
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareText ?? t("share-title"),
          url: shareUrl,
        });
        return;
      } catch {
        // User cancelled or API failed, fall through to dropdown
      }
    }
    setIsOpen((prev) => !prev);
  }, [shareUrl, shareText, t]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch {
      // Fallback: open the URL
      window.open(shareUrl, "_blank");
    }
  }, [shareUrl]);

  const handleFacebook = useCallback(() => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank", "noopener,noreferrer,width=600,height=400");
    setIsOpen(false);
  }, [shareUrl]);

  const handleX = useCallback(() => {
    const text = shareText ?? t("share-title");
    window.open(`https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer,width=600,height=400");
    setIsOpen(false);
  }, [shareUrl, shareText, t]);

  const handleBluesky = useCallback(() => {
    const text = shareText ? `${shareText} ${shareUrl}` : `${t("share-title")} ${shareUrl}`;
    window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer,width=600,height=400");
    setIsOpen(false);
  }, [shareUrl, shareText, t]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="link" color="neutral" size="small" aria-label={t("share-button")} onClick={handleShareClick}>
        <Icon icon={mdiShareVariant} size="medium" decorative />
      </Button>
      {isOpen && (
        <div className={`absolute ${align === "left" ? "left-0" : "right-0"} top-full mt-2 z-50 min-w-[200px] rounded-xl border border-gray-200 bg-white shadow-lg`}>
          <ul className="py-1">
            <li>
              <button type="button" onClick={handleCopyLink} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Icon icon={copied ? mdiCheck : mdiContentCopy} size="medium" decorative />
                <span>{copied ? t("share-copied") : t("share-copy-link")}</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={handleFacebook} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Icon icon={mdiFacebook} size="medium" decorative />
                <span>Facebook</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={handleX} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Icon icon={mdiTwitter} size="medium" decorative />
                <span>X</span>
              </button>
            </li>
            <li>
              <button type="button" onClick={handleBluesky} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 min-w-6" aria-hidden="true" focusable="false">
                  <path d={mdiBluesky} />
                </svg>
                <span>Bluesky</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
