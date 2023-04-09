import { ChangeEventHandler, DetailedHTMLProps, FocusEventHandler, forwardRef, InputHTMLAttributes, SyntheticEvent } from "react";
import { FieldErrors, FieldValues, Control } from "react-hook-form";
import { Controller } from "react-hook-form";

import { DistanceFormValues } from "./CreateDistance";



type InputPropsType = {
  title: string;
  name: string;
  placeholder: string;
  type: string;
  errors?: FieldErrors;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
 
};

type InputType = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & { options: InputPropsType };

const Input = forwardRef<HTMLInputElement, InputType>(
  ({ options, ...props }, ref) => {
    const {
      name,
      placeholder,
      type,
      title,
      errors, ...otherOptions
    } = options;
    return (
      <>
        <div className="flex w-full ">{title}</div>

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          ref={ref}
          {...props}
          {...otherOptions}
        />

        {/* <div className="h-5">
            {errors?.name && (
              <div className="text-red-700">
                {errors.name?.message?.toString()}
              </div>
            )}
          </div> */}
      </>
    );
  }
);

Input.displayName = "Input";
export default Input;
