import Link from "next/link";
import React, { FC, PropsWithChildren } from "react";

 const Events: FC<PropsWithChildren> = (props) => {
  const { children } = props;

  return (
    <div className="events-container h-screen bg-slate-300 text-slate-900 text-3xl">
      Event
      <Link href={"/events"}>{children}</Link>
    </div>
  );
};

export default Events;


