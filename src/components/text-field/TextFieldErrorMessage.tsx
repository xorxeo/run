import { FC, PropsWithChildren } from 'react';

export const InputErrorMessage: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  return (
    <p
      className={'${className}font-serif text-sm text-left block text-red-600'}
    >
      {children}
    </p>
  );
};