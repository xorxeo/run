import  {CreateEventModal}  from "@/components/CreateEventModal";
import { useAuth } from "@/containers/AuthUserContainer";
import { FC, PropsWithChildren } from "react";

const Admin: FC<PropsWithChildren> = () => {
    const q = useAuth();
  
  return (
    <div>
      {q.admin && <div>admin</div>}
      <div>{q.authUser?.email}</div>
          <CreateEventModal />
    </div>
  );
};

export default Admin;
