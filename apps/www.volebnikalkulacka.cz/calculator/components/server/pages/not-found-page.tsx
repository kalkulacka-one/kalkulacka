import { Button } from "@repo/design-system/client";

export type NotFoundPage = {
  onBackClick: () => void;
};

export function NotFoundPage({ onBackClick }: NotFoundPage) {
  return (
    <div className="flex h-dvh w-dvw justify-center items-center">
      <div className="flex flex-col gap-4">
        <h1 className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-2xl md:text-3xl">Něco se špatně spočítalo...</h1>
        <p className="text-slate-500">Vámi požadovaná stránka není k dispozici</p>
        <Button variant="outline" color="neutral" onClick={onBackClick}>
          Zpátky na domovskou stránku
        </Button>
      </div>
    </div>
  );
}
