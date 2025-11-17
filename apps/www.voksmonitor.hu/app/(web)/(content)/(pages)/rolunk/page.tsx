import type { Metadata } from "next";

import { DonateCard } from "../../../../../calculator/components/client";

export const metadata: Metadata = {
  title: "Rólunk",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">A K-Monitorról</h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A K-Monitornál hisszük, hogy a korrupció olyan probléma, amely a társadalom minden részét érinti, és mindenkinek árt – világnézettől, származástól, nemtől vagy politikai meggyőződéstől
        függetlenül. A korrupció nemcsak hatalmas gazdasági károkat okoz, hanem aláássa az intézményekbe és a jogállamba vetett bizalmat is. Veszélyezteti a demokráciákat, és különösen súlyosan érinti
        azokat a régiókat, ahol a jó kormányzás elengedhetetlen lenne az éhezés, a szegénység és az erőszak felszámolásához.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A korrupció legjobb ellenszere egy olyan társadalom, ahol az állampolgárok felelősséget éreznek az intézmények iránt, és aktívan alakítják a saját környezetüket.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Nonprofit szervezetként a K-Monitor intézményeket, újságírókat és magánszemélyeket támogat a korrupció elleni küzdelemben közösségépítéssel, technológiai fejlesztéssel, érdekképviselettel és
        kutatással.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">Működésünk alapelvei az átláthatóság, a függetlenség és a kritikus szemlélet.</p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Ha érdekel bőveben a tevékenységünk, látogass el <a href="https://k-monitor.hu">honlapunkra</a> vagy <a href="https://k.blog.hu">blogunkra</a>!
      </p>

      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">Támogasd a Voksmonitor elkészítését!</h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-6">Tetszik a Voksmonitor? Kérjük, támogasd az elkészítését!</p>
      <DonateCard />
    </div>
  );
}
