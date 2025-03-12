export default function Page(): JSX.Element {
  return (
    <section className="max-w-2xl grid gap-4">
      <section className="grid gap-2">
        <h2 className="text-3xl font-bold">Získejte vlastní Volební kalkulačku</h2>
        <p>Náš tým vývojářů dokáže vytvořit přizpůsobenou webovou aplikaci kalkulačky ušitou na míru vašim konkrétním volbám a kandidátům.</p>
        <p>Kalkulačku můžete použít i v jiných oblastech než jen předvolební nástroj pro voliče.</p>
        <p>
          Zajímají vás podrobnosti nebo chcete připravit cenovou nabídku? Kontaktujte nás ještě dnes na{' '}
          <a href="mailto:hey@kalkulacka.one" className="underline hover:no-underline">
            hey@kalkulacka.one
          </a>{' '}
          nebo zavolejte autorovi Volební kalkulačky Michalu Škopovi na <a href="tel:+420735518529">+420 735 518 529</a>.
        </p>
      </section>
      <section className="grid gap-2">
        <h3 className="text-2xl font-bold">Naše vývojářské služby</h3>
        <ul className="list-disc pl-6">
          <li>Přizpůsobené otázky a možnosti odpovědí</li>
          <li>Integrace databáze kandidátů/stran</li>
          <li>Analýza výsledků a výpočty shody</li>
          <li>Responsivní webdesign a vývoj</li>
          <li>Hosting, údržba a podpora</li>
        </ul>
      </section>
      <section className="grid gap-2">
        <h3 className="text-2xl font-bold">Chcete si vyzkoušet kalkulačku?</h3>
        <p>
          Vyplňte si skutečnou volební kalkulačku a zjistěte shodu s politiky: 🇨🇿{' '}
          <a href="https://www.volebnikalkulacka.cz" className="font-bold underline hover:no-underline">
            Volební kalkulačka
          </a>
          !
        </p>
      </section>
    </section>
  );
}
