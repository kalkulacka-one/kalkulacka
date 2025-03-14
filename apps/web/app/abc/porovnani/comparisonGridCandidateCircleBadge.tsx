import CircleBadge from "./circleBadge";

type ComparisonGridCandidateCircleBadgeProps = {
  shortName: string;
  gridCol: number;
};

export default function ComparisonGridCandidateCircleBadge({
  shortName,
  gridCol,
}: ComparisonGridCandidateCircleBadgeProps) {
  return (
    <>
      <div
        key={`${shortName} badge`}
        className="sticky top-[55px] z-10 p-2 sm:top-[110px]"
        style={{ gridArea: `1 / ${gridCol}` }}
      >
        <CircleBadge fontSize="xs" color="black">
          {shortName}
        </CircleBadge>
      </div>
    </>
  );
}
