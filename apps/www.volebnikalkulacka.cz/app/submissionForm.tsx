import { Button } from "@repo/design-system/client";

export default function SubmissionForm() {
  return (
    <form>
      <div>
        <label className="hidden" htmlFor="email">
          Zadejte svůj email
        </label>
        <input name="email" type="email" placeholder="Zadejte svůj email" />
      </div>
      <Button variant="outline" color="primary">
        Odeslat
      </Button>
    </form>
  );
}
ž;
