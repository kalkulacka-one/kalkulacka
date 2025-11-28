import { Button, Description, Field, Input, Label } from "@repo/design-system/client";
import { type FormEvent, useState } from "react";

export function SubscribeForm() {
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSuccessfullySubmitted(false);

    if (!consent) {
      setError("Kérjük, fogadja el az adatkezelési tájékoztatót.");
      return;
    }

    if (!email || !email.includes("@")) {
      setError("Érvénytelen formátum");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          consent: true,
        }),
      });

      if (response.ok) {
        setEmail("");
        setConsent(false);
        setIsSuccessfullySubmitted(true);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "Hiba történt a feliratkozás során. Kérjük, próbálja újra.");
      }
    } catch (_error) {
      setError("Szerverhiba. Kérjük, próbálja újra később.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSuccessfullySubmitted ? (
        <div>Köszönjük a feliratkozást</div>
      ) : (
        <>
          <p className="text-center text-gray-700 font-semibold mb-4">Iratkozz fel a K-Monitor hírlevelére!</p>
          <form className="flex flex-col gap-4 items-center" onSubmit={onSubmit} noValidate>
            <Field disabled={isSubmitting}>
              <div className="grid grid-rows-2 gap-2 justify-center">
                <div className="flex gap-4 justify-center items-center">
                  <Label className="sr-only">Adja meg az e-mail címét</Label>
                  <Input
                    invalid={!!error && !consent}
                    autoComplete="email"
                    type="email"
                    placeholder="E-mail"
                    style={{ height: "48px", minHeight: "48px", backgroundColor: "white" }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Button disabled={isSubmitting || !consent} type="submit" variant="outline" color="neutral" style={{ backgroundColor: "white" }}>
                    {isSubmitting ? "Küldés" : "Küldés"}
                  </Button>
                </div>
                <div className="text-center space-y-1">
                  <label className="flex items-center justify-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} disabled={isSubmitting} />
                    <span>
                      Elolvastam és elfogadom a K-Monitor{" "}
                      <a href="https://adatbazis.k-monitor.hu/egyeb/adatkezelesi-tajekoztato" target="_blank" rel="noopener noreferrer" className="underline">
                        adatkezelési tájékoztatóját
                      </a>
                      .
                    </span>
                  </label>
                  {error && <Description className="text-xs text-[var(--ko-palette-secondary)]">{error}</Description>}
                </div>
              </div>
            </Field>
          </form>
        </>
      )}
    </>
  );
}
