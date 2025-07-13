"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Description, Field, Input, Label } from "@repo/design-system/client";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const subscribeBodySchema = z.object({
  email: z.string().email("Neplatný e-mail"),
});

type SubscribeBody = z.infer<typeof subscribeBodySchema>;

export default function SubmissionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscribeBody>({
    defaultValues: { email: "" },
    resolver: zodResolver(subscribeBodySchema),
  });

  const onSubmit: SubmitHandler<SubscribeBody> = (data) => {
    console.log("Form submitted:", data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex gap-4 justify-center">
        <Field className="flex gap-4 relative">
          <Label className="hidden" htmlFor="email">
            Zadejte svůj email
          </Label>
          <Input type="email" placeholder="Zadejte svůj e-mail" {...register("email")} />
          {errors.email && <Description className="absolute -bottom-1.5 right-4 px-1 bg-white text-xs text-red-500">{errors.email.message}</Description>}
        </Field>
        <Button type="submit" variant="outline" color="primary">
          Odeslat
        </Button>
      </div>
      <p className="text-sm leading-[1.23]">Odesláním souhlasíte se zasíláním novinek o volební kalkulačce.</p>
    </form>
  );
}
