import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rólunk",
};

export default function Page() {
  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h1 className="ko:text-3xl ko:font-bold ko:mb-8">Rólunk</h1>

      <div className="ko:space-y-6">
        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Mi az a voksmonitor?</h2>
          <p className="ko:mb-3">TODO</p>
        </section>

        <section>
          <h2 className="ko:text-xl ko:font-semibold ko:mb-3">Mi az a K-Monitor?</h2>
          <p className="ko:mb-3">TODO</p>
        </section>
      </div>
    </div>
  );
}
