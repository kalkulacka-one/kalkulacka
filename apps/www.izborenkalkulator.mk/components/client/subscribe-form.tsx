// TODO [TENANT-014]: Extract hardcoded Macedonian strings to i18n

import { Button, Description, Field, Input, Label } from "@kalkulacka-one/design-system/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { subscribe } from "@/server/subscribe";

const subscribeSchema = z.object({
  email: z.string().email("Неважечки формат"),
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
      const response = await subscribe({ ...data, origin: "subscribe-form" });
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
        message: "Грешка при поврзување со серверот. Обидете се повторно подоцна.",
      });
      setFocus("email");
    }
  };

  return (
    <>
      {isSuccessfullySubmitted ? (
        <div>Ви благодариме за пријавата</div>
      ) : (
        <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field disabled={isSubmitting}>
            <div className="grid grid-rows-2 gap-2 justify-center">
              <div className="flex gap-4 justify-center items-center">
                <Label className="sr-only">Внесете ја вашата е-пошта</Label>
                <Input invalid={!!errors.email} autoComplete="email" type="email" placeholder="Е-пошта" style={{ height: "48px", minHeight: "48px" }} {...register("email")} />
                <Button disabled={isSubmitting} type="submit" variant="outline" color="neutral">
                  {isSubmitting ? "Испраќам" : "Испрати"}
                </Button>
              </div>
              <div className="text-center space-y-1">
                {errors.email && <Description className="text-xs text-[var(--ko-palette-secondary)]">{errors.email.message}</Description>}
                {errors.root?.serverError && <Description className="text-sm">⚠️ {errors.root?.serverError.message}</Description>}
                <p className="text-sm leading-[1.23]">Со испраќањето се согласувате да добивате новости за изборниот калкулатор.</p>
              </div>
            </div>
          </Field>
        </form>
      )}
    </>
  );
}
