import { FC } from 'react';
import { nanoid } from 'nanoid';

import { HandleFileDeletePropsType } from './create-event-form/CreateEventForm';

type PreviewFilelistProps = {
  fileNames: string[];
  onDeleteProps: HandleFileDeletePropsType;
  onDelete: (
    fileName: string,
    onDeleteProps: HandleFileDeletePropsType
  ) => void;
 
};

export const PreviewFilelist: FC<PreviewFilelistProps> = (props) => {
  const { fileNames, onDelete, onDeleteProps } = props;

  const handleDelete = (fileName: string) => () =>
    onDelete(fileName, onDeleteProps);

  return (
    <div className='flex flex-col w-full'>
      {fileNames.map((name) => (
        <div key={nanoid()}>
          <span className="mr-1">{name}</span>
          <button type="button" onClick={handleDelete(name)}>
            <svg
              className="flex border-[1px] opacity-40 hover:opacity-70 hover:bg-[#FBBD23]"
              height="20"
              width="20"
              viewBox="0 0 20 20"
            >
              <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
