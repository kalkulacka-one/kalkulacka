import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Description, Field, Input, Label } from "@repo/design-system/client";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { subscribe } from "../../server/subscribe";

const subscribeSchema = z.object({
  email: z.string().email("Neplatný formát"),
});

type SubscribeData = z.infer<typeof subscribeSchema>;

export function SubscribeForm() {
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<SubscribeData>({
    resolver: zodResolver(subscribeSchema),
  });

  const onSubmit: SubmitHandler<SubscribeData> = async (data) => {
    setIsSuccessfullySubmitted(false);
    try {
      const response = await subscribe(data);
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
        <div>Děkujeme za vyplnění</div>
      ) : (
        <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field disabled={isSubmitting}>
            <div className="grid grid-rows-2 gap-2 justify-center">
              <div className="flex gap-4 justify-center">
                <Label className="sr-only hidden">Zadejte váš email</Label>
                <Input invalid={errors.email ? true : undefined} autoComplete="email" type="email" placeholder="E-mail" {...register("email")} />
                <Button disabled={isSubmitting} type="submit" variant="outline" color="neutral">
                  {isSubmitting ? "Odesílám" : "Odeslat"}
                </Button>
              </div>
              <div className="text-center space-y-1">
                {errors.email && <Description className="text-xs text-[var(--ko-palette-secondary)]">{errors.email.message}</Description>}
                {errors.root?.serverError && <Description className="text-sm">⚠️ {errors.root?.serverError.message}</Description>}
                <p className="text-sm leading-[1.23]">Odesláním souhlasíte se zasíláním novinek o volební kalkulačce.</p>
              </div>
            </div>
          </Field>
        </form>
      )}
    </>
  );
}
