import { FirebaseContext } from "@/containers/FirebaseContainer";
import Link from "next/link";
import { useContext } from "react";
import { CreateEventForm } from "../../components/CreateEventForm";

 const CreateEvent = () => {
  const firestore = useContext(FirebaseContext);

  // console.log(firestore.db);

  return (
    <div className="flex">
     <CreateEventForm />
    </div>
  );
};

export default CreateEvent;