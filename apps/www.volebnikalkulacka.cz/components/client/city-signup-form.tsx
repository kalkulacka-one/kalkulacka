import { Button, Description, Field, Input, Label } from "@kalkulacka-one/design-system/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { subscribe } from "@/server/subscribe";

const joinUsSchema = z.object({
  email: z.string().email("Neplatný formát"),
});

type JoinUsData = z.infer<typeof joinUsSchema>;

export function JoinUsForm() {
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<JoinUsData>({
    resolver: zodResolver(joinUsSchema),
  });

  const onSubmit: SubmitHandler<JoinUsData> = async (data) => {
    setIsSuccessfullySubmitted(false);
    try {
      const response = await subscribe({ ...data, origin: "join-us-form" });
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
        <div>Děkujeme! Ozveme se vám.</div>
      ) : (
        <form className="flex flex-col gap-4 items-stretch" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field disabled={isSubmitting}>
            <div className="grid gap-3">
              <Label className="sr-only">Zadejte váš email</Label>
              <Input invalid={!!errors.email} autoComplete="email" type="email" placeholder="E-mail" {...register("email")} />
              <Button disabled={isSubmitting} type="submit" variant="fill" color="neutral">
                {isSubmitting ? "Odesílám" : "Chci se zapojit"}
              </Button>
              <div className="text-center space-y-1">
                {errors.email && <Description className="text-xs text-[var(--ko-palette-secondary)]">{errors.email.message}</Description>}
                {errors.root?.serverError && <Description className="text-sm">⚠️ {errors.root?.serverError.message}</Description>}
                <p className="text-xs text-slate-500">Odesláním souhlasíte, že se vám ozveme ohledně zapojení do Volební kalkulačky.</p>
              </div>
            </div>
          </Field>
        </form>
      )}
    </>
  );
}
