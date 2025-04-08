import { Input as InputPrimitive, type InputProps as InputPrimitiveProps } from '@headlessui/react';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { ClearButton } from './clearButton';

const Input = forwardRef<
  React.ElementRef<typeof InputPrimitive>,
  InputPrimitiveProps & { className?: string; showClearButton?: boolean } // InputProps has more variable className, but we need string
>(({ className, showClearButton, ...props }, ref) => {
  // We need to get object ref we're passing to check if the input is empty
  const inputRef = useRef<HTMLInputElement | null>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  // Add a data attribute based on the input value. This is for peer styling.
  const updateDataEmpty = () => {
    if (inputRef.current) {
      const isEmpty = inputRef.current.value === '';
      inputRef.current.setAttribute('data-empty', isEmpty.toString());
    }
  };

  // Override the onChange event to update data-empty attribute
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(event);
    }
    updateDataEmpty();
  };

  // Clear the input field and fire the onChange event
  const clearHandler = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      handleChange({
        target: inputRef.current,
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <>
      <InputPrimitive ref={inputRef} className={twMerge('peer, ko:flex-grow', className)} onChange={handleChange} {...props} />
      {showClearButton && <ClearButton onClose={clearHandler} />}
    </>
  );
});
Input.displayName = InputPrimitive.displayName;

export { Input };
