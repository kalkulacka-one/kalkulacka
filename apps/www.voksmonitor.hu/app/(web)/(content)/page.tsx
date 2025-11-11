import { Button } from "@repo/design-system/client";
import { Card } from "@repo/design-system/server";
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
        {/* Test version disclaimer */}
        <div className="relative z-10 bg-yellow-50 py-3 text-center border-t-2 border-yellow-200">
          <p className="text-sm font-semibold text-yellow-800">⚠️ Ez egy tesztverzió. Hibák és pontatlanságok előfordulhatnak.</p>
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-6 flex-1">
          {/* Heading */}
          <h1 className="font-display ko:font-display font-bold tracking-tighter text-gray-700 text-4xl md:text-5xl lg:text-6xl text-center">Voksmonitor 2025</h1>

          {/* Featured cards */}
          <div className="mt-10 md:mt-12 flex justify-center">
            <div className="w-full max-w-2xl">
              {/* Right featured */}
              <Card shadow="elevated" border corner="topLeft" className="bg-white h-full !border-gray-200">
                <div className="p-6 md:p-8 h-full flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">Szavazások leltára</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">39 kérdés</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">10 perc</span>
                  </div>
                  <h2 className="mt-4 font-display ko:font-display font-bold tracking-tight text-gray-700 text-2xl md:text-3xl">Budapesti Fővárosi Közgyűlés Voksmonitor</h2>
                  <p className="mt-2 text-gray-500">
                   A Voksmonitor célja, hogy a választók a politikával ne csak a pártok kommunikációján keresztül találkozzanak – hanem megismerjék a különböző politikai szereplők (esetünkben frakciók és képviselők) álláspontját a legfontosabb várospolitikai és szakmai kérdésekben. Az alkalmazás a válaszadóhoz rendeli azt a frakciót, illetve képviselőt, amelynek álláspontja a válaszok alapján legközelebb áll a kitöltő értékrendjéhez.
                  </p>
                  <div className="grid mt-auto pt-4 md:pt-6">
                    <Link href="/vm/budapest-kozgyules/inventory" className="grid">
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
                  <p className="text-gray-600">A korábbi Voksmonitorokat az archívumban találod</p>
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
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-2xl">
              <Card border className="h-full !border-gray-200 bg-white">
                <div className="p-6 md:p-8 h-full flex flex-col">
                  <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-700 text-2xl">Módszertan</h2>
                  <p className="mt-4 text-gray-600">A Voksmonitor módszertanának részletes leírása hamarosan elérhető lesz.</p>
                </div>
              </Card>
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
