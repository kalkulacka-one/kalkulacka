import Markdown from "react-markdown";

import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const { intro } = calculator;
  return (
    <div className="grid gap-2 max-w-prose text-slate-600">
      <p className="font-bold">
        A Voksmonitor célja, hogy a választók a politikával ne csak a pártok kommunikációján keresztül találkozzanak, hanem megismerjék a különböző politikai szereplők (esetünkben frakciók és
        képviselők) álláspontját a várospolitikai és szakmai kérdések széles körében. Az alkalmazás a válaszadóhoz rendeli azt a frakciót, illetve képviselőt, amelynek álláspontja a válaszok alapján
        legközelebb áll a kitöltő értékrendjéhez.
      </p>
      <p>
        A Voksmonitor a Fővárosi Közgyűlés 2024. október 4-i alakuló ülésétől 2025. május 28-ig tartó időszakból válogat 28 olyan ügyet, amelyekben a képviselők vitáztak, közösen gondolkodtak és
        döntést hoztak. A kérdéseket a K-Monitor munkatársai úgy állították össze, hogy lefedjék a Fővárosi Közgyűlés előtt tárgyalt döntési területek széles körét. Célunk az volt, hogy a kérdések
        tükrözzék a város működését érdemben befolyásoló és érthető dilemmákat – a közlekedéstől és lakhatástól kezdve a zöldfelületek kezelésén és átláthatóságon át a városi fejlesztésekig.
      </p>
      <p>
        A Voksmonitor a{" "}
        <a href="https://k-monitor.hu/" className="font-bold">
          K-Monitor
        </a>{" "}
        és a{" "}
        <a href="https://kohovolit.eu/" className="font-bold">
          KohoVolit.eu
        </a>{" "}
        közös projektje.
      </p>
    </div>
  );
}
