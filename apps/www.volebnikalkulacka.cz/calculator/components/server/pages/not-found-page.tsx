import { Button } from "@repo/design-system/client";
export default function NotFoundPage() {
  return (
    <div className="flex h-dvh w-dvw justify-center items-center">
      <div className="flex flex-col gap-4">
        <h2 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Něco se špatně spočítalo...</h2>
        <span className="text-slate-500">Vámi požadovaná stránka není k dispozici</span>
        <Button variant="outline" color="neutral">
          Zpátky na domovskou stránku
        </Button>
      </div>
    </div>
  );
}
