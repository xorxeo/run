import { ErrorMessage } from '@hookform/error-message';
import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FocusEvent,
  forwardRef,
  TextareaHTMLAttributes,
  useState,
} from 'react';
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  Path,
} from 'react-hook-form';
import { InputErrorMessage } from './text-field/TextFieldErrorMessage';

type TextAreaProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  register: UseFormRegister<TFormValues>;
  // value?: string;
  // onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  // onBlur?: ChangeEventHandler<HTMLTextAreaElement>;
  invalid?: string;
  errors: FieldErrors;
} & DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

// type TextAreaProps = DetailedHTMLProps<
//   TextareaHTMLAttributes<HTMLTextAreaElement>,
//   HTMLTextAreaElement
// > & { options: TextAreaOptions };

const TextArea = <TFormValues extends Record<string, unknown>>({
  errors,
  name,
  register,
}: TextAreaProps<TFormValues>) => {
  return (
    <>
      <textarea
        {...(register && register(name))}
        name={name}
        // className={`${
        //   invalid === 'true' ? 'border-red-600' : ' focus:border-[#FBBD23]'
        // } textarea bg-gray-100 w-full focus:outline-none  resize-y outline-none  min-h-[100px] max-h-[200px]`}
        // ref={ref}
      />

      <ErrorMessage
        errors={errors}
        name={name as any}
        render={({ message }) => (
          <InputErrorMessage>{message}</InputErrorMessage>
        )}
      />
    </>
  );
};

TextArea.displayName = 'TextArea';

export default TextArea;
