import { FirebaseContext } from "@/containers/FirebaseContainer";
import { useContext } from "react";
import { CreateEventForm } from "./CreateEventForm";


export const CreateEventModal = () => {
    const firestore = useContext(FirebaseContext)
    
    
    console.log(firestore.db);
     
  
    return (
      <div className="flex">
        <label
          htmlFor="create-event"
          className="flex h-12 w-fit  items-center rounded-lg bg-[#FBBD23] cursor-pointer "
          tabIndex={0}
        >
          <span className="m-2">Create event</span>
        </label>
            
        <input
          type="checkbox"
          id="create-event"
          className="modal-toggle"
        />
            
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create event</h3>

                    <div className="flex justify-center">content</div>  
            <CreateEventForm />        

            <div className="modal-action">
              <label
                htmlFor="create-event"
                className="flex h-12 w-fit items-center rounded-lg bg-[#FBBD23] "
              >
                <span className="m-2 cursor-pointer">Cancel</span>
              </label>

              <button className="flex h-12 w-fit items-center rounded-lg bg-[#FBBD23] ">
                <span className="m-2">Create</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }




