import { Icon, Logo } from "@kalkulacka-one/design-system/client";

import { mdiEmail, mdiFacebook, mdiInstagram, mdiPhone } from "@mdi/js";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-white">
                <Logo title="Volební kalkulačka" size="small" monochrome />
              </div>
              <p className="text-sm text-white mt-3" dangerouslySetInnerHTML={{ __html: t.raw("tagline") }} />
              <div className="grid grid-cols-2 gap-2 mt-4 w-fit">
                <Link href="https://www.instagram.com/kmonitorhu/" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center" aria-label="Instagram">
                  <Icon icon={mdiInstagram} size="medium" decorative />
                </Link>
                <Link href="https://www.facebook.com/Kmonitor/" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center" aria-label="Facebook">
                  <Icon icon={mdiFacebook} size="medium" decorative />
                </Link>
              </div>
            </div>
            <div />
            <div className="grid grid-flow-row gap-2">
              <Link href="/rolunk" className="text-sm text-gray-400 hover:text-white">
                {t("nav.about-us")}
              </Link>
              <Link href="/voksmonitorrol" className="text-sm text-gray-400 hover:text-white">
                {t("nav.about-voksmonitor")}
              </Link>
              <Link href="/modszertan" className="text-sm text-gray-400 hover:text-white">
                {t("nav.methodology")}
              </Link>
              <Link href="https://tamogatas.k-monitor.hu/" target="_blank" className="text-sm text-gray-400 hover:text-white">
                {t("nav.support")}
              </Link>
              <Link href="https://adatbazis.k-monitor.hu/egyeb/adatkezelesi-tajekoztato" target="_blank" className="text-sm text-gray-400 hover:text-white">
                {t("nav.privacy-policy")}
              </Link>
            </div>
            <div>
              <h3 className="mb-4">{t("contact.heading")}</h3>
              <div className="space-y-3">
                <a href="mailto:info@k-monitor.hu" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <Icon icon={mdiEmail} size="medium" decorative />
                  <span>info@k-monitor.hu</span>
                </a>
                <a href="tel:+3617895005" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <Icon icon={mdiPhone} size="medium" decorative />
                  <span>+36 1 789 5005</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
