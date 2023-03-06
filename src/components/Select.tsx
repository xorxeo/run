import { forwardRef } from "react"


type Option = {
  label: string;
  value: string | number | string[];
};

type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & { options: Option[] };

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, ...props }, ref) => (
    <select ref={ref} {...props}>
      {options.map(({ label, value }) => (
          <option key={Math.random()} value={value}>{label}</option>
      ))}
    </select>
  )
);

Select.displayName = "Select";

export default Select;