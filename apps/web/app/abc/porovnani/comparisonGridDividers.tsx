type ComparisonGridDividersProps = {
  organizations: any[];
};

export default function ComparisonGridDividers({
  organizations,
}: ComparisonGridDividersProps) {
  return (
    <>
      {/* // user divider line */}
      <div
        className="sticky left-[calc(1rem+1.12rem)] mt-2 h-full w-0 justify-self-center border-[0.125rem] !border-y-0 !border-l-0 border-dotted border-neutral-strong"
        style={{ gridArea: `1 / 1 / span 51` }}
      ></div>
      {/* // candidates divider lines */}
      {organizations.map((_, index) => (
        <div
          key={`Divider ${index}`}
          className="mt-2 h-full w-0 justify-self-center border-[0.125rem] !border-y-0 !border-l-0 border-dotted border-neutral"
          style={{ gridArea: `1 / ${(index + 1) * 2} / span 51` }}
        ></div>
      ))}
    </>
  );
}

// 1. Organizations type assertion error, why?
