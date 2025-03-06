import { YesIcon, NoIcon, NeutralIcon } from "@repo/design-system/icons";

type RenderAnswerIconProps = {
  answerType: boolean;
};

export default function renderAnswerIcon({
  answerType,
}: RenderAnswerIconProps) {
  switch (answerType) {
    case true: {
      return (
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-primary-strong">
          <YesIcon className="size-6 text-white" />
        </div>
      );
    }
    case false: {
      return (
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-secondary-strong">
          <NoIcon className="size-6 text-white" />
        </div>
      );
    }
    case null: {
      return (
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-black">
          <NeutralIcon className="size-6 text-white" />
        </div>
      );
    }
  }
}
