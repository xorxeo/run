import { UseFormRegister, FieldValues } from "react-hook-form";
import { RegisterOptions, UseFormRegisterReturn } from "react-hook-form";
import { UseFormReturn } from "react-hook-form";
import { forwardRef } from "react"
// type SelectType = {
//   register: UseFormReturn["register"];
//   options: number[];
//   name: string;
// };

type Option = {
  label: React.ReactNode;
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