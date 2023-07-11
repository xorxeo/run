'use client';

import { FC } from 'react';
import Image from 'next/image';

import { DistanceFormValues, EventFormValues } from '../event-form.schema';
import DeleteIcon from '../../../../public/icons/delete-icon.svg';
import { DocumentData } from 'firebase/firestore';

export type Entities = { id: string; entityName: string };

type PreviewEntitiesListProps = {
  entities: Entities[] | string;
  onDelete?: () => (id: string) => void;
  onEdit: () => (id: string) => void;
  title: string;
};

export const PreviewEntitiesList: FC<PreviewEntitiesListProps> = (props) => {
  const { entities, onDelete, onEdit, title } = props;

  const handleDelete = (id: string) => () => onDelete ? onDelete()(id) : null;
  const handleEdit = (id: string) => () => onEdit()(id);

  return (
    <div className="flex flex-col w-full ">
      <div>{title}</div>
      {typeof entities !== 'string' &&
        entities.map((entity) => (
          <div
            key={entity.id}
            className="flex flex-row w-full min-h-12 justify-between items-center pl-2 pr-2 "
          >
            <div
              key={entity.id}
              className="flex w-[70%] h-[100%] min-h-[2.5rem] items-center justify-center pr-3 overflow-hidden border-[#FBBD23] border-[1px] rounded-md"
            >
              {entity.entityName}
            </div>
            <button
              className="flex w-[15%] min-h-[2.5rem] items-center justify-center border-[1px] hover:bg-[#FBBD23] rounded-md"
              type="button"
              onClick={handleEdit(entity.id)}
            >
              Edit
            </button>
            <button
              className="flex w-[10%] min-h-[2.5rem] items-center justify-center border-[1px] hover:bg-[#FBBD23] rounded-md"
              type="button"
              onClick={handleDelete(entity.id)}
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
