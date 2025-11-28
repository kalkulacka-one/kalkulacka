import type { Metadata } from "next";

import { DonateCard } from "../../../../../calculator/components/client";

export const metadata: Metadata = {
  title: "A Voksmonitor módszertana",
};

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <h1 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-3xl md:text-4xl mb-8">A Voksmonitor módszertana</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          A Voksmonitor a <strong className="font-semibold text-gray-900">K-Monitor</strong> és a <strong className="font-semibold text-gray-900">KohoVolit.eu</strong> közös projektje, amelynek célja,
          hogy a választók a politikával ne csak a frakciók és képviselők kommunikációján keresztül találkozzanak, hanem megismerjék álláspontjukat a Budapesti Fővárosi Közgyűlés legfontosabb
          várospolitikai és szakmai kérdéseiben.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Az alkalmazás a felhasználó válaszait összeveti a közgyűlésben dolgozó frakciók és képviselők álláspontjaival, majd megmutatja, kik gondolkodnak a leginkább hasonlóan a kitöltőhöz.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          A Voksmonitor korábban úgy működött, hogy az állításokat elküldtük a pártok jelöltjeinek, akiknek lehetőségük volt megválaszolni és indokolni azokat. Ha egy párt nem reagált, válaszaikat
          nyilvános állásfoglalásaik alapján határoztuk meg. A jelenlegi Voksmonitor e hagyománnyal szakít: az egyes frakciók és képviselők álláspontjait kizárólag a Fővárosi Közgyűlés jegyzőkönyvei
          és határozatai alapján soroltuk be.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          A Voksmonitor 39 várospolitikai témában segít eligazodni a kitöltőknek. A kérdések a közgyűlés 2024. október 4. és 2025. május 28. között tárgyalt ügyeit dolgozzák fel, lefedve a
          legfontosabb területeket – a közlekedéstől és lakhatástól kezdve a zöldfelületek kezelésén és átláthatóságon át a városfejlesztésig.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-0">
          Minden kérdéshez rövid magyarázat tartozik, amely összefoglalja a vita főbb álláspontjait. A kitöltők anonim módon, „egyetért", „nem ért egyet" vagy „kihagyás" válaszokkal jelezhetik
          véleményüket, az egyes kérdéseket fontosnak is jelölhetik. Az eredmény tájékozódást segítő jellegű: megmutatja, mely frakciók és képviselők állnak a legközelebb a kitöltő értékrendjéhez.
        </p>
      </div>

      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">Támogasd a Voksmonitor elkészítését!</h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-6">Tetszik a Voksmonitor? Kérjük, támogasd az elkészítését!</p>
      <DonateCard />
    </div>
  );
}
