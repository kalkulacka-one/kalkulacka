import { Button, Field, Input, Label } from "@repo/design-system/client";

export default function SubmissionForm() {
  return (
    <form>
      <Field className="ko:flex ko:flex-col ko:items-center ko:gap-4">
        <div className="ko:flex ko:gap-4">
          <Label className="ko:hidden" htmlFor="email">
            Zadejte svůj email
          </Label>
          <Input type="email" placeholder="Zadejte svůj e-mail" />
          <Button variant="outline" color="primary">
            Odeslat
          </Button>
        </div>
        <p className="ko:text-sm ko:leading-[1.23] ko:opacity-60">Odesláním souhlasíte se zasíláním novinek o volební kalkulačce.</p>
      </Field>
    </form>
  );
}
