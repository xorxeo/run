import { DetailedHTMLProps, SelectHTMLAttributes, forwardRef } from 'react';

export type SelectProps = {
  options: SelectOptions[];
  label?: string;
} & DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

export type SelectOptions = {
  title: string;
  value: any;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, ...restProps }, ref) => {
    return (
      <div className="flex w-full ">
        <select
          ref={ref}
          value="Choose values"
          {...restProps}
          className=" rounded-md w-full border-[1px] border-[#FBBD23] h-12 outline-none"
        >
          <option value="Choose values" disabled>
            Choose values
          </option>
          {options &&
            options.map((option) => (
              <option
                className="hover:bg-red-300"
                key={option.title}
                value={JSON.stringify(option.value)}
              >
                {option.title}
              </option>
            ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';
