export default function DistrictHeader() {
  return (
    <header className="sticky left-0 top-0 z-[100] grid grid-cols-[auto_1fr_auto] items-center gap-8 bg-transparent p-2 backdrop-blur-[6px] sm:p-8">
      <div className="col-start-2 justify-self-center sm:justify-self-start">
        <h2 className="text-3xl font-bold tracking-snug text-neutral-strong  sm:text-5xl">
          Zvolte svůj kraj
        </h2>
      </div>
    </header>
  );
}
