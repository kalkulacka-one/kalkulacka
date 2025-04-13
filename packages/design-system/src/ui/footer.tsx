import { LogoCeskoDigital, LogoKohoVolit } from '@repo/design-system/svg';

export function Footer() {
  return (
    <footer className="ko:max-w-[100vw] ko:sm:justify-self-start">
      <div className="ko:flex ko:flex-col ko:items-center ko:gap-4 ko:p-4 ko:sm:flex-row ko:sm:ko:justify-start ko:sm:p-8">
        <p className="ko:text-[0.812rem] ko:text-neutral ko:font-sans">Vytvořeno spoluprací neziskových organizací.</p>
        <a className="ko:flex ko:items-center ko:gap-2 after:ko:content-['_↗'] hover:ko:underline" href="https://www.facebook.com/KohoVolit.eu">
          <LogoKohoVolit className="ko:h-[28px] ko:w-[93px]" />
        </a>
        <a className="ko:flex ko:items-center ko:gap-2 ko:after:content-['_↗'] ko:hover:underline" href="https://cesko.digital/">
          <LogoCeskoDigital className="ko:h-[20px] ko:w-[96px]" />
        </a>
      </div>
    </footer>
  );
}
