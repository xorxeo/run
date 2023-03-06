
import Link from "next/link";
import { useAuth } from "@/containers/AuthUserContainer";
import { FC, PropsWithChildren } from "react";

const Admin: FC<PropsWithChildren> = () => {
  const q = useAuth();
  

  return (
    <div>
      {q.admin && <div>admin</div>}
      <div>{q.authUser?.email}</div>
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
