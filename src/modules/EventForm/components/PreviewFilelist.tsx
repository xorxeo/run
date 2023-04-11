import { FC } from 'react';

type PreviewFilelistProps = {
  fileNames: string[];
  onDelete: (name: string) => void;
};

export const PreviewFilelist: FC<PreviewFilelistProps> = (props) => {
  const { fileNames, onDelete } = props;

  const handleDelete = (name: string) => () => onDelete(name);

  return (
    <div>
      {fileNames.map((name) => (
        <div key={name}>
          <span className="mr-1">{name}</span>
          <button type="button" onClick={handleDelete(name)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
