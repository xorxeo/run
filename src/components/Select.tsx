import { forwardRef } from "react";

export type SelectOption = {
  label: string;
  value: string | number | string[];
};

export type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & { options: SelectOption[] };

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, ...props }, ref) => (
    <select ref={ref} {...props}>
      {options.map(({ label, value }) => (
        <option key={Math.random()} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
);

Select.displayName = "Select";

export default Select;
