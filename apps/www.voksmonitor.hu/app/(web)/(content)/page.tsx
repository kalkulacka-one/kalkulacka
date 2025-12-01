import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";
import Image from "next/image";
import Link from "next/link";
import { useId } from "react";

import { Background } from "../../../components/Background";
import { SubscribeForm } from "../../../components/client";
import { BeadRow } from "./BeadRow";

export default function Page() {
  const bgGridId = useId();
  const otherCalcsHeadingId = useId();

  return (
    <Background hasBlobs={true} blobsHeight="80%" blueBlobX="5%" blueBlobY="10%" redBlobX="50%" redBlobY="20%">
      <div className="relative min-h-screen z-0 flex flex-col">
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-6 flex-1">
          {/* Heading */}
          <h1 className="font-display ko:font-display font-bold tracking-tighter text-gray-700 text-4xl md:text-5xl lg:text-6xl text-center">Fővárosi Közgyűlés Voksmonitor</h1>

          {/* Featured cards */}
          <div className="mt-10 md:mt-12 flex justify-center">
            <div className="w-full max-w-2xl">
              {/* Right featured */}
              <Card shadow="elevated" border corner="topLeft" className="bg-white h-full !border-gray-200">
                <div className="p-6 md:p-8 h-full flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">Témák leltára</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">39 kérdés</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">10 perc</span>
                  </div>
                  <h2 className="mt-4 font-display ko:font-display font-bold tracking-tight text-gray-700 text-2xl md:text-3xl">Fővárosi Közgyűlés Voksmonitor</h2>
                  <p className="mt-2 text-gray-500">
                    A Voksmonitor célja, hogy a választók a politikával ne csak a pártok kommunikációján keresztül találkozzanak – hanem megismerjék a különböző politikai szereplők (esetünkben
                    frakciók és képviselők) álláspontját a legfontosabb várospolitikai és szakmai kérdésekben. Az alkalmazás a válaszadóhoz rendeli azt a frakciót, illetve képviselőt, amelynek
                    álláspontja a válaszok alapján legközelebb áll a kitöltő értékrendjéhez.
                  </p>
                  <div className="grid mt-auto pt-4 md:pt-6">
                    <Link href="/vm/fovarosi-kozgyules/inventory" className="grid">
                      <Button variant="fill" color="primary">
                        Kérdések indítása
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Archive section */}
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-2xl">
              <Card border className="h-full !border-gray-200 bg-gray-50/50">
                <div className="p-6 h-full flex flex-col">
                  <p className="text-gray-600 text-center">
                    A K-Monitor 2014 óta működteti a Voksmonitort, és az országgyűlési, európai parlamenti, valamint önkormányzati (illetve főpolgármesteri) választásokhoz készíti el magyar és angol
                    nyelvű választási kalkulátorát. A korábbi Voksmonitorokat az archívumban találod.
                  </p>
                  <div className="grid mt-auto pt-4">
                    <a href="https://old.voksmonitor.hu" target="_blank" rel="noopener noreferrer" className="grid">
                      <Button variant="link" color="neutral">
                        Ugrás az archívumra
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Methodology section */}
          <div className="mt-12">
            <div className="w-full max-w-6xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-8 md:p-12">
                <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-700 text-3xl md:text-4xl text-center mb-4">Hogyan készül a Voksmonitor?</h2>
                <p className="text-center text-gray-600 max-w-4xl mx-auto mb-12">
                  A Voksmonitor a K-Monitor és a KohoVolit.eu nonprofit szervezetek közös projektje, amely segít megismerni, hogy a Budapesti Fővárosi Közgyűlésben dolgozó frakciók és képviselők
                  hogyan viszonyulnak a főváros legfontosabb ügyeihez.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Image src="/methodology/1.png" alt="Kérdőív" width={64} height={64} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      A kérdőív 39 olyan közgyűlési ügyet tartalmaz, amelyekről 2024. október 4. és 2025. május 28. között vita és döntés is született.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Image src="/methodology/2.png" alt="Pártok" width={64} height={64} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">A frakciók válaszait a közgyűlési szavazások és viták alapján határoztuk meg.</p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Image src="/methodology/3.png" alt="Összehasonlítás" width={64} height={64} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">Ezeket az eredményeket hasonlítjuk össze az Ön válaszaival.</p>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Image src="/methodology/4.png" alt="Számolás" width={64} height={64} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">A Voksmonitor így megmutatja, mely frakció vagy képviselő véleménye áll legközelebb az Ön értékrendjéhez.</p>
                  </div>
                </div>
                <p className="text-center text-gray-600 max-w-4xl mx-auto mt-12">
                  A Voksmonitor célja a tájékoztatás és a választói mérlegelés segítése. A végső döntést a szavazófülkében Ön hozza meg.
                  <br />
                  <a href="/rolunk" className="font-bold">
                    Tudjon meg többet!
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter subscription */}
          <div className="mt-16 max-w-md mx-auto">
            <SubscribeForm />
          </div>

          {/* Footer */}
          <div className="mt-16 border-t border-gray-200 pt-6 text-center text-gray-500">© 2025 Volební kalkulačka / Voksmonitor</div>
        </div>
      </div>
    </Background>
  );
}
