import './modal.module.css';
import { ReactPortal } from '../react-portal/ReactPortal';
import { ReactNode, useEffect } from 'react';

type Buttons = {
  title: string;
  onClick: () => void;
};

type ModalELementsType = {
  buttons: Buttons[];
};

type ModalProps = {
  isOpen: boolean;
  handleClose: (value: boolean) => void;
  children: ReactNode;
  modalElements: ModalELementsType;
};

export const Modal = ({
  isOpen,
  handleClose,
  children,
  modalElements: { buttons },
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      // Блокируем прокрутку при открытии модального окна
      document.body.style.overflow = 'hidden';

      // Устанавливаем атрибут tabindex="-1" для всех элементов внутри body, кроме модального окна
      const bodyElements = document.querySelectorAll('body *:not(.my-modal)');
      bodyElements.forEach((element) => {
        element.setAttribute('tabindex', '-1');
      });
    } else {
      // Восстанавливаем прокрутку и атрибут tabindex при закрытии модального окна
      document.body.style.overflow = 'auto';
      const bodyElements = document.querySelectorAll('body *:not(.my-modal)');
      bodyElements.forEach((element) => {
        element.removeAttribute('tabindex');
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCancel = () => {
    handleClose(false);
  };
  const handleConfirm = () => {
    handleClose(false);
  };

  return (
    <ReactPortal wrapperId="portal-modal-container">
      <div className="my-modal">
        <div className="my-modal-content">{children}</div>
        <div className="buttons-container">
          {buttons &&
            buttons.map((button) => (
              <button
                key={button.title}
                onClick={button.onClick}
                className="modal-button"
              >
                {button.title}
              </button>
            ))}
          {/* <button onClick={handleCancel} className="modal-button">
            Cancel
          </button>
          <button onClick={handleConfirm} className="modal-button">
            Confirm
          </button> */}
        </div>
      </div>
    </ReactPortal>
  );
};

// const
