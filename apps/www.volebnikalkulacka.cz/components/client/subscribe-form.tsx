import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Description, Field, Input, Label } from "@repo/design-system/client";
import { type SubmitHandler, useForm } from "react-hook-form";

import { subscribe } from "../../server/subscribe";
import { type SubscribeBody, subscribeBodySchema } from "../../types/subscribe";

export function SubscribeForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setFocus,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<SubscribeBody>({
    resolver: zodResolver(subscribeBodySchema),
  });

  const onSubmit: SubmitHandler<SubscribeBody> = async (data) => {
    try {
      const response = await subscribe(data);
      if (response.success) {
        reset();
      } else if (response.error.code === "duplicate-email") {
      }
    } catch (error) {
      setError("root.serverError", {
        type: "400",
        message: `Chyba na serveru: ${error}`,
      });
      setFocus("email");
    }
  };

  return (
    <>
      {isSubmitSuccessful ? (
        <div>Děkujeme za vyplnění</div>
      ) : (
        <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit(onSubmit)} noValidate>
          <p className="text-center text-sm">Zjistěte, kdo se s vámi shodne na klíčových tématech. Nechte nám tu svůj e-mail a získejte přístup k nové kalkulačce mezi prvními.</p>
          <div className="flex gap-4 justify-center">
            <Field className="flex gap-4 relative" disabled={isSubmitting}>
              <Label className="sr-only hidden">Zadejte váš email</Label>
              <Input invalid={errors.email ? true : undefined} autoComplete="email" type="email" placeholder="E-mail" {...register("email")} />
              {errors.email && <Description className="absolute -bottom-1.5 right-4 px-1 bg-white text-xs text-[var(--ko-palette-secondary)]">{errors.email.message}</Description>}
            </Field>
            <Button disabled={isSubmitting} type="submit" variant="outline" color="primary">
              {isSubmitting ? "Odesílám" : "Odeslat"}
            </Button>
            {errors.root?.serverError && <Description className="text-sm">⚠️ {errors.root?.serverError.message}</Description>}
          </div>
          <p className="text-sm leading-[1.23]">Odesláním souhlasíte se zasíláním novinek o volební kalkulačce.</p>
        </form>
      )}
    </>
  );
}
