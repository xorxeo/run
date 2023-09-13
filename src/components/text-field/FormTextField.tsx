import { DetailedHTMLProps, FC, InputHTMLAttributes, forwardRef } from 'react';
import { Controller, Control } from 'react-hook-form';

import { InputErrorMessage } from './TextFieldErrorMessage';
import { Box, MantineSize, MantineSizes, Sx, TextInput, createStyles } from '@mantine/core';

export type FormTextFieldProps = {
  inputSize: MantineSize;
  control: Control<any>;
  label: string;
  name: string;
  style?: (state: boolean) => string;
  pattern?: string;
  mask?: string;
  replacement?: any;
  sx?: Sx;
  withAsterisk?: boolean;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;


export const FormTextField = forwardRef<HTMLInputElement, FormTextFieldProps>(
  (props, ref) => {
    const {
      style,
      control,
      name,
      label,
      pattern,
      sx,
      placeholder,
      withAsterisk,
      inputSize,
      ...restProps
    } = props;

    const inputRef = ref;

    return (
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <Box>
            <TextInput
              {...restProps}
              // ref={focusRef}
              size={inputSize}
              ref={inputRef}
              value={value}
              label={label}
              onChange={onChange}
              onBlur={onBlur}
              pattern={pattern}
              placeholder={placeholder}
              withAsterisk={withAsterisk}
              styles={{
                input: {
                  borderWidth: '1px',
                  '&:focus': error
                    ? { borderColor: 'red' }
                    : { borderColor: '#facc15' },
                },
              }}
            />
            {error && <InputErrorMessage>{error.message}</InputErrorMessage>}
          </Box>
        )}
        name={name}
        control={control}
        rules={{ required: true }}
      />
    );
  }
);

FormTextField.displayName = 'FormTextField';
