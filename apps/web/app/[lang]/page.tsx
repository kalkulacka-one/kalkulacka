import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kalkulacka.1",
  description: "Ta pravá volební kalkulačka pro miliony voličů ve 4 zemích",
};

export default function Page(): JSX.Element {
  return (
    <section className="max-w-2xl grid gap-8">
      <section className="grid gap-2">
        <h2 className="text-2xl font-medium">
          Tvoříme <span className="font-bold">Volební kalkulačku</span>, která
          vám pomáhá rozhodnout se koho volit
        </h2>
        <p>
          Jsme spolek{" "}
          <a
            href="https://kohovolit.eu"
            className="underline hover:no-underline"
          >
            KohoVolit.eu
          </a>{" "}
          a už 15 let pro vás tvoříme{" "}
          <a
            href="https://www.volebnikalkulacka.cz"
            className="underline hover:no-underline"
          >
            Volební kalkulačku
          </a>
          , která vám pomáhá učinit informované rozhodnutí, koho volit.
        </p>
        <p>
          V roce 2022 jsme s podporou{" "}
          <a
            href="https://cesko.digital"
            className="underline hover:no-underline"
          >
            Česko.Digital
          </a>{" "}
          přinesli novou generaci Volební kalkulačky v&nbsp;novém designu a teď
          nás čeká další etapa: mezinárodní expanze. Už jsme spustili kalkulačku
          v 6 zemích a chystáme další:
        </p>
        <ul className="list-none pl-4">
          <li>
            🇨🇿{" "}
            <a
              href="https://www.volebnikalkulacka.cz"
              className="font-bold underline hover:no-underline"
            >
              Volební kalkulačka
            </a>{" "}
            v&nbsp;Česku
          </li>
          <li>
            🇸🇰{" "}
            <a
              href="https://www.volebnakalkulacka.sk"
              className="font-bold underline hover:no-underline"
            >
              Volební kalkulačka
            </a>{" "}
            na Slovensku
          </li>
          <li>
            🇭🇺{" "}
            <a
              href="https://www.voksmonitor.hu"
              className="font-bold underline hover:no-underline"
            >
              Voksmonitor
            </a>{" "}
            v&nbsp;Maďarsku
          </li>
          <li>
            🇦🇹{" "}
            <a
              href="https://www.wahlrechner.at"
              className="font-bold underline hover:no-underline"
            >
              Wahlrechner
            </a>{" "}
            v&nbsp;Rakousku
          </li>
          <li>
            🇷🇴{" "}
            <a
              href="https://www.testvot.eu"
              className="font-bold underline hover:no-underline"
            >
              TestVot
            </a>{" "}
            v&nbsp;Rumunsku
          </li>
          <li>
            🇽🇰{" "}
            <a
              href="https://www.kalkulatorizgjedhor.org"
              className="font-bold underline hover:no-underline"
            >
              Kalkulatori zgjedhor
            </a>{" "}
            v&nbsp;Kosovu
          </li>
          <li>
            🇦🇱{" "}
            <a
              href="https://www.kalkulatorizgjedhor.al"
              className="font-bold underline hover:no-underline"
            >
              Kalkulatori zgjedhor
            </a>{" "}
            v&nbsp;Albánii
            <span className="inline-flex items-center ml-2 px-2 py-0.25 rounded-full text-sm font-medium bg-gray-200">
              květen 2025
            </span>
          </li>
          <li>
            🇲🇰{" "}
            <a
              href="https://www.glasomer.mk"
              className="font-bold underline hover:no-underline"
            >
              Glasomer
            </a>{" "}
            v&nbsp;Severní Makedonii
            <span className="inline-flex items-center ml-2 px-2 py-0.25 rounded-full text-sm font-medium bg-gray-200">
              říjen 2025
            </span>
          </li>
        </ul>
        <p>
          Naše volební kalkulačky vyplní statisíce voličů každý rok. Jen
          prezidentskou kalkulačku v&nbsp;Česku vyplnilo v&nbsp;roce 2023 přes{" "}
          <strong>1 milion lidí</strong>!
        </p>
      </section>
      <section className="grid gap-2">
        <h2 className="text-2xl font-medium">
          Podpořte Volební kalkulačku. Nebo se zapojte!
        </h2>
        <p>
          Abychom mohli v tvorbě kalkulaček pokračovat, potřebujeme vaši
          podporu.{" "}
          <Link
            href="/cs/podporte-kalkulacku"
            className="font-bold underline hover:no-underline"
          >
            Podpořte nás
          </Link>{" "}
          nebo se{" "}
          <Link
            href="/cs/zapojte-se"
            className="font-bold underline hover:no-underline"
          >
            zapojte do našeho týmu dobrovolníků
          </Link>{" "}
          a pomozte nám Volební kalkulačku dál rozvíjet. Děkujeme!
        </p>
      </section>
    </section>
  );
}
