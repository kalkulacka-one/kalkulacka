import GuideInject from "./guideInject";
import getCalculatorFile from "../../../utils/getCalculatorFile";

export default async function GuideLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { district: string };
}) {
  const district = params.district;
  const data = await getCalculatorFile(district);
  const intro = data.intro;

  return (
    <>
      <GuideInject intro={intro} />
      {children}
    </>
  );
}
