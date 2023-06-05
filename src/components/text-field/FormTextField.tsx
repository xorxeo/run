import { DetailedHTMLProps, FC, InputHTMLAttributes, forwardRef } from 'react';
import { Controller, Control } from 'react-hook-form';

import { TextField } from './TextField';
import { InputErrorMessage } from './TextFieldErrorMessage';

export type FormTextFieldProps = {
  control: Control<any>;
  label?: string;
  name: string;
  style?: (state: boolean) => string;
  pattern?: string;
  title?: string;
  mask?: string;
  replacement?: any;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const FormTextField = forwardRef<HTMLInputElement, FormTextFieldProps>(
  (props, ref) => {
    const {
      style,
      control,
      name,
      label,
      pattern,
      title,
      ...restProps
    } = props;

    const inputRef = ref;

    return (
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <div className="flex flex-col justify-center rounded-md items-center w-full border border-slate-900 ">
            <TextField
              {...restProps}
              ref={inputRef}
              value={value}
              label={label}
              onChange={onChange}
              onBlur={onBlur}
              pattern={pattern}
              title={title}
              className={style && style(invalid)}
            />
            {error && <InputErrorMessage>{error.message}</InputErrorMessage>}
          </div>
        )}
        name={name}
        control={control}
        rules={{ required: true }}
      />
    );
  }
);

FormTextField.displayName = 'FormTextField';
