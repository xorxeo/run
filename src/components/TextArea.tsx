import { DetailedHTMLProps, TextareaHTMLAttributes, forwardRef } from 'react';
import {
  Controller,
  Control,
} from 'react-hook-form';
import { InputErrorMessage } from './text-field/TextFieldErrorMessage';

export type TextAreaProps = {
  control: Control<any>;
  name: string;
  className?: string;
  label?: string;
  pattern?: string;
  title?: string;
  mask?: string;
  replacement?: any;
  placeholder?: string;
  style: (state: boolean) => string;
} & DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    const {
      style,
      control,
      name,
      label,
      pattern,
      title,
      placeholder,
      ...restProps
    } = props;

    const inputRef = ref;

   
    return (
      <Controller
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { invalid, isTouched, isDirty, error },
        }) => (
          <div className="flex flex-col justify-center items-center w-full rounded-md border border-slate-900 ">
            {label && (
              <label className="flex w-full justify-center">{label}</label>
            )}
            <textarea
              {...restProps}
              ref={inputRef}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              title={title}
              placeholder={placeholder}
              // className={`${
              //   invalid === true ? 'border-red-600' : ' focus:border-[#FBBD23]'
              // } placeholder: pt- bg-gray-100 border-0 border-b-2 w-full focus:outline-none resize-y outline-none  min-h-[100px] max-h-[200px]`}
              className={style(invalid)}
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

TextArea.displayName = 'TextArea';

// export default TextArea;
