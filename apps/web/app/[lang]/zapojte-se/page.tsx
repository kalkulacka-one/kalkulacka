import Link from "next/link";

export default function Page(): JSX.Element {
  return (
    <section className="max-w-2xl grid gap-8">
      <section className="grid gap-2">
        <h2 className="text-3xl font-bold">
          Přidejte se k našemu týmu dobrovolníků a&nbsp;podpořte demokracii
        </h2>
        <p>
          Připravit každou volební kalkulačku zabere našemu týmu dobrovolníků i
          120 hodin. Vyvíjíme open-source aplikaci a podporujeme zahraniční
          partnery v&nbsp;přípravě lokálních volebních kalkulaček.
        </p>
        <p>
          <strong>A potřebujeme vaši pomoc.</strong> Přidejte se k našemu týmu
          dobrovolníků, podpořte férové volby a pomozte milionům lidí, kteří
          Volební kalkulačku využívají. Jen prezidentskou kalkulačku v Česku
          vyplnilo v roce 2023 přes 1 milion lidí!
        </p>
        <p>
          Práce na volební kalkulačce je pestrá i různě rozložená v&nbsp;čase,
          takže určitě najdete příležitost vhodnou právě pro vás. Každé pomoci
          si velmi vážíme.
        </p>
        <p>
          A pokud se nemůžete zapojit přímo, můžete nás{" "}
          <Link
            href="/cs/podporte-kalkulacku"
            className="underline hover:no-underline"
          >
            podpořit i jinak
          </Link>
          . Moc děkujeme!
        </p>
        <p>
          Chcete se zapojit nebo se na něco zeptat? Napište nám e-mail:{" "}
          <a
            href="mailto:hey@kalkulacka.one"
            className="underline hover:no-underline"
          >
            hey@kalkulacka.one
          </a>{" "}
          nebo zprávu na{" "}
          <a
            href="https://twitter.com/kalkulacka_one"
            className="underline hover:no-underline"
          >
            <span className="line-through">Twitteru</span> X
          </a>
          .
        </p>
      </section>
      <section className="grid gap-2">
        <h3 className="text-2xl font-bold">Přiležitosti k zapojení</h3>
        <p>
          Evropské volby jsou za rohem a my už připravujeme další kalkulačky pro
          nadcházející volby: krajské a senátní v Česku na podzim. A čeká nás i
          spousta technických výzev. Jak se můžete zapojit?
        </p>
        <ul className="list-disc pl-6 grid gap-4">
          <li>
            <section className="grid gap-1">
              <h4 className="text-lg font-bold">Projektové řízení</h4>
              <p>
                Koordinace týmu dobrovolníků není jednoduchá a potřebovali
                bychom někoho, kdo tomu dá systém, bude hlídat termíny a
                pošťuchovat dobrovolníky k práci.
              </p>
              <p>
                <strong>Kdy?</strong> Čím dřív, tím líp!
              </p>
              <p>
                <strong>Jak dlouho?</strong> Tuto roli bychom rádi obsadili
                dlouhodobě a nejlépe s pravidelnou časovou investicí v&nbsp;řádu
                jednotek hodin týdně. Určitě se ale ozvěte a něco vymyslíme!
              </p>
            </section>
          </li>
          <li>
            <section className="grid gap-1">
              <h4 className="text-lg font-bold">Marketing & copywriting</h4>
              <p>
                Rádi bychom zapracovali na komunikaci volební kalkulačky, aby se
                dostala k co nejvíce voličům. A taky trochu šlápli do sociálních
                sítí. Pomůžete nám s tím?
              </p>
              <ul className="list-disc pl-6">
                <li>PR a tiskové zprávy</li>
                <li>newslettery</li>
                <li>obsah a komunikace na sociálních sítích</li>
                <li>doplňující obsah a články na webu</li>
                <li>a další komunikace</li>
              </ul>
              <p>
                <strong>Kdy?</strong> Zejména při spuštění volební kalkulačky
                (cca 2 týdny před volbami), ale do přípravy a strategické
                komunikace se dá vrhnout kdykoliv.
              </p>
              <p>
                <strong>Jak dlouho?</strong> Dlouhodobá posila do týmu by byla
                nejlepší, ale budeme rádi i za jednorázovou pomoc pro jedny
                volby nebo jen v jedné oblasti.
              </p>
            </section>
          </li>
          <li>
            <section className="grid gap-1">
              <h4 className="text-lg font-bold">Vývoj aplikace</h4>
              <p>
                Novou generaci kalkulačky jsme spustili v roce 2022 a od té doby
                narazili na spoustu technických limitů. Rozhodli jsme se proto
                aplikaci přepsat, poučit se z chyb a připravit ji na mezinárodní
                expanzi.
              </p>
              <p>
                Pracujeme s populárními technologiemi: React, NextJS, Tailwind
                CSS či Prisma & PostgreSQL. Vše je{" "}
                <a
                  href="https://github.com/kalkulacka-one/kalkulacka"
                  className="underline hover:no-underline"
                >
                  open-source na našem GitHubu
                </a>{" "}
                (současná kalkulačka zatím ještě na{" "}
                <a
                  href="https://github.com/cesko-digital/volebni-kalkulacka-2022"
                  className="underline hover:no-underline"
                >
                  GitHubu Česko.Digital
                </a>
                ), kalkulačka beží na Vercelu a developer experience je pro nás
                priorita číslo 1: nemusíte se bát, že spálíte týden času, než
                něco skutečně uděláte.
              </p>
              <p>
                <strong>Kdy?</strong> Kdykoliv. Ale potřebujeme do toho pořádně
                šlápnout hlavně přes léto, abychom stihli podzimní volby.
              </p>
              <p>
                <strong>Jak dlouho?</strong> Pravidelných pár hodin týdně by
                bylo ideální, ale budeme rádi za každý pull request.
              </p>
            </section>
          </li>
          <li>
            <section className="grid gap-1">
              <h4 className="text-lg font-bold">
                Příprava otázek a sběr odpovědí
              </h4>
              <p>
                Pro každou kalkulačku musíme připravit kolem 100 precizně
                formulovaných otázek a získat odpovědi od všech politiků či
                politických stran. Pomůžete nám s přípravou otázek, sběrem
                odpovědí nebo rovnou obojím?
              </p>
              <p>
                <strong>Kdy?</strong> Otázky začínáme připravovat cca měsíc před
                každými volbami a sběr odpovědí vrcholí těsně před spuštěním
                kalkulačky. Tedy teď u krajských a senátních voleb to bude v
                polovině srpna 2024.
              </p>
              <p>
                <strong>Jak dlouho?</strong> Zapojit se můžete klidně
                jednorázově pro jedny volby. Počítejte s flexibilní časovou
                náročností jednotek hodin.
              </p>
            </section>
          </li>
          <li>
            <section className="grid gap-1">
              <h4 className="text-lg font-bold">UX design & grafika</h4>
              <p>
                Kalkulačka se předloni převlékla do nového kabátku, ale spolu s
                novými výzvami přichází i další požadavky na design. A
                potřebujeme i pěkné vizuály třeba na sociální sítě.
              </p>
              <p>
                <strong>Kdy?</strong> Kdykoliv.
              </p>
              <p>
                <strong>Jak dlouho?</strong> Zapojit se můžete klidně
                jednorázově pro jedny volby nebo dlouhodobě vylepšovat design
                kalkulačky.
              </p>
            </section>
          </li>
          <li>
            <section className="grid gap-1">
              <h4 className="text-lg font-bold">Právní služby</h4>
              <p>
                Potřebovali bychom pomoct s právními dokumenty, jako je licence
                pro open-source aplikaci, podmínky použití a ochrana osobních
                údajů. Něco máme, ale potřebujeme to doladit.
              </p>
              <p>
                <strong>Kdy?</strong> Kdykoliv.
              </p>
              <p>
                <strong>Jak dlouho?</strong> Jednorázově a případně na
                konzultace nebo zapracování nové legislativy v budoucnu.
              </p>
            </section>
          </li>
        </ul>
        <h2 className="text-2xl font-bold">Jak se zapojit?</h2>
        <p>
          Napište nám e-mail:{" "}
          <a
            href="mailto:hey@kalkulacka.one"
            className="underline hover:no-underline"
          >
            hey@kalkulacka.one
          </a>{" "}
          nebo zprávu na{" "}
          <a
            href="https://twitter.com/kalkulacka_one"
            className="underline hover:no-underline"
          >
            <span className="line-through">Twitteru</span> X
          </a>
          . Děkujeme!
        </p>
      </section>
    </section>
  );
}
