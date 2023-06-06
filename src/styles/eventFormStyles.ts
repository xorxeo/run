export const inputStyle = (invalid: boolean) => {
  return `${
    invalid === true ? 'border-red-600' : 'focus:border-[#FBBD23]'
  } mb-5 placeholder: pl-3 placeholder:text-sm rounded-md border-0 border-b-[1px] w-full h-12  focus:outline-none outline-none`;
};

export const textAreaStyle = (invalid: boolean) => {
  return `${
    invalid === true ? 'border-red-600' : 'focus:border-[#FBBD23]'
  } mb-5 placeholder: pt-3 pl-3 placeholder:text-sm rounded-md  border-[1px] w-full  resize-y outline-none  min-h-[80px] max-h-[200px]`;
};
