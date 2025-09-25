import { Button } from "@repo/design-system/client";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rozcestník",
};

const regions = [
  {
    region: "Hlavní město Praha",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/praha/uvod",
    code: "CZ010",
  },
  {
    region: "Jihočeský",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/jihocesky/uvod",
    code: "CZ031",
  },
  {
    region: "Středočeský",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/stredocesky/uvod",
    code: "CZ020",
  },
  {
    region: "Plzeňský",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/plzensky/uvod",
    code: "CZ032",
  },
  {
    region: "Karlovarský",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/karlovarsky/uvod",
    code: "CZ041",
  },
  {
    region: "Ústecký",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/ustecky/uvod",
    code: "CZ042",
  },
  {
    region: "Liberecký",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/liberecky/uvod",
    code: "CZ051",
  },
  {
    region: "Královéhradecký",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/kralovehradecky/uvod",
    code: "CZ052",
  },
  {
    region: "Pardubický",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/pardubicky/uvod",
    code: "CZ053",
  },
  {
    region: "Vysočina",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/vysocina/uvod",
    code: "CZ063",
  },
  {
    region: "Jihomoravský",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/jihomoravsky/uvod",
    code: "CZ064",
  },
  {
    region: "Olomoucký",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/olomoucky/uvod",
    code: "CZ071",
  },
  {
    region: "Moravskoslezský",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/moravskoslezsky/uvod",
    code: "CZ080",
  },
  {
    region: "Zlínský",
    url: "https://www.volebnikalkulacka.cz/embed/alarm/volby/snemovni-2025-asap/zlinsky/uvod",
    code: "CZ072",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col h-full justify-center items-center gap-4">
      <h4 className="self-start sm:self-center flex-inline font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Vyberte kraj České republiky</h4>
      <p className="text-slate-500 text-left sm:text-center">
        Vítejte u volební kalkulačky pro volby do Poslanecké sněmovny 2025. Protože se kandidátní listiny v každém kraji liší, je potřeba si nejprve vybrat ten váš.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 w-5/6 gap-4 ">
        {regions.map((region) => (
          <Link key={region.region} className="grid items-stretch" href={region.url}>
            <Button>{region.region}</Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
