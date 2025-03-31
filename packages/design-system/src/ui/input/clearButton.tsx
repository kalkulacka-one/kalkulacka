import { ClearIcon } from '@repo/design-system/svg';
import { twMerge } from 'tailwind-merge';

type Props = {
  onClose: () => void;
};

function ClearButton({ onClose }: Props) {
  return (
    <button type="button" onClick={onClose} className={twMerge('ko:flex ko:justify-center ko:items-center ko:w-4 ko:h-4 ko:min-w-4 -m-4', 'ko:invisible ko:peer-valid:visible')}>
      <ClearIcon />
    </button>
  );
}

export { ClearButton };
