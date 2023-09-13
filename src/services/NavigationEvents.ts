'use client';

import { usePathname, useSearchParams, } from 'next/navigation';
import { useEffect } from 'react';

export function NavigationEvents({
  sideEffectLogic,
}: {
  sideEffectLogic?: () => void;
}) {
  const pathName = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathName}?${searchParams}`;

    console.log(url);

    if (sideEffectLogic) {
      sideEffectLogic();
    }
  }, [pathName, searchParams]);

  return null;
}
