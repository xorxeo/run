'use client';
// import { FC, useState } from 'react';
import Image from 'next/image';

import { DistanceFormValues, EventFormValues } from '../event-form.schema';
import DeleteIcon from '../../../../public/icons/delete-icon.svg';
import { DocumentData } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { set } from 'zod';
import { isDistances } from '@/services/hooks/useFormManager';
import { ConfirmationDialog } from '@/components/modal/ConfirmationDialog';
import { useDisclosure } from '@mantine/hooks';

export type Entities = { id: string; entityName: string };

type PreviewEntitiesListProps = {
  entities: DocumentData[];
  onDelete?: () => (id: string) => void;
  onEdit?: () => (id: string) => void;
  title: string;
};

export const PreviewEntitiesList = (props: PreviewEntitiesListProps) => {
  const { entities, onDelete, onEdit, title } = props;
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);

  const handleDelete = (id: string) => () => {
    onDelete ? onDelete()(id) : null;
    setIsDeleteModalOpen(!isDeleteModalOpen);
    close();
  };

  const handleEdit = (id: string) => () => onEdit ? onEdit()(id) : null;

  return (
    <div className="preview-entities-list-container flex flex-col w-full items-center">
      <h2 className="select-none">{title}</h2>

      {entities.length > 0 &&
        isDistances(entities) &&
        entities.map(entity => (
          <div
            key={entity.id}
            className="flex flex-row w-full min-h-12 justify-between items-center pl-2 pr-2 "
          >
            <div
              key={entity.id}
              className="flex w-[70%] h-[100%] min-h-[3rem] select-none items-center justify-center pr-3 overflow-hidden border-[#FBBD23] border-[1px] rounded-md"
            >
              {entity.distanceName}
            </div>
            <button
              className="flex w-[15%] min-h-[3rem]  select-none items-center justify-center border-[1px] hover:bg-[#FBBD23] rounded-md"
              type="button"
              onClick={handleEdit(entity.id)}
            >
              Edit
            </button>
            <button
              className=" flex w-[10%] min-h-[3rem] items-center justify-center border-[1px] hover:bg-[#FBBD23] rounded-md"
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(!isDeleteModalOpen);
                open();
              }}
            >
              <Image
                className="  "
                src={DeleteIcon}
                alt="delete icon"
                height={20}
                width={20}
              ></Image>
            </button>

            <ConfirmationDialog
              opened={opened}
              close={close}
              open={open}
              message="Are you sure you want to delete this distance?"
              cancelButtonTitle="No"
              submitButtonTitle="Yes"
              onCancel={() => close()}
              onSubmit={handleDelete(entity.id)}
            />
          </div>
        ))}
    </div>
  );
};
