import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакт",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h1 className="ko:text-3xl ko:font-bold ko:mb-8">Контакт</h1>

      <div className="ko:space-y-6">
        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Контактирајте нè</h2>
          <p className="ko:mb-3">За сите прашања поврзани со Изборниот калкулатор, можете да нè контактирате на:</p>
          <p className="ko:mb-3">
            <a href="mailto:info@izborenkalkulator.mk" className="ko:text-primary ko:underline hover:ko:no-underline">
              info@izborenkalkulator.mk
            </a>
          </p>
        </section>

        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Оператор</h2>
          <p className="ko:mb-3">
            Изборниот калкулатор го управува здружението{" "}
            <a href="https://kohovolit.eu" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
              KohoVolit.eu
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
