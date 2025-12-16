import type { Metadata } from "next";

import { DonateCard } from "../../../../../calculator/components/client";

export const metadata: Metadata = {
  title: "A Voksmonitorról",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">A Voksmonitorról</h2>

      <h3 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-xl md:text-lg mb-2 mt-8">Mi az a Voksmonitor?</h3>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A Voksmonitor egy online alkalmazás, amely összehasonlítja az Ön véleményét a Fővárosi Közgyűlésben dolgozó frakciók és képviselők álláspontjaival. A Voksmonitorhoz hasonló magyar (pl.
        Vokskabin) és külföldi (pl.Stemwijzer, Wahl-O-Mat,Wahlrechner) választási kalkulátorok történetéről és a világ minden tájáról származó sikeres példákról bővebben a Wikipédián olvashat.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Célja, hogy a választók a politikával ne csak kommunikáción és kampányokon keresztül találkozzanak, hanem megismerjék, hogyan viszonyulnak a döntéshozók a várospolitikai kérdésekhez.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Az alkalmazás a válaszadóhoz rendeli azt a frakciót vagy képviselőt, akinek álláspontja a válaszok alapján a legközelebb áll a kitöltő értékrendjéhez.
      </p>

      <h3 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-xl md:text-lg mb-2 mt-8">Ki és hogyan készíti a Voksmonitort?</h3>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">A Voksmonitort a K-Monitor és a KohoVolit.eu nonprofit szervezetek közösen fejlesztik és üzemeltetik.</p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A mostani kiadás a Fővárosi Közgyűlés 2024. október 4-i alakuló ülése és 2025. május 28. közötti időszakból válogat 28 olyan ügyet, amelyekben a képviselők vitáztak, közösen gondolkodtak és
        döntést hoztak.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A kérdéseket a K-Monitor munkatársai annak érdekében állították össze, hogy a közgyűlés döntéshozatalának különböző területei megjelenjenek bennük – a közlekedés, a lakhatás, a zöldfelületek
        kezelése, az átláthatóság és a városfejlesztés kérdései egyaránt.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">A képviselők válaszait a közgyűlési szavazások alapján határoztuk meg.</p>

      <h3 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-xl md:text-lg mb-2 mt-8">Hogyan működik?</h3>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        A Voksmonitor kérdőíve 28 közgyűlési ügyet mutat be, mindegyiket támogató és ellenző állításokon keresztül, hogy segítse a kitöltőt saját álláspontja kialakításában.
      </p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">A kitöltők minden állítással kapcsolatban jelezhetik, hogy egyetértenek-e vele, illetve mennyire tartják fontosnak az adott témát.</p>

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        Az alkalmazás ezután összehasonlítja a válaszokat a frakciók és képviselők álláspontjaival, és kiszámítja, kivel mutat a legnagyobb egyezést. Az eredmény százalékos formában jelenik meg,
        jelezve, mely politikai szereplő (frakció vagy képviselő) áll legközelebb a kitöltő értékrendjéhez.
      </p>
    </div>
  );
}
