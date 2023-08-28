import { DetailedHTMLProps, FC, InputHTMLAttributes, forwardRef } from 'react';
import { Controller, Control } from 'react-hook-form';

import { TextField } from './TextField';
import { InputErrorMessage } from './TextFieldErrorMessage';
import { Box, Sx, TextInput, createStyles } from '@mantine/core';
import { useFocusWithin } from '@mantine/hooks';

export type FormTextFieldProps = {
  control: Control<any>;
  label: string;
  name: string;
  style?: (state: boolean) => string;
  pattern?: string;
  mask?: string;
  replacement?: any;
  sx: Sx;
  withAsterisk?: boolean;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const useStyles = createStyles(theme => ({
  // container: {
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '400px',
  //   height: '50px',
  // },
}));

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
      ...restProps
    } = props;

    const inputRef = ref;

    const { classes } = useStyles();

    const { ref: focusRef, focused } = useFocusWithin();

    const styles = {
      input: {
        borderColor: focused ? '#facc15' : 'initial',
      },
    };
    return (
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <Box
          // className="flex flex-col h-fit border border-yellow-400 "
          // ref={focusRef}
          // sx={theme => ({
          //   backgroundColor: focused ? '#facc15' : 'transparent',
          // })}
          >
            <TextInput
              {...restProps}
              // ref={focusRef}
              size="sm"
              ref={inputRef}
              value={value}
              label={label}
              onChange={onChange}
              onBlur={onBlur}
              pattern={pattern}
              // sx={sx}

              styles={
                styles
                // focused
                //   ? {
                //       input: {
                //         borderColor: '#facc15',
                //       },
                //     }
                //   : {
                //       input: {
                //         border: 'none',
                //       },
                //     }
              }
              placeholder={placeholder}
              withAsterisk={withAsterisk}
              // className={style && style(invalid) && classes.input}
              // className={classes.input}
              // onClick={() => console.log(focused)}
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
