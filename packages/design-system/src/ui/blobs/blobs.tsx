import { RedBlob, BlueBlob } from "@repo/design-system/svg";

const Blobs = () => {
  return (
    // background div - needs top placement
    <div className="k1-absolute -k1-z-10 k1-h-full k1-w-full">
      {/* blobs div */}
      <div className="k1-fixed -k1-z-10 k1-h-full k1-w-full">
        <BlueBlob className="k1-fixed k1-left-[5%] k1-top-[10%] k1-h-4/5 k1-blur-[120px]" />
        <RedBlob className="k1-fixed k1-left-1/2 k1-top-[20%] k1-h-4/5 k1-blur-[120px]" />
      </div>
    </div>
  );
};

export { Blobs };
