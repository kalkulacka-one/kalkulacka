import { Logo } from "@repo/design-system/svg";
// fix imports after project strucuture merge
import { EnvelopeIcon } from "../../icons/envelopeIcon";
import { TelephoneIcon } from "../../icons/telephoneIcon";

export function Footer() {
  return (
    <footer className="k1-py-10">
      {/* content */}
      <div className="k1-px-4">
        {/* grid wrapper */}
        <div className="k1-grid k1-grid-cols-2 md:k1-grid-cols-4">
          {/* col wrapper start */}
          <div className="k1-flex k1-flex-col k1-gap-6">
            {/* logo wrapper start */}
            <div className="k1-flex k1-w-full k1-items-center k1-gap-2">
              <Logo className="k1-h-5 k1-w-[5.953rem]" />
              <div className="k1-text-sm k1-font-bold k1-uppercase">
                Volební kalkulačka
              </div>
            </div>
            <p className="k1-text-sm k1-text-neutral">
              Volební kalkulačka je nestranným pomocníkem v rozhodování Koho
              Volit.
            </p>
            <a
              className="after:k1-content-['_↗']"
              href="https://www.facebook.com/KohoVolit.eu"
            >
              <img
                className="k1-inline-block"
                src="https://www.volebnikalkulacka.cz/images/fb.svg"
              />
            </a>
          </div>
          {/* logo wrapper end */}
          {/* col wrapper start */}
          <div className="k1-flex k1-flex-col k1-gap-6">
            <h5 className="k1-text-sm k1-font-bold">O volební kalkulačce</h5>
            <div className="k1-flex k1-flex-col k1-items-start k1-gap-2 k1-text-sm k1-text-neutral">
              <a href="/">O volební kalkulačce</a>
              <a href="/">Metodika tvorby otázek</a>
            </div>
          </div>
          {/* col wrapper end */}
          {/* col wrapper start */}
          <div className="k1-flex k1-flex-col k1-gap-6">
            <h5 className="k1-text-sm k1-font-bold">Odkazy</h5>
            <div className="k1-flex k1-flex-col k1-items-start k1-gap-2 k1-text-sm k1-text-neutral">
              <a href="/">Ochrana dat</a>
              <a className="after:k1-content-['_↗']" href="/">
                Podpořit kalkulačku
              </a>
              <a href="/">Můj profil</a>
            </div>
          </div>
          {/* col wrapper end */}
          {/* col wrapper start */}
          <div className="k1-flex k1-flex-col k1-gap-6">
            <h5 className="k1-text-sm k1-font-bold">Kontakt</h5>
            <div className="k1-flex k1-flex-col k1-items-start k1-gap-2 k1-text-sm k1-text-neutral">
              <div className="k1-flex k1-items-center k1-gap-4">
                <EnvelopeIcon className="k1-size-6" />
                <a href="/">info@kohovolit.eu</a>
              </div>
              <div className="k1-flex k1-items-center k1-gap-4">
                <TelephoneIcon className="k1-size-6" />
                <a href="/">+420 735 518 529</a>{" "}
              </div>
            </div>
          </div>
          {/* col wrapper end */}
        </div>
      </div>
      {/* bottom wrapper */}
      <div className="k1-mt-8 k1-flex k1-items-center k1-justify-start k1-gap-4">
        <p className="k1-text-sm k1-text-neutral">
          Vytvořeno spoluprací neziskových organizací.
        </p>
        <a
          className="after:k1-content-['_↗']"
          href="https://www.facebook.com/KohoVolit.eu"
        >
          <img
            className="k1-inline-block"
            src="https://www.volebnikalkulacka.cz/images/logo-kohovolit.svg"
          />
        </a>
        <a
          className="after:k1-content-['_↗']"
          href="https://www.facebook.com/KohoVolit.eu"
        >
          <img
            className="k1-inline-block k1-h-5"
            src="https://www.volebnikalkulacka.cz/images/logo-cd.svg"
          />
        </a>
      </div>
    </footer>
  );
}
