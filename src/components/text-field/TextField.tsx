import { DetailedHTMLProps, FC, InputHTMLAttributes, forwardRef } from 'react';

export type InputSize = 'medium' | 'large';
export type InputType = 'text' | 'email';

export type TextFieldProps = {
  label?: string;
  // size?: InputSize;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const sizeMap: { [key in InputSize]: string } = {
  medium: 'p-3 text-base',
  large: 'p-4 text-base',
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, className, /*size,*/ ...restProps }, ref) => {
    // console.log('value', restProps.value);
    return (
      <div className="flex flex-col justify-center items-center w-full">
        {label && <label className="mb-5">{label}</label>}
        <input
          ref={ref}
          className={`w-full h-12 rounded-md bg-gray-100 focus:outline-none outline-none`}
          {...restProps}
        />
      </div>
    );
  }
);
