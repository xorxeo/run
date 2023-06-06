import { FC, PropsWithChildren } from "react";
import Link from "next/link";

import { useAuth } from "@/containers/AuthUserContainer";

const Admin: FC<PropsWithChildren> = () => {
  const authUser = useAuth();
  
  return (
    <div>
      {authUser.admin && <div>admin</div>}
      <div>{authUser.authUser?.email}</div>
      <Link
        href="/admin/createEvent"
        className="flex h-12 w-fit  items-center rounded-lg bg-[#FBBD23] cursor-pointer "
      >
        <span className="m-2">Create event</span>
      </Link>
    </div>
  );
};

export default Admin;
