import { FC } from 'react';
import { DistanceFormValues } from '../event-form.schema';

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
    <div>
      {distances.map((distance) => (
        <div
          key={distance.id}
          className="flex flex-row h-12 w-full mb-5 items-center justify-between border-[#FBBD23] border-[1px] rounded-md"
        >
          <div key={distance.id} className="flex w-full justify-center">
            {distance.name}
          </div>
          <button type="button" onClick={handleEdit(distance.id)}>
            Edit
          </button>
          <button type="button" onClick={handleDelete(distance.id)}>
            {/* Delete */}
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
