import { Card, ProgressBar } from "@repo/design-system/ui";

type Props = {
  cardNumber?: number;
  isFirst?: boolean;
  results?: any;
};

export default function ResultCard({ cardNumber, isFirst, results }: Props) {
  const { partyShort, partyLong, result } = results;

  return (
    <Card
      shadow="default"
      corner="topLeft"
      className="flex max-w-full items-center gap-2 p-customMobile sm:p-customDesktop"
    >
      {/* avatar wrapper */}
      {/* fix fixed width here */}
      <div className="flex w-20 items-center">
        {/* circle */}
        <div
          className={` ${isFirst ? "size-10 bg-primary-strong min-[700px]:size-[calc(3*1.5rem)]" : "size-[calc(2*1rem)] bg-primary min-[700px]:size-14"} flex items-center justify-center rounded-full`}
        >
          <p
            className={`${isFirst ? "text-base text-white min-[700px]:text-xl" : "text-sm text-neutral min-[700px]:text-base"} font-semibold min-[700px]:text-xl`}
          >
            {cardNumber}.
          </p>
        </div>
      </div>
      {/* party, percents wrapper */}
      <div className="flex w-full flex-col gap-4">
        {/* name short */}
        <div>
          <strong>
            <p
              className={`${isFirst ? "text-base min-[700px]:text-3xl " : "text-sm min-[700px]:text-base"} font-bold text-neutral  min-[700px]:text-black`}
            >
              {partyShort}
            </p>
          </strong>
        </div>
        {/* progress bar */}
        <ProgressBar progress={result} />
        {/* party wrapper */}
        <div>
          <p className="text-neutral">{partyLong}</p>
        </div>
      </div>

      {/* percent wrapper */}
      <p
        className={`${isFirst ? "text-3xl min-[700px]:text-5xl " : "text-base min-[700px]:text-3xl"} ml-auto  font-bold text-neutral-strong`}
      >
        {result}%
      </p>
    </Card>
  );
}

// TODO:
// 1. Fix custom paddings behaviour on card (desktop)
// 2. Simplify structure (toggle behaviour content order), if possible
// 3. Percentage problem fix!
