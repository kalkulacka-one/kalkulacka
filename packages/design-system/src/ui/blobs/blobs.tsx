import { BlueBlob, RedBlob } from '@repo/design-system/svg';

export function Blobs() {
  return (
    <div className="ko:fixed -ko:z-[1] ko:h-full ko:w-full">
      <div className="ko:fixed -ko:z-10 ko:h-full ko:w-full">
        <BlueBlob className="ko:fixed ko:left-[5%] ko:top-[10%] ko:h-4/5 ko:blur-[120px]" />
        <RedBlob className="ko:fixed ko:left-1/2 ko:top-[20%] ko:h-4/5 ko:blur-[120px]" />
      </div>
    </div>
  );
}
