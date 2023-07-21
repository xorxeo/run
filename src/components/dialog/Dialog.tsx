import { FC } from 'react';

import './dialog.module.css';
import { MainPopup } from '@/components/mainPopup/MainPopup';

type DialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  cancelButtonTitle: string;
  submitButtonTitle: string;
  onCancel: () => void;
  onSubmit: () => void;
};

export const Dialog: FC<DialogProps> = ({ isOpen, onCancel, cancelButtonTitle, submitButtonTitle, onSubmit, title, message, type = 'info' }) => {
  return (
    <MainPopup
      isOpened={isOpen}
      onClose={onCancel}
      customStyle=" min-w-[600px] min-h-[400px]"
      // title='Blah-blah'
    >
    <div className="dialog-container">
      <div className="dialog-title">{title}</div>
      <div className="dialog-content">{message}</div>
      <div className="dialog-buttons">
        <div className="dialog-button">
          <button
            className="btn hover:bg-yellow-400"
            onClick={onCancel}
          >
            {cancelButtonTitle}
          </button>
        </div>
        <div className="dialog-button">
          <button
            className="btn hover:bg-green-400"
            onClick={onSubmit}
          >
            {submitButtonTitle}
          </button>
        </div>
      </div>
    </div>
    </MainPopup>
  );
};
