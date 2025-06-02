import { zodResolver } from "@hookform/resolvers/zod";
import { Description, Field, Fieldset, Form, Input, Label, Legend } from "@repo/design-system/components";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const subscribeBodySchema = z.object({
  email: z.string().email("Neplatný e-mail"),
});

type SubscribeBody = z.infer<typeof subscribeBodySchema>;

export function EmailSubmissionForm() {
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
    <div className="ko:w-1/2">
      <Form onSubmit={handleSubmit(onSubmit)} aria-labelledby="email submission form" noValidate>
        <Fieldset className="ko:flex ko:flex-col ko:justify-center ko:items-center ko:gap-4">
          <Legend className="ko:text-2xl ko:font-bold">Chcete vědět o nových kalkulačkách?</Legend>
          <p className="ko:text-center">Nechejte nám váš e-mail a my vám dáme vědět vždy, když spustíme novou kalkulačku.</p>
          <div className="ko:flex ko:gap-4">
            <Field className="ko:relative">
              <Label>E-mail</Label>
              {/* <Label className="ko:hidden">E-mail</Label> */}
              <Input type="email" placeholder="Zadejte e-mail" invalid={!!errors.email} {...register("email")} />
              {errors.email && <Description className="ko:absolute ko:-bottom-1.5 ko:right-4 ko:px-1 ko:bg-white ko:text-xs ko:text-red-500">{errors.email.message}</Description>}
            </Field>
            <button className="ko:w-fit ko:px-4  ko:border-black ko:rounded-2xl ko:rounded-tr-none ko:border-2 " type="submit">
              Submit
            </button>
          </div>
        </Fieldset>
        <p className="ko:mt-4 ko:text-center ko:text-xs">Odesláním souhlasíte se zasíláním novinek o volební kalkulačce.</p>
      </Form>
    </div>
  );
}

// 1. noValidate rhf valid approach?
// 2. fieldset + legend even with one-element based valid?
//    2a. legend sr only and heading
//    2b. legend as it is now
// 3. Typography tokens
// 4. Color tokens
