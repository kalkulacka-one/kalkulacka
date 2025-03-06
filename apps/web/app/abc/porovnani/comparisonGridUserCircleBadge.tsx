export default function ComparisonGridUserCircleBadge() {
  return (
    <div
      className="sticky left-[calc(1rem-1.12rem)] z-50"
      style={{ gridArea: "1 / 1" }}
    >
      <div className="flex size-20 items-center justify-center rounded-full bg-primary p-2 text-neutral-strong">
        <p className="text-center text-xs">
          <strong>
            Moje <br />
            odpovědi
          </strong>
        </p>
      </div>
    </div>
  );
}
