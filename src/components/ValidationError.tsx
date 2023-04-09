import { FieldErrors } from "react-hook-form"

type Errors = {
    errors: FieldErrors;
    name: string;
}

export const ValidationErrors = (options: Errors) => {
    const  {errors, name } = options;
  return (
    <div className="h-5">
      {errors[name] && (
        <div className="text-red-700">{errors[name]?.message?.toString()}</div>
      )}
    </div>
  );
};
