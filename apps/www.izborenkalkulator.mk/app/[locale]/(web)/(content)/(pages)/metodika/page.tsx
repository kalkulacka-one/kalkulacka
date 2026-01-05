import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Методологија",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h1 className="ko:text-3xl ko:font-bold ko:mb-8">Методологија за избор и создавање прашања</h1>

      <div className="ko:space-y-8">
        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">1. Прашањето мора да се однесува на она што избраните политичари можат да влијаат.</h2>
          <p className="ko:text-gray-700">Прашањата треба да се однесуваат на теми кои се во надлежност на избраните претставници.</p>
        </section>

        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">2. На прашањето мора да може да се одговори и да и не, и не треба да наведува на одговор.</h2>
          <p className="ko:text-gray-700">При создавањето мора да можеме да замислиме луѓе кои избираат и двете варијанти на одговор.</p>
        </section>

        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">3. Прашањата треба да бидат важни</h2>
          <p className="ko:text-gray-700">Земаме предвид на што одреденото собрание/парламент троши најмногу јавни пари.</p>
        </section>

        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">4. Прашањето треба да биде што поконкретно</h2>
          <p className="ko:text-gray-700">Целта е одговорот да може да се провери по 4 години / на крајот од изборниот мандат.</p>
        </section>

        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">5. Прашањето мора да биде кратко и разбирливо</h2>
          <p className="ko:text-gray-700">Ги формулираме на максимум 20 зборови, евентуалниот опис го ограничуваме на 50 зборови.</p>
        </section>

        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">6. Прашањата со опис мора да имаат смисла и без него</h2>
          <p className="ko:text-gray-700">Голем број луѓе го читаат само самото прашање, не и неговиот опис.</p>
        </section>

        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">7. Претпочитаме прашања во позитивна форма</h2>
          <p className="ko:text-gray-700">Избегнуваме збунувачка двојна негација.</p>
        </section>

        <section className="ko:space-y-4">
          <h2 className="ko:text-2xl ko:font-bold ko:mb-4">8. Прашањето мора да биде напишано на лесно разбирлив јазик</h2>
          <p className="ko:text-gray-700">Пишуваме прашања така што различни општествени групи ќе ги разберат.</p>
        </section>
      </div>
    </div>
  );
}
