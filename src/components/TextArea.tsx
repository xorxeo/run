import {
  ChangeEventHandler,
  DetailedHTMLProps,
  FocusEvent,
  forwardRef,
  TextareaHTMLAttributes,
  useState,
} from "react";
import { FieldErrors } from "react-hook-form";

type TextAreaOptions = {
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: ChangeEventHandler<HTMLTextAreaElement>;
  invalid?: string;
  errors: FieldErrors
};

type TextAreaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & { options: TextAreaOptions };

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ options }, ref) => {

    const { invalid, errors } = options;

    return (
      <>
        <textarea
          {...options}
          className={`${
            invalid === "true" ? "border-red-600" : " focus:border-[#FBBD23]"
          } textarea bg-gray-100 w-full focus:outline-none  resize-y outline-none  min-h-[100px] max-h-[200px]`}
          ref={ref}
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

TextArea.displayName = "TextArea";

export default TextArea;
