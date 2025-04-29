import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';

type DistrictSelectionForm = {
  options: any[];
};

export function DistrictSelectionForm({ options }: DistrictSelectionForm) {
  const [selected, setSelected] = useState('');

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
    setValue('radio', value, {
      shouldDirty: true,
    });
  }

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="ko:w-full ko:px-4 ">
        <div className="ko:w-full">
          <RadioGroup value={selected} {...register('radio')} onChange={handleRadioChange} aria-label="District selection form">
            {options.map((option) => (
              <Field key={option.value}>
                <Label className="ko:group ko:flex ko:cursor-pointer ko:items-center ko:border-b ko:border-[#d7dad8] ko:px-4 ko:py-3">
                  <Radio as={Fragment} value={option.value}>
                    {({ checked }) => (
                      <div className="ko:group ko:flex">
                        <span
                          className={`
                            ko:flex ko:size-6 ko:items-center ko:justify-center ko:rounded-full ko:border-2 ko:border-[#565252] ko:group-hover:border-[#ADA6A6] ${checked ? 'ko:border-[#565252] ko:after:size-3 ko:after:bg-[#565252] ko:after:rounded-full ko:group-hover:after:bg-[#ADA6A6]' : ''} ko:bg-white`}
                        />
                        <span className="ko:ml-4 ko:text-[#565252]">{option.label}</span>
                      </div>
                    )}
                  </Radio>
                </Label>
              </Field>
            ))}
          </RadioGroup>
        </div>
      </div>
      <button className="ko:disabled:bg-gray-300 p-4 ko:bg-blue-400" type="submit" disabled={!isDirty}>
        Potvrdit a pokračovat
      </button>
    </form>
  );
}
