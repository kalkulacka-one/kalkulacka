import { Description, Field, Fieldset, Label } from '@headlessui/react';
import { Input } from '@repo/design-system/components';
import { type SubmitHandler, useForm } from 'react-hook-form';

type EmailSubmissionFormProps = {
  email: string;
};

export function EmailSubmissionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailSubmissionFormProps>();

  const onSubmit: SubmitHandler<EmailSubmissionFormProps> = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <div className="ko:w-1/2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Fieldset className="ko:flex">
          <Field className="ko:relative">
            <Label className="ko:hidden">Jméno</Label>
            <Input
              type="email"
              placeholder="Zadejte e-mail"
              invalid={!!errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && <Description className="ko:absolute ko:-bottom-1.5 ko:right-4 ko:px-1 ko:bg-white ko:text-xs ko:text-red-500">{errors.email.message}</Description>}
          </Field>
          <button className="ko:w-fit ko:px-4  ko:border-black ko:rounded-2xl ko:rounded-tr-none ko:border-2 " type="submit">
            Submit
          </button>
        </Fieldset>
      </form>
    </div>
  );
}
