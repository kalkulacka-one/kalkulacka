import { Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { useState } from 'react';

const plans = ['Startup', 'Business', 'Enterprise'];

export function RadioGroupComp() {
  const [selected, setSelected] = useState(plans[0]);

  return (
    <div className="ko:w-full ko:px-4 ">
      <div className="ko:w-full">
        <RadioGroup value={selected} onChange={setSelected} aria-label="Server size">
          {plans.map((plan) => (
            <Field key={plan}>
              <Label className="ko:flex ko:cursor-pointer ko:items-center ko:border-b ko:border-neutral ko:px-4 ko:py-3 ko:w-full">
                <Radio
                  value={plan}
                  className="ko:z-20 ko:group ko:relative ko:flex ko:size-6 ko:items-center ko:justify-center ko:rounded-full ko:border-2 ko:border-neutral-strong ko:bg-white ko:group-data-[hover]:border-[#ADA6A6]"
                >
                  <span className="ko:invisible ko:absolute ko:size-[0.6rem] ko:rounded-full ko:bg-[#565252] ko:group-data-[hover]:bg-[#ADA6A6] ko:group-data-[checked]:visible" />
                </Radio>
                <span className="ko:ml-4 ko:text-neutral">{plan}</span>
              </Label>
            </Field>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
