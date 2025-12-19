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
          hogy a választók a politikával ne csak a frakciók és képviselők kommunikációján keresztül találkozzanak, hanem megismerjék álláspontjukat a Fővárosi Közgyűlés várospolitikai és szakmai
          kérdéseiben.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Az alkalmazás a felhasználó válaszait összeveti a közgyűlésben dolgozó frakciók és képviselők álláspontjaival, majd megmutatja, kik gondolkodnak a leginkább hasonlóan a kitöltőhöz.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          A Voksmonitor korábban úgy működött, hogy az állításokat elküldtük a pártok jelöltjeinek, akiknek lehetőségük volt megválaszolni és indokolni azokat. Ha egy párt nem reagált, válaszaikat
          nyilvános állásfoglalásaik alapján határoztuk meg. A jelenlegi Voksmonitor e hagyománnyal szakít: az egyes frakciók és képviselők álláspontjait kizárólag a Fővárosi Közgyűlés jegyzőkönyvei
          és határozatai alapján soroltuk be. Cserébe nem vizsgáltuk a szakbizottsági napirendeket és vitákat, illetve a közgyűléshez kapcsolódó sajtótájékoztatókat, politikai nyilatkozatokat.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          A Voksmonitor 28 várospolitikai témában segít eligazodni a kitöltőknek. A kérdések a közgyűlés 2024. október 4. és 2025. május 28. között tárgyalt ügyeit dolgozzák fel. Ebből 3 téma az
          Átláthatóságról, 3 a Környezetvédelem és Fenntarthatóságról, 6 a Közlekedés és Mobilitás kérdéséről, 1 a Közösség és kultúra témájáról, 5 Szociális és lakhatási ügyekről, 1 Társadalmi ügyek
          és esélyegyenlőségről, 4 Városfejlesztésről és 5 Városüzemeltetésről szólt.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          A Voksmonitor elkészítését alapos kutatómunka előzte meg. Először átböngésztük a sajtóanyagokat és a közgyűlési jegyzőkönyveket, hogy megtaláljuk azokat a témákat, amelyek élénk vitát
          váltottak ki, vagy jól bemutatják a közgyűlés működését és döntéshozatali logikáját vagy mert fontosnak ítéltük a város szempontjából.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Természetesen a közgyűlés nem csak ezzel a 28 üggyel foglalkozott, sok olyan téma is kimaradt, amely túl technikai, nehezen értelmezhető vagy nem egyértelműen kibontható kérdés volt. Célunk
          az volt, hogy olyan ügyeket válasszunk, amelyek érthetők, relevánsak, és valóban hatással vannak Budapest életére.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Az előterjesztések átlagosan 35-50%-a a városvezetéstől származik, hivatali előkészítés után vagy főjegyzői vagy főpolgármesteri előterjesztésként. Ehhez képest ezeknek az előterjesztéseknek
          az aránya a Voksmonitorban 20% alatt van és a nagy többsége a behozott témáknak képviselői kezdeményezés. Ennek az aránytalanságnak a fő oka, hogy a városvezetés előterjesztései jellemzően
          olyan döntések, amelyek vagy a napi működéshez vagy már futó projektek végrehajtásához kapcsolódnak, személyi döntések vagy pedig kimondottan összetett rendeletekre vonatkoznak, például a
          városrendezési jogszabályok elfogadására, amelyeket nehéz lett volna egy közpolitikai állítás keretében összefoglalni.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Ilyen értelemben az a módszertani döntés, hogy alapvetően új kezdeményezésekről szóljon a Voksmonitor kedvezett a politikailag “kihangosított”, de tartalmában sokszor egyszerűbb, egy fókuszú
          képviselői indítványoknak, szemben a hosszútávú folyamatok aktuálisan napirendre kerülő résztémáival.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Miután kiválasztottuk a témákat, összepárosítottuk őket a kapcsolódó szavazásokkal. A fővárosi közgyűlés jegyzőkönyveiből a név szerinti szavazások eredményeit saját fejlesztésű
          programkóddal nyertük ki és rendeztük táblázatba, majd ezeket hozzárendeltük a kiválasztott várospolitikai ügyekhez. Tekintettel arra, hogy végül egy konkrét szavazás eredményét jelenítjük
          meg, ezért többször az eredetileg tágan megfogalmazott közpolitikai témát egy részterületre kellett szűkíteni, hogy a szavazási eredmény reprezentatív maradjon az állításra vonatkozóan. Sőt,
          előfordulhatnak a Voksmonitorban olyan témák, amelyek az elmúlt év során többször is napirendre kerültek a Fővárosi Közgyűlésben, időnként akár különböző szavazási eredményekkel - ezekben az
          esetekben is végül egy konkrét szavazást kellett választanunk, ami nem feltétlenül adja vissza az év során alakuló politikai pozíciókat, de ilyenkor próbáltuk a legteljesebb képet adó
          szavazást kiválasztani.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          Minden kérdéshez rövid magyarázat tartozik, amely összefoglalja a vita főbb álláspontjait. A kitöltők anonim módon, „egyetért”, „nem ért egyet” vagy „kihagyás” válaszokkal jelezhetik
          véleményüket, az egyes kérdéseket fontosnak is jelölhetik. Az eredmény tájékozódást segítő jellegű: megmutatja, mely frakciók és képviselők állnak a legközelebb a kitöltő értékrendjéhez.
        </p>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          A szavazási eredmények értelmezése tekintetében még fontos jelezni, hogy a közgyűlési szavazásokat sokszor megelőzi vita a szakbizottságokban és egyes módosító javaslatok már ott elbukhatnak
          vagy integrálásra kerülnek a bizottság összesítő módosító javaslatában. A közgyűlési vitában így előfordulhat, hogy már egy eleve kompromisszumos javaslatot látunk, amit könnyebben támogat a
          frakciók többsége. Továbbá előfordulhat, hogy a leginkább vitás kérdéseket külön módosítók formájában vagy határozati pontokra külön szavazás kérésével szavazzák le, sőt, esetenként még
          napirendre sem veszik. Ezért lehetséges, hogy míg részletekkel kapcsolatban jelentős vita lehet, a végén a szavazási eredményben sokszor szinte teljes egyetértést látunk a frakciók között
          vagy csak 1-1 frakció tartózkodása látszik, ha egy számukra igazán fontos elem nem került végül be a csomagba. Érdemes ezért a szavazási eredmények értékelésekor észben tartani, hogy az
          előterjesztés potenciálisan már egy legnagyobb közös nevezőként működik a támogató frakciók között.
        </p>
      </div>

      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">Támogasd a Voksmonitor elkészítését!</h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-6">Tetszik a Voksmonitor? Kérjük, támogasd az elkészítését!</p>
      <DonateCard />
    </div>
  );
}
