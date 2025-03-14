import CircleBadge from "./circleBadge";

export default function ComparisonGridUserCircleBadge() {
  return (
    <div
      className="sticky left-[calc(1rem-1.12rem)] top-[55px] z-30 p-2 sm:top-[110px]"
      style={{ gridArea: "1 / 1" }}
    >
      <CircleBadge fontSize="sm" color="primary">
        Moje odpovědi
      </CircleBadge>
    </div>
  );
}
