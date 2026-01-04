import { Card } from "@kalkulacka-one/design-system/server";

export default function Page() {
  return (
    <div className="relative bg-slate-50 z-0">
      {/* Background dashed lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="mx-auto h-full max-w-7xl px-6 sm:px-8">
          <div className="relative h-full grid grid-cols-6 gap-x-6">
            {Array.from({ length: 6 }, (_, i) => i).map((columnIndex) => (
              <div key={`bg-grid-col-${columnIndex}`} className="relative">
                <div className="absolute inset-y-0 left-0 border-l-2 border-dashed border-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-12 md:pt-16 lg:pt-20 pb-12 md:pb-16">
        {/* Welcome message */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 gap-8 items-stretch max-w-2xl">
          <Card shadow="hard" border corner="topLeft" className="bg-white h-full !border-slate-200">
            <div className="p-6 md:p-8 h-full flex flex-col">
              <h2 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Добредојдовте на Изборен калкулатор</h2>
              <p className="mt-4 text-slate-500">
                Изборниот калкулатор ви помага да ги споредите вашите политички ставови со ставовите на партиите и кандидатите. Наскоро ќе биде достапен првиот калкулатор за Северна Македонија.
              </p>
              <p className="mt-4 text-slate-500">
                За повеќе информации, следете нè или контактирајте нè на{" "}
                <a href="mailto:info@izborenkalkulator.mk" className="text-blue-600 hover:text-blue-800 underline">
                  info@izborenkalkulator.mk
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
