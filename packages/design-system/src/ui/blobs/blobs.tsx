import { RedBlob, BlueBlob } from "@repo/design-system/svg";

const Blobs = () => {
  return (
    // background div - needs top placement
    <div className="k1-w-full k1-h-full">
      {/* blobs div */}
      <div className="k1-w-full k1-h-full k1-fixed -k1-z-10">
        <BlueBlob className="k1-fixed k1-left-[5%] k1-top-[10%] k1-h-[80%] k1-blur-[120px]" />
        <RedBlob className="k1-fixed k1-left-[50%] k1-top-[20%] k1-h-[80%] k1-blur-[120px]" />
      </div>
    </div>
  );
};

export { Blobs };
