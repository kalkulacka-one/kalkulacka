import { twMerge } from "tailwind-merge";
import { ClearIcon } from "../../Clear/ClearIcon";

type Props = {
  onClose: () => void;
};

function ClearButton({ onClose }: Props) {
  return (
    <button
      onClick={onClose}
      className={twMerge(
        "k1-flex k1-justify-center k1-items-center k1-w-4 k1-h-4 k1-min-w-4 -m-4",
        "k1-invisible peer-valid:k1-visible"
      )}
    >
      <ClearIcon />
    </button>
  );
}

export { ClearButton };
