import { Button } from "@repo/design-system/ui";
import { useForm } from "react-hook-form";
import { Label, Radio, RadioGroup } from "@headlessui/react";
import { useState } from "react";

type DistrictSelectionFormProps<Options = any[]> = {
  options: Options;
  formLabel?: string;
};

export function DistrictSelectionForm({
  options,
  formLabel,
}: DistrictSelectionFormProps) {
  const [selected, setSelected] = useState("");
  const {
    handleSubmit,
    register,
    formState: { isDirty },
    setValue,
  } = useForm({
    defaultValues: {
      radio: selected,
    },
  });

  function handleRadioChange(value: string) {
    setSelected(value);
    setValue("radio", value, {
      shouldDirty: true,
    });
  }

  const onSubmit = (data: any) => {
    // add page route later
    console.log(data);
  };

  return (
    <div className="k1-grid k1-grid-cols-[1fr] k1-justify-center k1-p-4 min-[701px]:k1-grid-cols-[minmax(24em,max-content)]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioGroup
          value={selected}
          {...register("radio")}
          onChange={handleRadioChange}
          aria-label={formLabel}
        >
          {options.map((option) => (
            <Label
              key={option.value}
              htmlFor={option.value}
              className="k1-group k1-flex k1-cursor-pointer k1-items-center k1-border-b k1-border-neutral k1-px-4 k1-py-3"
            >
              <Radio
                id={option.value}
                value={option.value}
                className="k1-group k1-relative k1-flex k1-size-6 k1-items-center k1-justify-center k1-rounded-full k1-border-2 k1-border-neutral-strong k1-bg-white"
              >
                <span className="k1-invisible k1-absolute k1-size-3 k1-rounded-full k1-bg-[#565252] group-hover:k1-bg-[#ADA6A6] group-data-[checked]:k1-visible" />
              </Radio>
              <span className="k1-ml-4 k1-text-neutral">{option.label}</span>
            </Label>
          ))}
        </RadioGroup>
        <div className="k1-sticky k1-bottom-0 k1-flex k1-w-full k1-justify-center k1-justify-self-center k1-bg-white k1-p-4  sm:k1-bg-transparent">
          <Button
            type="submit"
            kind="filled"
            size="default"
            color="primary"
            fitContent
            disabled={!isDirty ? true : false}
          >
            Potvrdit a pokračovat
          </Button>
        </div>
      </form>
    </div>
  );
}
