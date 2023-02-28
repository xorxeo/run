import { useRef, useState } from "react";

export type CreateEventFormType = {
  title: string;
  description?: string;
  info?: string;
};

export const CreateEventForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [info, setInfo] = useState("");
    
    // const ref1 = useRef<HTMLInputElement>(null);
    
    const data: CreateEventFormType = {
        title,
        description,
        info,
    };
    
    console.log(data);
    
   
  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        placeholder="title"
        onChange={(event) => {
          setTitle(event.target.value);
        }}
      />
      <input
        type="text"
        placeholder="description"
        onChange={(event) => {
          setDescription(event.target.value);
        }}
      />
    </div>
  );
};