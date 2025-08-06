export default async function Page() {
  return (
    <section className="max-w-2xl grid gap-8">
      <section className="grid gap-2">
        <h2 className="text-2xl font-medium">
          We build a voting advice app
          <br />
          to help you decide who to vote for
        </h2>
        <p>
          We are{" "}
          <a href="https://kohovolit.eu" className="underline hover:no-underline">
            KohoVolit.eu
          </a>
          , a non-profit that has been building voting advice applications for 15 years – helping people make informed voting decisions.
        </p>
        <p>
          In 2022, with the support of{" "}
          <a href="https://cesko.digital" className="underline hover:no-underline">
            Česko.Digital
          </a>
          , we launched a new generation of the{" "}
          <a href="https://www.volebnikalkulacka.cz" className="underline hover:no-underline">
            Czech voting advice app
          </a>{" "}
          with a fresh design. Now, we're entering the next stage: international expansion. We’ve already launched in 7 countries and more are on the way:
        </p>
        <ul className="list-none pl-4">
          <li>
            🇨🇿{" "}
            <a href="https://www.volebnikalkulacka.cz" className="font-bold underline hover:no-underline">
              Election Calculator
            </a>{" "}
            in Czechia
          </li>
          <li>
            🇸🇰{" "}
            <a href="https://www.volebnakalkulacka.sk" className="font-bold underline hover:no-underline">
              Election Calculator
            </a>{" "}
            in Slovakia
          </li>
          <li>
            🇭🇺{" "}
            <a href="https://www.voksmonitor.hu" className="font-bold underline hover:no-underline">
              Voksmonitor
            </a>{" "}
            in Hungary
          </li>
          <li>
            🇦🇹{" "}
            <a href="https://www.wahlrechner.at" className="font-bold underline hover:no-underline">
              Wahlrechner
            </a>{" "}
            in Austria
          </li>
          <li>
            🇷🇴{" "}
            <a href="https://www.testvot.eu" className="font-bold underline hover:no-underline">
              TestVot
            </a>{" "}
            in Romania
          </li>
          <li>
            🇽🇰{" "}
            <a href="https://www.kalkulatorizgjedhor.org" className="font-bold underline hover:no-underline">
              Kalkulatori zgjedhor
            </a>{" "}
            in Kosovo
          </li>
          <li>
            🇦🇱{" "}
            <a href="https://www.kalkulatorizgjedhor.al" className="font-bold underline hover:no-underline">
              Kalkulatori zgjedhor
            </a>{" "}
            in Albania
          </li>
          <li>
            🇲🇰{" "}
            <a href="https://www.glasomer.mk" className="font-bold underline hover:no-underline">
              Glasomer
            </a>{" "}
            in North Macedonia
            <span className="inline-flex items-center ml-2 px-2 py-0.25 rounded-full text-sm font-medium bg-gray-200">October 2025</span>
          </li>
        </ul>
        <p>
          Our voting advice applications are used by hundreds of thousands of voters each year. In 2023, over <strong>1 million people</strong> filled out just the presidential calculator in Czechia!
        </p>
      </section>
    </section>
  );
}
