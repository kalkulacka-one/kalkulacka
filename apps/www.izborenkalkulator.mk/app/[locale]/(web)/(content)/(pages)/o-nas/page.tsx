import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "За нас",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h1 className="ko:text-3xl ko:font-bold ko:mb-8">За нас</h1>

      <div className="ko:space-y-6">
        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Што е Изборен калкулатор</h2>
          <p className="ko:mb-3">
            Изборен калкулатор® (на англиски Voting Advice Application, VAA) е онлајн алатка која ги споредува вашите политички ставови со ставовите на партиите, кандидатите или законодавците. Им
            помага на гласачите подобро да се ориентираат во програмите и да донесуваат одлуки врз основа на реални ставови.
          </p>
          <p>
            Од нивното создавање, калкулаторите станаа важен дел од демократските избори ширум светот – повеќе за историјата може да најдете на{" "}
            <a href="https://mk.wikipedia.org/wiki/Изборен_калкулатор" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
              Википедија
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Кој го создава</h2>
          <p className="ko:mb-3">
            Изборните калкулатори се развиваат и управуваат од здружението{" "}
            <a href="https://kohovolit.eu" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
              KohoVolit.eu
            </a>{" "}
            од 2006 година. Оттогаш создадовме повеќе од 150 калкулатори за сите видови избори – европски, претседателски, парламентарни, регионални и локални.
          </p>
          <p className="ko:mb-3">Нашите калкулатори ги користеа милиони гласачи. Соработуваме и со партнери во други европски земји.</p>
          <p>Нашите партнерски калкулатори:</p>
          <ul className="ko:list-disc ko:list-inside ko:space-y-1 ko:mt-2">
            <li>
              🇭🇺{" "}
              <a href="https://www.voksmonitor.hu" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Voksmonitor
              </a>{" "}
              во Унгарија
            </li>
            <li>
              🇦🇹{" "}
              <a href="https://www.wahlrechner.at" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Wahlrechner
              </a>{" "}
              во Австрија
            </li>
            <li>
              🇸🇰{" "}
              <a href="https://www.volebnakalkulacka.sk" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Volebná kalkulačka
              </a>{" "}
              во Словачка
            </li>
            <li>
              🇨🇿{" "}
              <a href="https://www.volebnikalkulacka.cz" className="ko:text-primary ko:underline hover:ko:no-underline" target="_blank" rel="noopener noreferrer">
                Volební kalkulačka
              </a>{" "}
              во Чешка
            </li>
          </ul>
        </section>

        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Како ја пресметуваме совпаѓањето</h2>
          <p className="ko:mb-3">
            Прашање на кое не одговорите „Да" или „Не" не се вклучува во пресметката. Ако одговорите „Да", партиите или кандидатите кои исто така одговориле „Да" добиваат еден поен. Оние кои
            одговориле „Не" губат еден поен.
          </p>
          <p className="ko:mb-3">
            Потоа, на секоја партија или кандидат се собираат поените за сите прашања на кои одговоривте „Да" или „Не", а резултатот се дели со бројот на такви прашања. Така се добива совпаѓање во
            опсег од -100% до 100%. За поголема јасност, совпаѓањето се претвора во опсег од 0% до 100%.
          </p>
        </section>

        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Тим</h2>
          <div className="ko:grid ko:grid-cols-1 ko:md:grid-cols-2 ko:gap-4">
            <div className="ko:space-y-3">
              <div>
                <a href="https://www.linkedin.com/in/skopmichal/" className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium" target="_blank" rel="noopener noreferrer">
                  Michal Škop
                </a>
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">KohoVolit.eu</span>
              </div>
              <div>
                <a href="https://www.linkedin.com/in/krystofk/" className="ko:text-primary ko:underline hover:ko:no-underline ko:font-medium" target="_blank" rel="noopener noreferrer">
                  Kryštof Korb
                </a>
                <span className="ko:text-sm ko:text-gray-600 ko:ml-2">Tech Lead</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
