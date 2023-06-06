import { FC } from 'react';
import Image from 'next/image';

import { DistanceFormValues } from '../event-form.schema';
import DeleteIcon from '../../../../public/icons/delete-icon.svg';

type PreviewDistancesListProps = {
  distances: DistanceFormValues[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

export const PreviewDistancesList: FC<PreviewDistancesListProps> = (props) => {
  const { distances, onDelete, onEdit } = props;

  const handleDelete = (id: string) => () => onDelete(id);
  const handleEdit = (id: string) => () => onEdit(id);

  return (
    <div className="flex flex-col w-full ">
      {distances.map((distance) => (
        <div
          key={distance.id}
          className="flex flex-row w-full min-h-12 justify-between items-center pl-2 pr-2 "
        >
          <div
            key={distance.id}
            className="flex w-[70%] h-[100%] min-h-[2.5rem] items-center justify-center pr-3 overflow-hidden border-[#FBBD23] border-[1px] rounded-md"
          >
            {distance.name}
          </div>
          <button
            className="flex w-[15%] min-h-[2.5rem] items-center justify-center border-[1px] hover:bg-[#FBBD23] rounded-md"
            type="button"
            onClick={handleEdit(distance.id)}
          >
            Edit
          </button>
          <button
            className="flex w-[10%] min-h-[2.5rem] items-center justify-center border-[1px] hover:bg-[#FBBD23] rounded-md"
            type="button"
            onClick={handleDelete(distance.id)}
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

