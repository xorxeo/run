import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';
import { Controller, Control } from 'react-hook-form';

import { FieldErrors } from 'react-hook-form/dist/types';

import { TextField } from './TextField';
import { InputErrorMessage } from './TextFieldErrorMessage';

export type FormTextFieldProps = {
  control: Control<any>;
  label?: string;
  name: string;
  className?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const FormTextField: FC<FormTextFieldProps> = (props) => {
  const { className, control, name, label, ...restProps } = props;

  return (
    <Controller
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, isDirty, error },
      }) => (
        <>
          <TextField
            {...restProps}
            className={className}
            ref={ref}
            value={value}
            label={label}
            onChange={onChange}
            onBlur={onBlur}
          />
          {error && <InputErrorMessage>{error.message}</InputErrorMessage>}
        </>
      )}
      name={name}
      control={control}
      rules={{ required: true }}
    />
  );
};
