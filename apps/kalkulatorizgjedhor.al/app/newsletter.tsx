"use client";
import { EnvelopeIcon } from "@repo/design-system/demo";
import { Button, InputField } from "@repo/design-system/ui";
import { SubscribeBody, subscribeBodySchema } from "../src/types/subscribe";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscribe } from "../src/server/subscribe";
import { useState } from "react";

export default function Newsletter() {
  const {
    register,
    reset,
    handleSubmit,
    formState: {
      errors,
      isSubmitted,
      isSubmitSuccessful,
      isSubmitting,
      isDirty,
    },
  } = useForm<SubscribeBody>({
    defaultValues: { email: "" },
    resolver: zodResolver(subscribeBodySchema),
  });

  function renderErrorMessage(isDirty: boolean, errorMessage?: string) {
    switch (isDirty) {
      case true: {
        return errorMessage;
      }
      case false: {
        return "Pole nesmí být prázdné";
      }
    }
  }

  const [responserMessage, setResponseMessage] = useState("");

  const onSubmit: SubmitHandler<SubscribeBody> = async (data) => {
    try {
      const response = await subscribe(data);
      if (response.success) {
        // console.log("Subscribed");
        setResponseMessage("Faleminderit për plotësimin!");
      } else if (response.error) {
        // console.log("Error", response.error.message);
        setResponseMessage("Ky email tashmë ndodhet në bazën e të dhënave.");
      }
    } catch (error) {
      console.log("Unexpected error", error);
    }
    reset();
  };

  return (
    <section
      id="subscribe"
      className="flex flex-col items-center justify-center"
    >
      {isSubmitted && isSubmitSuccessful ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <span className="text-3xl font-bold leading-[1.03] tracking-snug text-neutral-strong">
            {responserMessage}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-5xl font-bold leading-[1.03] tracking-snug text-neutral-strong">
            Ne po përgatisim Kalkulatorin Zgjedhor, mjetin e parë të këtij lloji për Shqipërinë – mos e humbisni!
          </h2>
          <p className="text-sm leading-[1.23] text-neutral">
            Lini emailin tuaj dhe bëhuni ndër të parët që do të mësojnë për lançimin e tij.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex w-fit flex-wrap justify-center gap-4">
              {/* <input type="text" placeholder="zadejte e-mail" /> */}
              {/* field wrapper */}
              <div className="flex-1">
                <InputField
                  {...register("email")}
                  icon={EnvelopeIcon}
                  placeholder="E-mail"
                  // string | undefined?
                  error={errors.email?.message ? true : false}
                  errorMessage={renderErrorMessage(
                    isDirty,
                    errors.email?.message,
                  )}
                />
              </div>
              <div>
                <Button
                  disabled={isSubmitting ? true : false}
                  type="submit"
                  color="primary"
                  fitContent
                  kind="outline"
                >
                  Dërgo
                </Button>
              </div>
            </div>
          </form>
          <p className="text-xs leading-[1.23] text-neutral">
            Duke e dërguar, pranoni të merrni lajme rreth Kalkulatorit Zgjedhor.
          </p>
        </div>
      )}
    </section>
  );
}

// 1. fix input name label
// 2. isLoading + gui (server)
// 3. success gui?
// 4. error message!
// 5. error message icon
// 6. envelope icon colors
// 7. ...
