import './overlayingPopup.module.css';
import { ReactPortal } from '../react-portal/ReactPortal';
import { ReactNode, useEffect } from 'react';

type OverlayingPopupProps = {
  isOpened: boolean;
  onClose: (value: boolean) => void;
  children: ReactNode;
};

export const OverlayingPopup = ({
  isOpened,
  onClose,
  children,
}: OverlayingPopupProps) => {
  useEffect(() => {
    if (isOpened) {
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
  }, [isOpened]);

  if (!isOpened) return null;

  return (
    <ReactPortal wrapperId="portal-modal-container">
      <div className="popup-container" role="dialog">
        <div
          className="popup-overlay"
          role="button"
          tabIndex={0}
          onClick={() => onClose(!isOpened)}
        />
        {children}
      </div>
    </ReactPortal>
  );
};

// const
