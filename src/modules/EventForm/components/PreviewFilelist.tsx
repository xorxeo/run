import { FC } from 'react';
import { nanoid } from 'nanoid';

import { HandleFileDeletePropsType } from './create-event-form/CreateEventForm';
import Image from 'next/image';
import DeleteIcon from '../../../../public/icons/delete-icon.svg'

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
    <div className="flex flex-col w-full">
      {fileNames.map((name) => (
        <div
          className="flex flex-row w-full min-h-12 justify-between items-center pl-2 pr-2 "
          key={nanoid()}
        >
          <div className="flex w-[70%] h-[100%] min-h-[2.5rem] items-center justify-center pr-3 overflow-hidden border-[#FBBD23] border-[1px] rounded-md">
            {name}
          </div>

          <button
            type="button"
            onClick={handleDelete(name)}
            className="flex w-[30%] min-h-[2.5rem] items-center justify-center border-[1px] hover:bg-[#FBBD23] rounded-md"
          >
            <Image
              className="  "
              src={DeleteIcon}
              alt="delete icon"
              height={20}
              width={20}
            ></Image>
          </button>
        </div>
      ))}
    </div>
  );
};
