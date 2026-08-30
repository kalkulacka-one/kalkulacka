import { Button, Description, Field, Input, Label } from "@kalkulacka-one/design-system/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { campaignCities } from "@/config/campaign-cities";
import { citySignup } from "@/server/city-signup";

import { DonateCta } from "./donate-cta";

const citySignupSchema = z.object({
  email: z.string().email("Neplatný formát"),
  city: z.enum(campaignCities, { message: "Vyberte město ze seznamu" }),
});

type CitySignupData = z.infer<typeof citySignupSchema>;

export function CitySignupForm() {
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CitySignupData>({
    resolver: zodResolver(citySignupSchema),
  });

  const onSubmit: SubmitHandler<CitySignupData> = async (data) => {
    setIsSuccessfullySubmitted(false);
    try {
      const response = await citySignup(data);
      if (response.success) {
        reset();
        setIsSuccessfullySubmitted(true);
      } else {
        setError("root.serverError", {
          message: response.error,
        });
        setFocus("email");
      }
    } catch (_error) {
      setError("root.serverError", {
        message: "Chyba při připojení k serveru. Zkuste to prosím později.",
      });
      setFocus("email");
    }
  };

  return (
    <>
      {isSuccessfullySubmitted ? (
        <div className="grid gap-4">
          <p className="text-slate-700">Děkujeme! Ozveme se vám.</p>
          <DonateCta
            source="city-signup-thanks"
            heading="Pomozte i příspěvkem"
            description="Kalkulačku pro vaše město připravíme společně. Váš příspěvek platí sběr otázek, oslovení kandidátů i provoz webu."
          />
        </div>
      ) : (
        <form className="flex flex-col gap-4 items-stretch" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field disabled={isSubmitting}>
            <div className="grid gap-3">
              <select
                defaultValue=""
                aria-label="Vyberte vaše město"
                className="w-full border border-slate-400 rounded-2xl rounded-br-none px-4 bg-white text-base disabled:text-slate-300 disabled:border-slate-200"
                style={{ height: "48px", minHeight: "48px" }}
                disabled={isSubmitting}
                {...register("city")}
              >
                <option value="" disabled>
                  Vyberte město
                </option>
                {campaignCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <Label className="sr-only">Zadejte váš email</Label>
              <Input invalid={!!errors.email} autoComplete="email" type="email" placeholder="E-mail" style={{ height: "48px", minHeight: "48px" }} {...register("email")} />
              <Button disabled={isSubmitting} type="submit" variant="fill" color="neutral">
                {isSubmitting ? "Odesílám" : "Chci pomoct"}
              </Button>
              <div className="text-center space-y-1">
                {errors.city && <Description className="text-xs text-[var(--ko-palette-secondary)]">{errors.city.message}</Description>}
                {errors.email && <Description className="text-xs text-[var(--ko-palette-secondary)]">{errors.email.message}</Description>}
                {errors.root?.serverError && <Description className="text-sm">⚠️ {errors.root?.serverError.message}</Description>}
                <p className="text-xs text-slate-500">Odesláním souhlasíte, že se vám ozveme ohledně kalkulačky pro vaše město.</p>
              </div>
            </div>
          </Field>
        </form>
      )}
    </>
  );
}
