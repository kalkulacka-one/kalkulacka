import { LogoKohoVolit, LogoCeskoDigital } from "@repo/design-system/svg";

export function Footer() {
  return (
    <footer className="k1-max-w-[100vw] k1-self-end k1-justify-self-center md:k1-justify-self-start">
      <div className="k1-flex k1-flex-col k1-items-center k1-gap-4 k1-p-4 sm:k1-flex-row sm:k1-justify-start sm:k1-p-8">
        <p className="k1-text-sm k1-text-neutral">
          Vytvořeno spoluprací neziskových organizací.
        </p>
        <a
          className="k1-flex k1-items-center k1-gap-2 after:k1-content-['_↗'] hover:k1-underline"
          href="https://www.facebook.com/KohoVolit.eu"
        >
          <LogoKohoVolit className="k1-h-[28px] k1-w-[93px]" />
        </a>
        <a
          className="k1-flex k1-items-center k1-gap-2 after:k1-content-['_↗'] hover:k1-underline"
          href="https://cesko.digital/"
        >
          <LogoCeskoDigital className="k1-h-[20px] k1-w-[96px]" />
        </a>
      </div>
    </footer>
  );
}
