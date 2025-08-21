import ClientWidget from "./clientWidget";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const theme = searchParams.theme ?? "default";
  const widget = searchParams.widget ?? "default";
  const kalkulacka = searchParams.kalkulacka ?? "default";
  return (
    <div className="bg-amber-300">
      Embed Page
      <div className="bg-red-300 p-5">
        Embedded content
        <p>{widget === "a" && "Widget a"}</p>
        <p>{widget === "b" && "Widget b"}</p>
        {kalkulacka === "true" && <ClientWidget />}
      </div>
    </div>
  );
}
