import { useContext } from "react";

import { FirebaseContext } from "@/containers/FirebaseContainer";
import { CreateEventForm } from "../../../components/CreateEventForm";

 const CreateEvent = () => {
  const firestore = useContext(FirebaseContext);

  return (
    <div className="flex flex-col bg-">
      
      <CreateEventForm />
    </div>
  );
};

export default CreateEvent;