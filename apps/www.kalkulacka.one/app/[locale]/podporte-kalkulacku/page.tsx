"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    // biome-ignore lint/security/noGlobalEval: Darujme widget is external code for donation processing
    eval(`+function(w, d, s, u, a, b) {
      w["DarujmeObject"] = u;
      w[u] = w[u] || function () { (w[u].q = w[u].q || []).push(arguments) };
      a = d.createElement(s); b = d.getElementsByTagName(s)[0];
      a.async = 1; a.src = "https://www.darujme.cz/assets/scripts/widget.js";
      b.parentNode.insertBefore(a, b);
    }(window, document, "script", "Darujme");
    Darujme(1, "w2acrk0w61fgr3so", 'render', "https://www.darujme.cz/widget?token=w2acrk0w61fgr3so", "100%");`);
  }, []);

  return (
    <section className="max-w-2xl grid gap-8">
      <section className="grid gap-2">
        <h2 className="text-3xl font-display font-bold">Podpořte Volební kalkulačku a&nbsp;demokracii</h2>
        <p>Líbí se vám Volební kalkulačka? Díky dobrovolníkům a štědrým dárcům můžeme kalkulačku poskytovat zdarma.</p>
        <p>Abychom však mohli pokračovat v naší práci pro nadcházející volby a vylepšovat kalkulačku, potřebujeme vaši pomoc. Podpořte nás finančním příspěvkem. Každý příspěvek se počítá!</p>
        <p>
          Nebo se{" "}
          <Link href="/cs/zapojit-se" className="underline hover:no-underline">
            přidejte k našemu týmu dobrovolníků
          </Link>{" "}
          a pomozte milionům lidí, kteří Volební kalkulačku využívají.
        </p>
        <p>Vaše podpora je klíčová pro to, abychom mohli pokračovat v naší práci pro nadcházející volby a vylepšovat kalkulačku. Děkujeme!</p>
      </section>
      <section className="grid gap-2">
        <h3 className="text-2xl font-bold">Jednorázový příspěvek</h3>
        <p>Podpořte nás jednorázovým příspěvkem:</p>
        <div className="max-w-md" data-darujme-widget-token="w2acrk0w61fgr3so">
          Načítám…
        </div>
        <p>Děkujeme!</p>
      </section>
      <section className="grid gap-2">
        <p>
          Chcete se na něco zeptat? Napište nám e-mail:{" "}
          <a href="mailto:hey@kalkulacka.one" className="underline hover:no-underline">
            hey@kalkulacka.one
          </a>{" "}
          nebo zprávu na{" "}
          <a href="https://twitter.com/kalkulacka_one" className="underline hover:no-underline">
            <span className="line-through">Twitteru</span> X
          </a>
          .
        </p>
      </section>
    </section>
  );
}
