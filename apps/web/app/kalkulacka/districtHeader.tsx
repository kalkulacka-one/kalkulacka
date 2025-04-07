export default function DistrictHeader() {
  return (
    <header className="z-[100] sticky top-0 grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 bg-transparent p-2 backdrop-blur-[6px] xs:p-4 sm:gap-8 sm:p-8">
      <div className="absolute justify-self-center sm:relative sm:mr-auto">
        {/* replace with typo compoment */}
        <h2 className="text-3xl font-bold tracking-snug text-neutral-strong sm:text-5xl">
          Zvolte svůj kraj
        </h2>
      </div>
    </header>
  );
}
