import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from 'react';

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
    return (
      <div className="flex flex-col justify-center items-center w-full">
        {label && <label className="">{label}</label>}
        <input
          ref={ref}
          className={className}
          {...restProps}
        />
      </div>
    );
  }
);

TextField.displayName = 'TextField';
