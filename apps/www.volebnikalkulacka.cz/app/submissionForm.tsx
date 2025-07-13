import { Button, Field, Input, Label } from "@repo/design-system/client";

export default function SubmissionForm() {
  return (
    <form className="flex flex-col gap-4">
      <div className="flex gap-4 justify-center">
        <Field className="ko:flex ko:gap-4">
          <Label className="hidden" htmlFor="email">
            Zadejte svůj email
          </Label>
          <Input type="email" placeholder="Zadejte svůj e-mail" />
        </Field>
        <Button type="submit" variant="outline" color="primary">
          Odeslat
        </Button>
      </div>
      <p className="ko:text-sm ko:leading-[1.23] ko:opacity-60">Odesláním souhlasíte se zasíláním novinek o volební kalkulačce.</p>
    </form>
  );
}
