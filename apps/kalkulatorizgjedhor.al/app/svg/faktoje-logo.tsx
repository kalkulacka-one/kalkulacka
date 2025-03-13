import Image from "next/image";

export function FaktojeLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <Image
      src="/faktoje.png"
      alt="Faktoje"
      width={96}
      height={20}
      {...props}
    />
  );
} 