import { Fieldset, Form, Legend, RadioGroup, RadioGroupItem } from "@repo/design-system/components";
import { useState } from "react";
import { useForm } from "react-hook-form";

type DistrictSelectionForm = {
  options: any[];
};

export function DistrictSelectionForm({ options }: DistrictSelectionForm) {
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
    console.log(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} aria-labelledby="district selection form">
      <Fieldset className="ko:w-full ko:px-4">
        <Legend className="ko:sr-only">Zvolte svůj kraj</Legend>
        <RadioGroup value={selected} {...register("radio")} onChange={handleRadioChange} aria-label="district options">
          {options.map((option) => (
            <RadioGroupItem key={option.value} value={option.value}>
              {option.label}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </Fieldset>
      <button className="ko:disabled:bg-gray-300 p-4 ko:bg-blue-400" type="submit" disabled={!isDirty}>
        Potvrdit a pokračovat
      </button>
    </Form>
  );
}
